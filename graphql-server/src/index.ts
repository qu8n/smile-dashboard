import express, { Express } from "express";
import path from "path";
const morgan = require("morgan");
import fs from "fs";
import https from "https";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { mergeSchemas } from "@graphql-tools/schema";
import { buildProps } from "./buildProps";
import { EXPRESS_SERVER_ORIGIN, corsOptions } from "./constants";
import { buildNeo4jDbSchema } from "./schemas/neo4j.schema";
import { oracleDbSchema } from "./schemas/oracle.schema";

const props = buildProps();

async function main() {
  const app: Express = express();

  require("./routes")(app);

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

  const httpsServer = https.createServer(
    {
      key: fs.readFileSync(
        path.join(__dirname, "../../.cert/smile-dashboard-web-key.pem")
      ),
      cert: fs.readFileSync(
        path.join(__dirname, "../../.cert/smile-dashboard-web-cert.pem")
      ),
    },
    app
  );

  const neo4jDbSchema = await buildNeo4jDbSchema();

  const mergedSchema = mergeSchemas({
    schemas: [neo4jDbSchema, oracleDbSchema],
  });

  const server = new ApolloServer({
    schema: mergedSchema,
    context: async ({ req }: { req: any }) => {
      return {
        req: {
          user: req.user,
          isAuthenticated: req.isAuthenticated,
        },
      };
    },
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer: httpsServer }),
      ApolloServerPluginLandingPageLocalDefault({
        embed: true,
        includeCookies: true,
      }),
    ],
  });

  await server.start();

  server.applyMiddleware({ app, cors: corsOptions });

  await new Promise<void>((resolve) =>
    httpsServer.listen({ port: 4000 }, resolve)
  );

  console.log(
    `🚀 Server ready at ${EXPRESS_SERVER_ORIGIN}${server.graphqlPath}`
  );
}

main();
