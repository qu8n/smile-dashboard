import { Express } from "express";
import { logInRoute } from "./auth/login";
import { callbackRoute } from "./auth/callback";
import { getUserEmailRoute } from "./auth/get-user-email";
import {
  checkAuthentication,
  updateActiveUserSessions,
} from "../utils/session";
import { logOutRoute } from "./auth/logout";
import { warmUpDatabricks } from "../utils/databricks";

export function configureRoutes(app: Express) {
  app.get("/", (_, res) => res.sendStatus(200)); // health check

  app.get("/auth/login", warmUpDatabricks, logInRoute);

  app.get("/auth/callback", callbackRoute);

  app.get(
    "/auth/get-user-email",
    checkAuthentication,
    updateActiveUserSessions,
    getUserEmailRoute
  );

  app.post("/auth/logout", checkAuthentication, logOutRoute);
}
