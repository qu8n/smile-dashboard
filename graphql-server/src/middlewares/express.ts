import express, { Express } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { corsOptions } from "../utils/constants";

module.exports = function (app: Express) {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(express.json({ limit: "50mb" })); // increase to support bulk searching
  app.use(cors(corsOptions));
};
