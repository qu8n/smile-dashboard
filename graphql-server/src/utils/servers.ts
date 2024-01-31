import { Express } from "express";
import path from "path";
import fs from "fs";
import https from "https";
import { buildNeo4jDbSchema } from "../schemas/neo4j";
import { mergeSchemas } from "@graphql-tools/schema";
import { oracleDbSchema } from "../schemas/oracle";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { updateActiveUserSessions } from "./session";
import { corsOptions } from "./constants";

export function initializeHttpsServer(app: Express) {
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync(
        path.join(__dirname, "../../../.cert/smile-dashboard-web-key.pem")
      ),
      cert: fs.readFileSync(
        path.join(__dirname, "../../../.cert/smile-dashboard-web-cert.pem")
      ),
    },
    app
  );

  return httpsServer;
}

export async function initializeApolloServer(
  httpsServer: https.Server,
  app: Express
) {
  const neo4jDbSchema = await buildNeo4jDbSchema();

  const mergedSchema = mergeSchemas({
    schemas: [neo4jDbSchema, oracleDbSchema],
  });

  const apolloServer = new ApolloServer({
    schema: mergedSchema,
    context: async ({ req }: { req: any }) => {
      updateActiveUserSessions(req);

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

  await apolloServer.start();

  apolloServer.applyMiddleware({ app, cors: corsOptions });

  return apolloServer;
}
