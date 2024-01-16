import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { Strategy } from "openid-client";
const passport = require("passport");
const session = require("express-session");
import { logInRouter } from "./auth/login";
import { callbackRouter } from "./auth/callback";
import { postLoginRouter } from "./auth/post-login";
import { checkLogInRouter } from "./auth/check-login";
import { healthCheckRouter } from "./health-check";
import { buildProps } from "../buildProps";
import { corsOptions } from "../constants";
import {
  getKeycloakClient,
  checkAuthentication,
  updateActiveUserSessions,
} from "../utils/session";
import { logOutRouter } from "./auth/logout";

const props = buildProps();

module.exports = async function (app: Express) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json({ limit: "50mb" })); // increase to support bulk searching
  app.use(cors(corsOptions));

  app.use(
    session({
      secret: props.express_session_secret,
      resave: false,
      saveUninitialized: true,
      store: new session.MemoryStore(),
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

  const keycloakClient = await getKeycloakClient();

  passport.use(
    "oidc",
    new Strategy({ client: keycloakClient }, (tokenSet: any, done: any) => {
      app.locals.sessionIdleTimeout = tokenSet.refresh_expires_in * 1000; // convert to ms to be standardized

      const claims = tokenSet.claims();
      const keycloakUserId = claims.sub;

      app.locals.activeUserSessions[keycloakUserId] = {
        lastActiveTime: Date.now(),
        idTokenHint: tokenSet.id_token,
      };

      return done(null, claims);
    })
  );

  app.get("/", healthCheckRouter);
  app.get("/auth/login", logInRouter);
  app.get("/auth/callback", callbackRouter);
  app.get(
    "/auth/post-login",
    checkAuthentication,
    updateActiveUserSessions,
    postLoginRouter
  );
  app.get(
    "/auth/check-login",
    checkAuthentication,
    updateActiveUserSessions,
    checkLogInRouter
  );
  app.post("/auth/logout", checkAuthentication, logOutRouter);
};
