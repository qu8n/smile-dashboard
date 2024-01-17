import { Express } from "express";
import { logInRouter } from "./auth/login";
import { callbackRouter } from "./auth/callback";
import { postLoginRouter } from "./auth/post-login";
import { checkLogInRouter } from "./auth/check-login";
import {
  checkAuthentication,
  updateActiveUserSessions,
} from "../utils/session";
import { logOutRouter } from "./auth/logout";

module.exports = function (app: Express) {
  app.get("/", (_, res) => res.sendStatus(200)); // health check

  app.get("/auth/login", logInRouter);

  app.get("/auth/callback", callbackRouter);

  app.get(
    "/auth/post-login",
    checkAuthentication,
    updateActiveUserSessions,
    postLoginRouter
  );

  app.get(
    "/auth/check-login",
    checkAuthentication,
    updateActiveUserSessions,
    checkLogInRouter
  );

  app.post("/auth/logout", checkAuthentication, logOutRouter);
};
