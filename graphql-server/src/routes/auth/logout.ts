const passport = require("passport");

export function logOutRouter(
  req: any,
  res: any,
  next: any,
  logOutEverywhere: any
) {
  logOutEverywhere(req, res, next);
}
