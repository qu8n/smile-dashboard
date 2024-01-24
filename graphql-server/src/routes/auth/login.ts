const passport = require("passport");

/**
 * Initiate the authentication request.
 */
export function logInRoute(req: any, res: any, next: any) {
  passport.authenticate("oidc")(req, res, next);
}
