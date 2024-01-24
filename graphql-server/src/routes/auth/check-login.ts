/**
 * Called by navbar on each frontend render to display user email if logged in.
 */
export function checkLogInRoute(req: any, res: any) {
  res.status(200).send(req.user.email);
}
