import { Express } from "express";
const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const fs = require("fs");
const https = require("https");

import { Issuer, Strategy } from "openid-client";
const passport = require("passport");
const expressSession = require("express-session");

const neo4j = require("neo4j-driver");
const { Neo4jGraphQL } = require("@neo4j/graphql");
const { OGM } = require("@neo4j/graphql-ogm");

const ApolloClient = require("apollo-client").ApolloClient;
const { ApolloServer } = require("apollo-server-express");
const { toGraphQLTypeDefs } = require("@neo4j/introspector");
const createHttpLink = require("apollo-link-http").createHttpLink;
const InMemoryCache = require("apollo-cache-inmemory").InMemoryCache;
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");

import { buildResolvers } from "./resolvers";
import { buildProps } from "./buildProps";
import { EXPRESS_SERVER_ORIGIN, REACT_SERVER_ORIGIN } from "./constants";

// OracleDB requires node-oracledb's Thick mode & the Oracle Instant Client, which is unavailable for M1 Macs
let oracledb: any = null;
const os = require("os");
if (os.arch() !== "arm64") {
  oracledb = require("oracledb");
  oracledb.initOracleClient();
  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
}

const props = buildProps();

const driver = neo4j.driver(
  props.neo4j_graphql_uri,
  neo4j.auth.basic(props.neo4j_username, props.neo4j_password)
);

const sessionFactory = () =>
  driver.session({ defaultAccessMode: neo4j.session.WRITE });

async function main() {
  const app: Express = express();
  app.use(express.static(path.resolve(__dirname, "../build")));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json({ limit: "50mb" })); // increase to support bulk searching
  app.use(
    cors({
      origin: REACT_SERVER_ORIGIN,
      credentials: true,
    })
  );

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
    new Strategy(
      { client: keycloakClient },
      (tokenSet: any, userinfo: any, done: any) => {
        ssoSessionIdleTimeout = tokenSet.refresh_expires_in * 1000; // convert to ms because it's in s by default
        const claims = tokenSet.claims();
        activeUserSessions[claims.sub] = {
          lastAuthCheckTime: Date.now(),
          idTokenHint: tokenSet.id_token,
        };
        return done(null, claims);
      }
    )
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

  app.get("/check-login", checkAuthenticated, async (req: any, res) => {
    res.status(200).send(req.user.email);
  });

  function checkAuthorized(req: any, res: any, next: any) {
    const userRoles = req.user.groups;
    if (userRoles.includes("mrn-search")) {
      return next();
    } else {
      res.status(403).send("403 Forbidden");
    }
  }

  const logDir = path.join(process.env.SMILE_DATA_HOME, props.log_dir);
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

  app.post(
    "/mrn-search",
    checkAuthenticated,
    checkAuthorized,
    async (req, res) => {
      const patientIds = req.body;
      const patientIdsTriplets = [];

      if (os.arch() !== "arm64" && oracledb !== null) {
        try {
          const connection = await oracledb.getConnection({
            user: props.oracle_user,
            password: props.oracle_password,
            connectString: props.oracle_connect_string,
          });

          const promises = patientIds.map(async (patientId: string) => {
            const result = await connection.execute(
              "SELECT CMO_ID, DMP_ID, PT_MRN FROM CRDB_CMO_LOJ_DMP_MAP WHERE :patientId IN (DMP_ID, PT_MRN, CMO_ID)",
              { patientId }
            );
            if (result.rows.length > 0) {
              return result.rows[0];
            }
          });

          patientIdsTriplets.push(...(await Promise.all(promises)));
          await connection.close();
        } catch (error) {
          console.error("Error in OracleDB connection: ", error);
        }
      }

      res.status(200).json(patientIdsTriplets);
      return;
    }
  );

  // for health check
  app.get("/", (req, res) => {
    res.sendStatus(200);
  });

  const httpLink = createHttpLink({
    uri: "https://localhost:4000/graphql",
    fetch: fetch,
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
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

  const typeDefs = await toGraphQLTypeDefs(sessionFactory, false);
  const ogm = new OGM({ typeDefs, driver });
  const neoSchema = new Neo4jGraphQL({
    typeDefs,
    driver,
    config: {
      skipValidateTypeDefs: true,
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer: httpsServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    resolvers: buildResolvers(ogm, client),
  });

  Promise.all([neoSchema.getSchema(), ogm.init()]).then(async ([schema]) => {
    const server = new ApolloServer({ schema });
    await server.start();
    server.applyMiddleware({ app });
    await new Promise((resolve) => httpsServer.listen({ port: 4000 }, resolve));
    console.log(
      `🚀 Server ready at ${EXPRESS_SERVER_ORIGIN}${server.graphqlPath}`
    );
  });
}

main();
