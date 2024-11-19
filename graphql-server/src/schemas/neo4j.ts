import neo4j from "neo4j-driver";
import { Neo4jGraphQL } from "@neo4j/graphql";
import { OGM } from "@neo4j/graphql-ogm";
import { toGraphQLTypeDefs } from "@neo4j/introspector";
import { neo4jDriver } from "../utils/servers";

export async function buildNeo4jDbSchema() {
  const sessionFactory = () =>
    neo4jDriver.session({ defaultAccessMode: neo4j.session.WRITE });

  const typeDefs = await toGraphQLTypeDefs(sessionFactory, false);

  const features = {
    filters: {
      String: {
        MATCHES: true,
      },
    },
  };

  const ogm = new OGM({
    typeDefs,
    driver: neo4jDriver,
    features,
  });

  const neoSchema = new Neo4jGraphQL({
    typeDefs,
    driver: neo4jDriver,
    validate: false,
    features,
  });

  await ogm.init();
  const neo4jDbSchema = await neoSchema.getSchema();

  return {
    neo4jDbSchema,
    ogm,
  };
}
