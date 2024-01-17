import { Express } from "express";
import { Strategy } from "openid-client";
const passport = require("passport");
const session = require("express-session");
import { buildProps } from "../utils/buildProps";
import { getKeycloakClient } from "../utils/session";

const props = buildProps();

module.exports = async function (app: Express) {
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
};
