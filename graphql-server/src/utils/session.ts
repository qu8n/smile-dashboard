/**
 * @file Contains utilities for managing user sessions
 */

import { Issuer } from "openid-client";
import { buildProps } from "../buildProps";
import { EXPRESS_SERVER_ORIGIN } from "../constants";
import { logOutRouter } from "../routes/auth/logout";
const fetch = require("node-fetch");

const props = buildProps();

interface SessionConfig {
  activeUserSessions: {
    [keycloakUserId: string]: {
      lastActiveTime: number;
      idTokenHint: string;
    };
  };
  sessionIdleTimeout: number;
}

export async function getKeycloakClient() {
  const keycloakIssuer = await Issuer.discover(props.keycloak_server_uri);

  return new keycloakIssuer.Client({
    client_id: props.keycloak_client_id,
    client_secret: props.keycloak_client_secret,
    redirect_uris: [`${EXPRESS_SERVER_ORIGIN}/auth/callback`],
    response_types: ["code"],
  });
}

export function checkAuthentication(req: any, res: any, next: any) {
  if (req.isAuthenticated()) {
    // checks if `req.user` is defined
    return next();
  } else {
    res.status(401).send("401 Unauthorized");
  }
}

/**
 * Logs out user if their session has been idle for longer than the session idle timeout (configured
 * separately inside the Keycloak admin console). Otherwise, resets the user's last active
 * timestamp to the current time by updating the `activeUserSessions` object.
 *
 * Does nothing if user is not logged in.
 *
 * @param req Express request object
 */
export function updateActiveUserSessions(req: any, res?: any, next?: any) {
  const keycloakUserId = req.user?.sub;

  const { activeUserSessions, sessionIdleTimeout } = req.app
    .locals as SessionConfig;

  if (keycloakUserId in activeUserSessions) {
    const userIdleTime =
      Date.now() - activeUserSessions[keycloakUserId].lastActiveTime;

    if (userIdleTime > sessionIdleTimeout) {
      logOutRouter(req);
    } else {
      req.app.locals.activeUserSessions[keycloakUserId].lastActiveTime =
        Date.now();
    }
  }

  if (next) next();
}
