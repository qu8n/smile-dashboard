import { Express } from "express";
import path from "path";
const morgan = require("morgan");
import fs from "fs";
import { buildProps } from "../utils/buildProps";

const props = buildProps();

module.exports = function (app: Express) {
  const logDir = path.join(process.env.SMILE_DATA_HOME!, props.log_dir);

  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);
  const accessLogStream = fs.createWriteStream(path.join(logDir, "event.log"), {
    flags: "a+",
  });

  morgan.token("userKeycloakId", function (req: any, res: any) {
    return req.user ? req.user.sub : "-";
  });

  app.use(
    morgan(":method :url :status - :date[iso] - :userKeycloakId", {
      stream: accessLogStream,
      skip: function (req: any, res: any) {
        return req.path !== "/mrn-search";
      },
    })
  );
};
