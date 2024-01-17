import { getKeycloakClient } from "../../utils/session";
const fetch = require("node-fetch");

/**
 * Clear user from `activeUserSessions` tracker, `req` object, and their Keycloak session.
 * User is logged out from Keycloak without a "log out?" prompt and redirecting the response.
 */
export async function logOutRouter(req: any) {
  const keycloakUserId = req.user.sub;
  const idTokenHint =
    req.app.locals.activeUserSessions[keycloakUserId].idTokenHint;

  delete req.app.locals.activeUserSessions[keycloakUserId];

  req.logOut((error: any) => {
    if (error) {
      console.error("Error logging out:", error);
    }
  });

  const keycloakClient = await getKeycloakClient();
  await fetch(keycloakClient.endSessionUrl({ id_token_hint: idTokenHint }), {
    mode: "no-cors",
  });
}
