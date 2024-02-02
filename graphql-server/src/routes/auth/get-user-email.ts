/**
 * Called by navbar on each frontend render or upon logging in
 * to display user's email if they are logged in.
 */
export function getUserEmailRoute(req: any, res: any) {
  res.status(200).send(req.user.email);
}
