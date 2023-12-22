const passport = require("passport");

// Initiates the authentication request
export function logInRouter(req: any, res: any, next: any) {
  passport.authenticate("oidc")(req, res, next);
}
