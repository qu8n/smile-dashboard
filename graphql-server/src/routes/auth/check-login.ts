const passport = require("passport");

// for navbar to display user email is logged in
export function checkLogInRouter(req: any, res: any) {
  res.status(200).send(req.user.email);
}
