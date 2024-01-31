import { Express } from "express";
import { Strategy } from "openid-client";
const passport = require("passport");
const session = require("express-session");
import { props } from "../utils/constants";
import { getKeycloakClient } from "../utils/session";

/**
 * This middleware sets up the following session-related mechanisms:
 * - Express-session for storing user info in session store and managing the session cookie
 * - Passport for authenticating users using OpenID Connect (OIDC) protocol with Keycloak as the OIDC provider
 * - Storing timestamp of user's last activity for the auto-timeout functionality
 */
export async function configureSession(app: Express) {
  // For the auto-timeout functionality
  app.locals.sessionIdleTimeout = 0;
  app.locals.activeUserSessions = {};

  app.use(
    session({
      secret: props.express_session_secret,
      resave: false, // prevents resetting the session cookie on every req
      saveUninitialized: false, // avoids storing empty sessions
      store: new session.MemoryStore(),
      cookie: { secure: true },
    })
  );

  app.use(passport.initialize());

  // Enable persistent login sessions; equivalent to `app.use(passport.authenticate('session'))`
  app.use(passport.session());

  // Encrypt and store user info into session after they log in successfully
  passport.serializeUser(function (user: any, done: any) {
    done(null, user);
  });

  // Decrypt and retrieve user info from session each time they make a request
  passport.deserializeUser(function (user: any, done: any) {
    done(null, user);
  });

  const keycloakClient = await getKeycloakClient();

  // Authenticate users using OpenID Connect (OIDC) protocol with Keycloak
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
}
