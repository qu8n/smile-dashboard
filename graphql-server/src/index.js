"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __asyncValues =
  (this && this.__asyncValues) ||
  function (o) {
    if (!Symbol.asyncIterator)
      throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator],
      i;
    return m
      ? m.call(o)
      : ((o =
          typeof __values === "function" ? __values(o) : o[Symbol.iterator]()),
        (i = {}),
        verb("next"),
        verb("throw"),
        verb("return"),
        (i[Symbol.asyncIterator] = function () {
          return this;
        }),
        i);
    function verb(n) {
      i[n] =
        o[n] &&
        function (v) {
          return new Promise(function (resolve, reject) {
            (v = o[n](v)), settle(resolve, reject, v.done, v.value);
          });
        };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function (v) {
        resolve({ value: v, done: d });
      }, reject);
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer, gql } = require("apollo-server-express");
const { toGraphQLTypeDefs } = require("@neo4j/introspector");
const neo4j = require("neo4j-driver");
const { connect, StringCodec } = require("nats");
var PropertiesReader = require("properties-reader");
var properties = new PropertiesReader(
  path.resolve(__dirname, "./env/application.properties")
);
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
const pub_validate_request_update = properties.get(
  "topics.pub_validate_igo_request_update"
);
const pub_validate_sample_update = properties.get(
  "topics.pub_validate_igo_sample_update"
);
const sub_cmo_request_update = properties.get(
  "topics.sub_consumers_cmo_request_update"
);
const sub_cmo_sample_update = properties.get(
  "topics.sub_consumers_cmo_sample_update"
);
const sc = StringCodec();
const tlsOptions = {
  keyFile: nats_key_pem,
  certFile: nats_cert_pem,
  caFile: nats_ca_pem,
};
const natsConnProperties = {
  servers: [nats_url],
  user: nats_username,
  pass: nats_password,
  tls: tlsOptions,
};
var nc = null;
function establishConnection() {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const natsConn = yield connect(natsConnProperties);
      nc = natsConn;
      console.log("Connected to server: ");
      console.log(natsConn.getServer());
      // setting up subscribers
      const sub_req_update = natsConn.subscribe(sub_cmo_request_update);
      (() =>
        __awaiter(this, void 0, void 0, function* () {
          var _a, e_1, _b, _c;
          try {
            for (
              var _d = true,
                sub_req_update_1 = __asyncValues(sub_req_update),
                sub_req_update_1_1;
              (sub_req_update_1_1 = yield sub_req_update_1.next()),
                (_a = sub_req_update_1_1.done),
                !_a;

            ) {
              _c = sub_req_update_1_1.value;
              _d = false;
              try {
                const m = _c;
                console.log(
                  `[${sub_req_update.getProcessed()}]: ${sc.decode(m.data)}`
                );
              } finally {
                _d = true;
              }
            }
          } catch (e_1_1) {
            e_1 = { error: e_1_1 };
          } finally {
            try {
              if (!_d && !_a && (_b = sub_req_update_1.return))
                yield _b.call(sub_req_update_1);
            } finally {
              if (e_1) throw e_1.error;
            }
          }
          // TODO: SET REQUEST STATE TO READY
        }))();
      const sub_sample_update = natsConn.subscribe(sub_cmo_sample_update);
      (() =>
        __awaiter(this, void 0, void 0, function* () {
          var _e, e_2, _f, _g;
          try {
            for (
              var _h = true,
                sub_sample_update_1 = __asyncValues(sub_sample_update),
                sub_sample_update_1_1;
              (sub_sample_update_1_1 = yield sub_sample_update_1.next()),
                (_e = sub_sample_update_1_1.done),
                !_e;

            ) {
              _g = sub_sample_update_1_1.value;
              _h = false;
              try {
                const m = _g;
                console.log(
                  `[${sub_req_update.getProcessed()}]: ${sc.decode(m.data)}`
                );
              } finally {
                _h = true;
              }
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (!_h && !_e && (_f = sub_sample_update_1.return))
                yield _f.call(sub_sample_update_1);
            } finally {
              if (e_2) throw e_2.error;
            }
          }
          // TODO: SET SAMPLE STATE TO READY
        }))();
      // TODO: set up publisher to publish on sample/request update topics
      // const message = JSON.stringify({message});
      // console.log("publishing message", message);
      // natsConn.publish(
      //   "TOPIC TO PUBLISH TO",
      //   sc.encode(message)
      // );
    } catch (err) {
      console.log(
        `error connecting to ${JSON.stringify(natsConnProperties)}`,
        err
      );
    }
  });
}
const mutDefs = gql`
  mutation UpdateRequests($update: RequestUpdateInput, $where: RequestWhere) {
    updateRequests(update: $update, where: $where) {
      requests {
        smileRequestId
        igoRequestId
        dataStatus
      }
    }
  }
`;
const driver = neo4j.driver(
  neo4j_graphql_uri,
  neo4j.auth.basic(neo4j_username, neo4j_password)
);
const sessionFactory = () =>
  driver.session({ defaultAccessMode: neo4j.session.WRITE });
// const resolvers = {
//   Mutation: {
//     updateRequestStatus: async (_source, {requestId, dataStatus}) => {
//       const { x } = await Request.update({
//         where: {
//           "igoRequestId": requestId
//         },
//         update: {
//           "dataStatus": dataStatus
//         }
//       });
//       console.log(x)
//       return x;
//     }
//   }
// }
// We create a async function here until "top level await" has landed
// so we can use async/await
function main() {
  return __awaiter(this, void 0, void 0, function* () {
    establishConnection(); // for nats only
    const typeDefs = yield toGraphQLTypeDefs(sessionFactory, false);
    const neoSchema = new Neo4jGraphQL({ typeDefs, driver });
    const ogm = new OGM({ typeDefs, driver });
    ogm.init();
    const Request = ogm.model("Request");
    const app = express();
    app.use(express.static(path.resolve(__dirname, "../build")));
    app.use(bodyParser.urlencoded({ extended: true }));
    // for health check
    app.get("/", (req, res) => {
      res.sendStatus(200);
    });
    // endpoint for updating status of a given request
    app.post("/requestStatus", (req, res) =>
      __awaiter(this, void 0, void 0, function* () {
        // cant seem to be able to query successfuly for some reason even though the
        // status in the database is being updated to whatever I'm sending to the api
        // see docs here https://neo4j.com/docs/graphql-manual/current/ogm/examples/custom-resolvers/
        console.log("querying by: ", req.body.requestId);
        const { r } = yield Request.find({
          where: {
            igoRequestId: req.body.requestId,
          },
        });
        const { x } = yield Request.update({
          where: {
            igoRequestId: req.body.requestId,
          },
          update: {
            dataStatus: req.body.dataStatus,
          },
        });
        return res.sendStatus(200);
      })
    );
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
      schema: yield neoSchema.getSchema(),
      //    context: ({ req }) => ({ req }),
      plugins: [
        ApolloServerPluginDrainHttpServer({ httpServer }),
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ],
    });
    neoSchema.getSchema().then((schema) => {
      const server = new ApolloServer({
        schema,
      });
    });
    yield server.start();
    server.applyMiddleware({ app });
    yield new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  });
}
main();
