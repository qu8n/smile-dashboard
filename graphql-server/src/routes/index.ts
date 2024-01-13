import { logInRouter } from "./auth/login";
import { callbackRouter } from "./auth/callback";
import { postLoginRouter } from "./auth/post-login";
import { checkLogInRouter } from "./auth/check-login";
import { healthCheckRouter } from "./health";
import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
const passport = require("passport");
import { Strategy } from "openid-client";
import { buildProps } from "../buildProps";
import { corsOptions } from "../constants";
import {
  checkAuthenticated,
  getKeycloakClient,
  logout,
} from "../utils/keycloak";
const session = require("express-session");

const props = buildProps();

module.exports = async function (app: Express) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json({ limit: "50mb" })); // increase to support bulk searching
  app.use(cors(corsOptions));

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

  const keycloakClient = await getKeycloakClient();
  passport.use(
    "oidc",
    new Strategy({ client: keycloakClient }, (tokenSet: any, done: any) => {
      app.locals.sessionIdleTimeout = tokenSet.refresh_expires_in * 1000; // convert to ms to be standardized

      const claims = tokenSet.claims();
      app.locals.activeUserSessions[claims.sub] = {
        lastAuthCheckTime: Date.now(),
        idTokenHint: tokenSet.id_token,
      };
      return done(null, claims);
    })
  );

  function authenticate(req: any, res: any, next: any) {
    checkAuthenticated(req, res, next, app);
  }

  app.get("/", healthCheckRouter);
  app.get("/auth/login", logInRouter);
  app.get("/auth/callback", callbackRouter);
  app.get("/auth/post-login", authenticate, postLoginRouter);
  app.post("/auth/logout", authenticate, (req) => logout(req, app));
  app.get("/auth/check-login", authenticate, checkLogInRouter);
};
