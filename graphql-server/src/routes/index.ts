import { Express } from "express";
import { logInRoute } from "./auth/login";
import { callbackRoute } from "./auth/callback";
import { postLoginRoute } from "./auth/post-login";
import { checkLogInRoute } from "./auth/check-login";
import {
  checkAuthentication,
  updateActiveUserSessions,
} from "../utils/session";
import { logOutRoute } from "./auth/logout";

export function configureRoutes(app: Express) {
  app.get("/", (_, res) => res.sendStatus(200)); // health check

  app.get("/auth/login", logInRoute);

  app.get("/auth/callback", callbackRoute);

  app.get(
    "/auth/post-login",
    checkAuthentication,
    updateActiveUserSessions,
    postLoginRoute
  );

  app.get(
    "/auth/check-login",
    checkAuthentication,
    updateActiveUserSessions,
    checkLogInRoute
  );

  app.post("/auth/logout", checkAuthentication, logOutRoute);
}
