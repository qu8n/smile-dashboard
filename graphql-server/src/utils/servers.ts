import { Express } from "express";
import fs from "fs";
import https from "https";
import { props } from "./constants";
import { buildNeo4jDbSchema } from "../schemas/neo4j";
import { buildCustomSchema } from "../schemas/custom";
import { mergeSchemas } from "@graphql-tools/schema";
import { buildDatabricksSchema } from "../schemas/databricks";
import { ApolloServer } from "apollo-server-express";
import {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} from "apollo-server-core";
import { updateActiveUserSessions } from "./session";
import { corsOptions } from "./constants";
import NodeCache from "node-cache";
import { initializeInMemoryCache } from "./cache";
import neo4j from "neo4j-driver";

export function initializeHttpsServer(app: Express) {
  return https.createServer(
    {
      key: fs.readFileSync(props.web_key_pem),
      cert: fs.readFileSync(props.web_cert_pem),
    },
    app
  );
}

export interface ApolloServerContext {
  req: {
    user: any;
    isAuthenticated: boolean;
  };
  inMemoryCache: NodeCache;
}

export const neo4jDriver = neo4j.driver(
  props.neo4j_graphql_uri,
  neo4j.auth.basic(props.neo4j_username, props.neo4j_password),
  { disableLosslessIntegers: true } // maps Cypher Integer to JavaScript Number
);

export async function initializeApolloServer(
  httpsServer: https.Server,
  app: Express
) {
  console.info("Building, generating, and merging schemas...");
  const { neo4jDbSchema, ogm } = await buildNeo4jDbSchema();
  const customSchema = await buildCustomSchema(ogm);
  const databricksSchema = await buildDatabricksSchema();
  const mergedSchema = mergeSchemas({
    schemas: [neo4jDbSchema, databricksSchema, customSchema],
  });

  const inMemoryCache = await initializeInMemoryCache();

  const apolloServer = new ApolloServer<ApolloServerContext>({
    schema: mergedSchema,
    cache: "bounded",
    context: async ({ req }: { req: any }) => {
      updateActiveUserSessions(req);

      return {
        req: {
          user: req.user,
          isAuthenticated: req.isAuthenticated,
        },
        inMemoryCache: inMemoryCache,
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
