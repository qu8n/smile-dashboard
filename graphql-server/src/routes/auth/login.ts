const passport = require("passport");

/**
 * Initiate the authentication request.
 */
export function logInRouter(req: any, res: any, next: any) {
  passport.authenticate("oidc")(req, res, next);
}
