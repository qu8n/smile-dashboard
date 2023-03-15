import { Express } from "express";

const path = require("path");
const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer } = require("apollo-server-express");
const { toGraphQLTypeDefs } = require("@neo4j/introspector");
const neo4j = require("neo4j-driver");
const { connect, StringCodec, headers } = require("nats");
var PropertiesReader = require("properties-reader");
var properties = new PropertiesReader(
  path.resolve(__dirname, "../dist/env/application.properties")
);
const request = require("request");
const http = require("http");
const bodyParser = require("body-parser");
const express = require("express");
const {
  ApolloServerPluginDrainHttpServer,
  ApolloServerPluginLandingPageLocalDefault,
} = require("apollo-server-core");
const { OGM } = require("@neo4j/graphql-ogm");

// neo4j connection properties
const neo4j_graphql_uri = properties.get("db.neo4j_graphql_uri");
const neo4j_username = properties.get("db.neo4j_username");
const neo4j_password = properties.get("db.neo4j_password");

// nats connection properties
const nats_username = properties.get("conn.nats_username");
const nats_password = properties.get("conn.nats_password");
const nats_key_pem = properties.get("conn.nats_key_pem");
const nats_cert_pem = properties.get("conn.nats_cert_pem");
const nats_ca_pem = properties.get("conn.nats_ca_pem");
const nats_url = properties.get("conn.nats_url");

// pub-sub topics
const pub_validate_sample_update = properties.get(
  "topics.pub_validate_igo_sample_update"
);

// smile sample endpoint
const smile_sample_endpoint = properties.get("smile.smile_sample_endpoint");

const sc = StringCodec();

const tlsOptions = {
  keyFile: nats_key_pem,
  certFile: nats_cert_pem,
  caFile: nats_ca_pem,
  rejectUnauthorized: false,
};

const natsConnProperties = {
  servers: [nats_url],
  user: nats_username,
  pass: nats_password,
  tls: tlsOptions,
};

async function publishNatsMessage(topic: String, message: any) {
  try {
    const natsConn = await connect(natsConnProperties);
    console.log("Connected to server: ");
    console.log(natsConn.getServer());
    console.log("publishing message: ", message, "\nto topic", topic);
    const h = headers();
    h.append("Nats-Msg-Subject", topic);
    natsConn.publish(topic, sc.encode(JSON.stringify(message)), { headers: h });
  } catch (err) {
    console.log(
      `error connecting to ${JSON.stringify(natsConnProperties)}`,
      err
    );
  }
}

const driver = neo4j.driver(
  neo4j_graphql_uri,
  neo4j.auth.basic(neo4j_username, neo4j_password)
);

const sessionFactory = () =>
  driver.session({ defaultAccessMode: neo4j.session.WRITE });

async function main() {
  const app: Express = express();
  app.use(express.static(path.resolve(__dirname, "../build")));
  app.use(bodyParser.urlencoded({ extended: true }));

  // for health check
  app.get("/", (req, res) => {
    res.sendStatus(200);
  });

  const httpServer = http.createServer(app);
  const typeDefs = await toGraphQLTypeDefs(sessionFactory, false);
  const ogm = new OGM({ typeDefs, driver });
  const neoSchema = new Neo4jGraphQL({
    typeDefs,
    driver,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageLocalDefault({ embed: true }),
    ],
    resolvers: {
      Mutation: {
        updateSamples: async (_source: any, { where, update }: any) => {
          console.log(
            "querying endpoint: ",
            smile_sample_endpoint +
              where.hasMetadataSampleMetadataConnection_SOME.node.primaryId
          );
          await request(
            smile_sample_endpoint +
              where.hasMetadataSampleMetadataConnection_SOME.node.primaryId,
            { json: true },
            async (err: any, res: any) => {
              if (err) {
                return console.log(err);
              }
              // get latest sample metadata from smile web service
              let sampleData = res.body;

              // set revisable to false for sample
              let sample = ogm.model("Sample");
              const d = await sample.update({
                where: { smileSampleId: sampleData.smileSampleId },
                update: { revisable: false },
              });

              // apply updates to metadata
              const smdataupdates =
                update.hasMetadataSampleMetadata[0].update.node;
              Object.keys(smdataupdates).forEach((key: string) => {
                sampleData[key] = smdataupdates[key];
              });

              // publish sample update to nats server
              publishNatsMessage(
                pub_validate_sample_update,
                JSON.stringify(sampleData)
              );
              return {
                data: { updateSamples: { samples: [sampleData] } },
              };
            }
          );
        },
      },
    },
  });

  Promise.all([neoSchema.getSchema(), ogm.init()]).then(async ([schema]) => {
    const server = new ApolloServer({
      schema,
    });
    await server.start();
    server.applyMiddleware({ app });
    await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  });
}

main();
