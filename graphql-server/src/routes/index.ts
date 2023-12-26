import { logInRouter } from "./auth/login";
import { callbackRouter } from "./auth/callback";
import { postLoginRouter } from "./auth/post-login";
import { logOutRouter } from "./auth/logout";
import { checkLogInRouter } from "./auth/check-login";
import { healthCheckRouter } from "./health";
const fetch = require("node-fetch");
import express, { Express } from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
const passport = require("passport");
import { Issuer, Strategy } from "openid-client";
import { buildProps } from "../buildProps";
import { EXPRESS_SERVER_ORIGIN, corsOptions } from "../constants";
const session = require("express-session");

const props = buildProps();

module.exports = async function (app: Express) {
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

  const memoryStore = new session.MemoryStore();
  app.use(
    session({
      secret: props.express_session_secret,
      resave: false,
      saveUninitialized: true,
      store: memoryStore,
      cookie: { secure: true },
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

  app.get("/", healthCheckRouter);
  app.get("/auth/login", logInRouter);
  app.get("/auth/callback", callbackRouter);
  app.get("/auth/post-login", checkAuthenticated, postLoginRouter);
  app.post("/auth/logout", checkAuthenticated, (req, res, next) =>
    logOutRouter(req, res, next, logOutEverywhere)
  );
  app.get("/auth/check-login", checkAuthenticated, checkLogInRouter);
};
