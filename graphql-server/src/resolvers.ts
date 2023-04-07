import { SamplesDocument, SortDirection } from "./generated/graphql";
import { connect, headers, StringCodec } from "nats";
import { OGM } from "@neo4j/graphql-ogm";
import { buildProps } from "./buildProps";
const request = require("request-promise-native");
const ApolloClient = require("apollo-client").ApolloClient;

const props = buildProps();

export function buildResolvers(ogm: OGM, apolloClient: typeof ApolloClient) {
  return {
    Mutation: {
      async updateSamples(_source: any, { where, update }: any) {
        const data = await request(
          props.smile_sample_endpoint +
            where.hasMetadataSampleMetadataConnection_SOME.node.primaryId,
          { json: true }
        );

        const smdataupdates = update.hasMetadataSampleMetadata[0].update.node;
        Object.keys(smdataupdates).forEach((key: string) => {
          data[key] = smdataupdates[key];
        });

        // remove 'status' from sample metadata to ensure validator and label
        // generator use latest status data added during validation process
        delete data["status"];

        // add isCmoSample to sample's 'additionalProperties' if not already present
        // this is to ensure that cmo samples get sent to the label generator after validation
        // since some of the older SMILE samples do not have this additionalProperty set
        if (data["additionalProperties"]["isCmoSample"] == null) {
          const requestId = data["additionalProperties"]["igoRequestId"];
          let req = ogm.model("Request");
          const rd = await req.find({
            where: { igoRequestId: requestId },
          });
          data["additionalProperties"]["isCmoSample"] =
            rd[0]["isCmoRequest"].toString();
        }

        // fire and forget
        publishNatsMessage(
          props.pub_validate_sample_update,
          JSON.stringify(data)
        );

        let sample = ogm.model("Sample");

        await sample.update({
          where: { smileSampleId: data.smileSampleId },
          update: { revisable: false },
        });

        const updatedSamples = await apolloClient.query({
          query: SamplesDocument,
          variables: {
            where: {
              smileSampleId: data.smileSampleId,
            },
            hasMetadataSampleMetadataOptions2: {
              sort: [{ importDate: SortDirection.Desc }],
              limit: 1,
            },
          },
        });

        Object.keys(smdataupdates).forEach((key: string) => {
          updatedSamples.data.samples[0].hasMetadataSampleMetadata[0][key] =
            smdataupdates[key];
        });

        return {
          samples: updatedSamples.data.samples,
        };
      },
    },
  };
}

async function publishNatsMessage(topic: string, message: any) {
  const sc = StringCodec();

  const tlsOptions = {
    keyFile: props.nats_key_pem,
    certFile: props.nats_cert_pem,
    caFile: props.nats_ca_pem,
    rejectUnauthorized: false,
  };

  const natsConnProperties = {
    servers: [props.nats_url],
    user: props.nats_username,
    pass: props.nats_password,
    tls: tlsOptions,
  };

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
