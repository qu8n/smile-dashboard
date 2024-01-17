const passport = require("passport");

export function logInRouter(req: any, res: any, next: any) {
  // Initiate the authentication request
  passport.authenticate("oidc")(req, res, next);
}
