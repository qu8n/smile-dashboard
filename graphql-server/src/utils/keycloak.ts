import { Issuer } from "openid-client";
import { buildProps } from "../buildProps";
import { EXPRESS_SERVER_ORIGIN } from "../constants";
const fetch = require("node-fetch");

const props = buildProps();

export interface SessionConfig {
  activeUserSessions: {
    [keycloakUserId: string]: {
      lastAuthCheckTime: number;
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

export async function logout(req: any, app: any) {
  const keycloakClient = await getKeycloakClient();

  const keycloakUserId = req.user.sub;
  const idTokenHint = app.locals.activeUserSessions[keycloakUserId].idTokenHint;
  delete app.locals.activeUserSessions[keycloakUserId];

  // Clear Passport session/user object from req
  req.logOut((error: any) => {
    if (error) {
      console.error("Error logging out:", error);
    }
  });

  // Clear Keycloak session directly without "log out?" prompt and without redirecting the response
  fetch(keycloakClient.endSessionUrl({ id_token_hint: idTokenHint }), {
    mode: "no-cors",
  });
}

export function checkAuthenticated(req: any, res: any, next: any, app: any) {
  const keycloakUserId = req.user?.sub;

  const { activeUserSessions, sessionIdleTimeout } =
    app.locals as SessionConfig;

  if (keycloakUserId in activeUserSessions) {
    const idleTime =
      Date.now() - activeUserSessions[keycloakUserId].lastAuthCheckTime;

    if (idleTime > sessionIdleTimeout) {
      logout(req, app);
    } else {
      app.locals.activeUserSessions[keycloakUserId].lastAuthCheckTime =
        Date.now();
    }
  }

  if (req.isAuthenticated()) {
    return next();
  } else {
    res.status(401).send("401 Unauthorized");
  }
}
