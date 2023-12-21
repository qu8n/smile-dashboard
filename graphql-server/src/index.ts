import express, { Express } from "express";
const fetch = require("node-fetch");
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
const morgan = require("morgan");
import fs from "fs";
import https from "https";
import { Issuer, Strategy } from "openid-client";
const passport = require("passport");
const expressSession = require("express-session");
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { mergeSchemas } from "@graphql-tools/schema";
import { buildProps } from "./buildProps";
import { EXPRESS_SERVER_ORIGIN, REACT_SERVER_ORIGIN } from "./constants";
import { buildNeo4jDbSchema } from "./schemas/neo4j.schema";
import { oracleDbSchema } from "./schemas/oracle.schema";

const props = buildProps();

const corsOptions = {
  origin: REACT_SERVER_ORIGIN,
  credentials: true,
};

async function main() {
  const app: Express = express();
  app.use(express.static(path.resolve(__dirname, "../build")));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json({ limit: "50mb" })); // increase to support bulk searching
  app.use(cors(corsOptions));

  const keycloakIssuer = await Issuer.discover(props.keycloak_server_uri);

  const keycloakClient = new keycloakIssuer.Client({
    client_id: props.keycloak_client_id,
    client_secret: props.keycloak_client_secret,
    redirect_uris: [`${EXPRESS_SERVER_ORIGIN}/auth/callback`],
    response_types: ["code"],
  });

  const memoryStore = new expressSession.MemoryStore();
  app.use(
    expressSession({
      secret: props.express_session_secret,
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
    })
  );

  app.use(passport.initialize());

  // Enables persistent login sessions; equivalent to `app.use(passport.authenticate('session'))`
  app.use(passport.session());

  // These two functions are required for the Session strategy above to work
  passport.serializeUser(function (user: any, done: any) {
    done(null, user);
  });
  passport.deserializeUser(function (user: any, done: any) {
    done(null, user);
  });

  let ssoSessionIdleTimeout = 0;
  let activeUserSessions: {
    [keycloakUserId: string]: {
      lastAuthCheckTime: number;
      idTokenHint: string;
    };
  } = {};

  passport.use(
    "oidc",
    new Strategy({ client: keycloakClient }, (tokenSet: any, done: any) => {
      ssoSessionIdleTimeout = tokenSet.refresh_expires_in * 1000; // convert to ms to be standardized
      const claims = tokenSet.claims();
      activeUserSessions[claims.sub] = {
        lastAuthCheckTime: Date.now(),
        idTokenHint: tokenSet.id_token,
      };
      return done(null, claims);
    })
  );

  app.get("/login", (req, res, next) => {
    // Initiates the authentication request
    passport.authenticate("oidc")(req, res, next);
  });

  app.get("/auth/callback", (req, res, next) => {
    // This second passport.authenticate() serves a distinct function from the above.
    // Lets Keycloak respond to the above authentication request, following the OpenID protocol.
    // If successful, this adds `isAuthenticated()` to the `req` object which is used below.
    passport.authenticate("oidc", {
      successRedirect: "/post-login",
      failureRedirect: "/",
    })(req, res, next);
  });

  function logOutEverywhere(req: any, res: any, next: any) {
    const idTokenHint = activeUserSessions[req.user.sub].idTokenHint;
    delete activeUserSessions[req.user.sub];

    // Clear Passport session/user object from req
    req.logOut((error: any) => {
      if (error) {
        return next(error);
      }
    });

    // Clear Keycloak session directly without "log out?" prompt and without redirecting the response
    fetch(keycloakClient.endSessionUrl({ id_token_hint: idTokenHint }), {
      mode: "no-cors",
    });
  }

  function checkAuthenticated(req: any, res: any, next: any) {
    const keycloakUserId = req.user?.sub;

    if (keycloakUserId in activeUserSessions) {
      const userDetails = activeUserSessions[keycloakUserId];
      const lastAuthCheckTime = Date.now() - userDetails.lastAuthCheckTime;

      if (lastAuthCheckTime > ssoSessionIdleTimeout) {
        logOutEverywhere(req, res, next);
      } else {
        userDetails.lastAuthCheckTime = Date.now();
      }
    }

    if (req.isAuthenticated()) {
      return next();
    } else {
      res.status(401).send("401 Unauthorized");
    }
  }

  app.get("/post-login", checkAuthenticated, (req: any, res) => {
    const userEmail = req.user.email;
    res.send(`
      <script>
        window.opener.postMessage(${JSON.stringify(
          userEmail
        )}, "${REACT_SERVER_ORIGIN}/patients");
        window.onload = function() {
          setTimeout(function() {
            window.close();
          }, 1000);
        };
      </script>
      <p>You are logged in.</p>
    `);
  });

  app.post("/logout", (req: any, res, next) => {
    logOutEverywhere(req, res, next);
  });

  // for navbar to display user email is logged in
  app.get("/check-login", checkAuthenticated, async (req: any, res) => {
    res.status(200).send(req.user.email);
  });

  const logDir = path.join(process.env.SMILE_DATA_HOME!, props.log_dir);
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
  const accessLogStream = fs.createWriteStream(path.join(logDir, "event.log"), {
    flags: "a+",
  });
  morgan.token("userKeycloakId", function (req: any, res: any) {
    return req.user ? req.user.sub : "-";
  });
  app.use(
    morgan(":method :url :status - :date[iso] - :userKeycloakId", {
      stream: accessLogStream,
      skip: function (req: any, res: any) {
        return req.path !== "/mrn-search";
      },
    })
  );

  // for health check
  app.get("/", (req, res) => {
    res.sendStatus(200);
  });

  const httpsServer = https.createServer(
    {
      key: fs.readFileSync(
        path.join(__dirname, "../../.cert/smile-dashboard-web-key.pem")
      ),
      cert: fs.readFileSync(
        path.join(__dirname, "../../.cert/smile-dashboard-web-cert.pem")
      ),
    },
    app
  );

  const neo4jDbSchema = await buildNeo4jDbSchema();

  const mergedSchema = mergeSchemas({
    schemas: [neo4jDbSchema, oracleDbSchema],
  });

  const server = new ApolloServer({
    schema: mergedSchema,
    context: async ({ req }: { req: any }) => {
      return {
        req: {
          user: req.user,
          isAuthenticated: req.isAuthenticated,
        },
      };
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer: httpsServer }),
      ApolloServerPluginLandingPageLocalDefault({
        embed: true,
        includeCookies: true,
      }),
    ],
  });

  await server.start();

  server.applyMiddleware({ app, cors: corsOptions });

  await new Promise<void>((resolve) =>
    httpsServer.listen({ port: 4000 }, resolve)
  );

  console.log(
    `🚀 Server ready at ${EXPRESS_SERVER_ORIGIN}${server.graphqlPath}`
  );
}

main();
