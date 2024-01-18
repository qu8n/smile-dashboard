const passport = require("passport");

/**
 * This second passport.authenticate() serves a distinct function from the one called by the logInRouter.
 * It lets Keycloak respond to the above authentication request, following the OpenID protocol.
 * If successful, Passport adds `user` and `isAuthenticated()` to the `req` object.
 */
export function callbackRouter(req: any, res: any, next: any) {
  passport.authenticate("oidc", {
    successRedirect: "/auth/post-login",
    failureRedirect: "/",
  })(req, res, next);
}
