import neo4j from "neo4j-driver";
import { Neo4jGraphQL } from "@neo4j/graphql";
import { OGM } from "@neo4j/graphql-ogm";
import { toGraphQLTypeDefs } from "@neo4j/introspector";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { props } from "../utils/constants";
import {
  SampleHasMetadataSampleMetadataUpdateFieldInput,
  SampleHasTempoTemposUpdateFieldInput,
  SampleMetadata,
  SampleMetadataUpdateInput,
  SampleUpdateInput,
  SampleWhere,
  SamplesDocument,
  SortDirection,
  Tempo,
  UpdateSamplesMutationResponse,
} from "../generated/graphql";
import { connect, headers, StringCodec } from "nats";
const fetch = require("node-fetch");
const request = require("request-promise-native");
import { ApolloClient, ApolloQueryResult } from "apollo-client";
import { gql } from "apollo-server";
import {
  flattenedCohortFields,
  flattenedPatientFields,
  flattenedRequestFields,
  flattenedSampleFields,
  generateFieldResolvers,
  sortArrayByNestedField,
} from "../utils/flattening";
import { ApolloServerContext } from "../utils/servers";
import {
  CachedOncotreeData,
  includeCancerTypeFieldsInSearch,
} from "../utils/oncotree";

type SortOptions = { [key: string]: SortDirection }[];

export const driver = neo4j.driver(
  props.neo4j_graphql_uri,
  neo4j.auth.basic(props.neo4j_username, props.neo4j_password),
  { disableLosslessIntegers: true } // maps Cypher Integer to JavaScript Number
);

export async function buildNeo4jDbSchema() {
  const sessionFactory = () =>
    driver.session({ defaultAccessMode: neo4j.session.WRITE });

  const httpLink = createHttpLink({
    uri: "https://localhost:4000/graphql",
    fetch: fetch,
  });

  const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache(),
  });

  const typeDefs = await toGraphQLTypeDefs(sessionFactory, false);
  const extendedTypeDefs = gql`
    ${typeDefs}

    extend type Request {
      importDate: String
      totalSampleCount: Int
    }

    extend type Patient {
      cmoPatientId: String
      dmpPatientId: String
      totalSampleCount: Int
      cmoSampleIds: String
      consentPartA: String
      consentPartC: String
    }

    extend type Sample {
      # Flattened fields: SampleMetadata
      additionalProperties: String
      baitSet: String
      cfDNA2dBarcode: String
      cmoInfoIgoId: String
      cmoPatientId: String
      cmoSampleIdFields: String
      cmoSampleName: String
      collectionYear: String
      genePanel: String
      igoComplete: Boolean
      igoRequestId: String
      importDate: String
      investigatorSampleId: String
      libraries: String
      oncotreeCode: String
      preservation: String
      primaryId: String
      qcReports: String
      sampleClass: String
      sampleName: String
      sampleOrigin: String
      sampleType: String
      sex: String
      species: String
      tissueLocation: String
      tubeId: String
      tumorOrNormal: String
      # Flattened fields: SampleMetadata Status
      validationReport: String
      validationStatus: Boolean
      # Flattened fields: Oncotree
      cancerType: String
      cancerTypeDetailed: String
      # Flattened fields: Tempo
      smileTempoId: String
      billed: Boolean
      costCenter: String
      billedBy: String
      custodianInformation: String
      accessLevel: String
      # Flattened fields: Tempo events
      initialPipelineRunDate: String
      embargoDate: String
      bamCompleteDate: String
      bamCompleteStatus: String
      mafCompleteDate: String
      mafCompleteNormalPrimaryId: String
      mafCompleteStatus: String
      qcCompleteDate: String
      qcCompleteResult: String
      qcCompleteReason: String
      qcCompleteStatus: String
      # Other
      recipe: String
      dmpPatientId: String
    }

    extend type Cohort {
      totalSampleCount: Int
      smileSampleIds: [String]
      billed: String
      initialCohortDeliveryDate: String
      endUsers: String
      pmUsers: String
      projectTitle: String
      projectSubtitle: String
      status: String
      type: String
    }
  `;

  const ogm = new OGM({ typeDefs: extendedTypeDefs, driver });
  const neoSchema = new Neo4jGraphQL({
    typeDefs: extendedTypeDefs,
    driver,
    config: {
      skipValidateTypeDefs: true,
    },
    resolvers: buildResolvers(ogm, client),
  });

  await ogm.init();
  const neo4jDbSchema = await neoSchema.getSchema();

  return neo4jDbSchema;
}

function buildResolvers(
  ogm: OGM,
  apolloClient: ApolloClient<NormalizedCacheObject>
) {
  return {
    Mutation: {
      async updateSamples(
        _source: any,
        { where, update }: { where: SampleWhere; update: SampleUpdateInput }
      ) {
        // Grab data passed in from the frontend
        const primaryId =
          where.hasMetadataSampleMetadataConnection_SOME!.node!.primaryId!;

        const sampleKeyForUpdate = Object.keys(
          update
        )[0] as keyof SampleUpdateInput;

        const changedFields = (
          update[sampleKeyForUpdate] as Array<
            | SampleHasMetadataSampleMetadataUpdateFieldInput
            | SampleHasTempoTemposUpdateFieldInput
          >
        )[0].update!.node!;

        // Get sample manifest from SMILE API /sampleById and update fields that were changed
        const sampleManifest = await request(
          props.smile_sample_endpoint + primaryId,
          {
            json: true,
          }
        );

        Object.keys(changedFields).forEach((changedField) => {
          const key = changedField as keyof SampleMetadataUpdateInput;
          sampleManifest[key] =
            changedFields[key as keyof typeof changedFields];
        });

        // Get the sample data from the database and update the fields that were changed
        const updatedSamples: ApolloQueryResult<UpdateSamplesMutationResponse> =
          await apolloClient.query({
            query: SamplesDocument,
            variables: {
              where: {
                smileSampleId: sampleManifest.smileSampleId,
              },
              hasMetadataSampleMetadataOptions2: {
                sort: [{ importDate: SortDirection.Desc }],
                limit: 1,
              },
            },
          });

        Object.keys(changedFields).forEach((key) => {
          const sample = updatedSamples.data.samples[0][sampleKeyForUpdate] as
            | SampleMetadata[]
            | Tempo[];
          if (Array.isArray(sample) && sample.length > 0) {
            sample[0][key as keyof typeof sample[0]] =
              changedFields[key as keyof typeof changedFields];
          }
        });

        // Publish the data updates to NATS
        if ("hasMetadataSampleMetadata" in update) {
          await publishNatsMessageForSampleMetadataUpdates(sampleManifest, ogm);
        } else if ("hasTempoTempos" in update) {
          await publishNatsMessageForSampleBillingUpdates(
            primaryId,
            updatedSamples
          );
        } else {
          throw new Error("Unknown update field");
        }

        // Return the updated samples data to enable optimistic UI updates.
        // The shape of the data returned here doesn't fully match the shape of the data
        // in the frontend, but it has all the fields being updated
        return {
          samples: updatedSamples.data.samples,
        };
      },
    },
    Query: {
      async requests(_source: undefined, args: any) {
        const requests = await ogm.model("Request").find({
          where: args.where,
          options: {
            sort: args.options?.sort,
          },
          selectionSet: `{
            igoRequestId
            igoProjectId
            genePanel
            dataAnalystName
            dataAnalystEmail
            dataAccessEmails
            bicAnalysis
            investigatorEmail
            investigatorName
            isCmoRequest
            labHeadEmail
            labHeadName
            libraryType
            otherContactEmails
            piEmail
            projectManagerName
            qcAccessEmails
            smileRequestId
            hasMetadataRequestMetadata {
              importDate
            }
            hasSampleSamplesConnection {
              totalCount
            }
          }`,
        });

        if (args.options?.sort) {
          const sortOptions: SortOptions = args.options.sort;
          const sortField = Object.keys(sortOptions[0])[0];
          const sortOrder = Object.values(sortOptions[0])[0];

          if (flattenedRequestFields.includes(sortField)) {
            sortArrayByNestedField(requests, "Request", sortField, sortOrder);
          }
        }

        if (args.options?.limit == null) {
          return requests;
        }
        return requests.slice(args.options.offset, args.options.limit);
      },
      async patients(_source: undefined, args: any) {
        const patients = await ogm.model("Patient").find({
          where: args.where,
          options: {
            sort: args.options?.sort,
          },
          selectionSet: `{
            smilePatientId
            hasSampleSamples {
              smileSampleId
              hasMetadataSampleMetadata {
                primaryId
                cmoSampleName
                additionalProperties
                cmoPatientId
              }
            }
            hasSampleSamplesConnection {
              totalCount
            }
            patientAliasesIsAlias {
              namespace
              value
            }
          }`,
        });

        if (args.options?.sort) {
          const sortOptions: SortOptions = args.options.sort;
          const sortField = Object.keys(sortOptions[0])[0];
          const sortOrder = Object.values(sortOptions[0])[0];

          if (flattenedPatientFields.includes(sortField)) {
            sortArrayByNestedField(patients, "Patient", sortField, sortOrder);
          }
        }

        if (args.options?.limit == null) {
          return patients;
        }
        return patients.slice(args.options.offset, args.options.limit + 1);
      },
      async samples(
        _source: undefined,
        args: any,
        { oncotreeCache }: ApolloServerContext
      ) {
        let customWhere = includeCancerTypeFieldsInSearch(
          args.where,
          oncotreeCache
        );

        const samples = await ogm.model("Sample").find({
          where: customWhere,
          options: args.options,
          selectionSet: `{
            datasource
            revisable
            sampleCategory
            sampleClass
            smileSampleId
            hasMetadataSampleMetadata {
              additionalProperties
              baitSet
              cfDNA2dBarcode
              cmoInfoIgoId
              cmoPatientId
              cmoSampleIdFields
              cmoSampleName
              collectionYear
              genePanel
              igoComplete
              igoRequestId
              importDate
              investigatorSampleId
              libraries
              oncotreeCode
              preservation
              primaryId
              qcReports
              sampleClass
              sampleName
              sampleOrigin
              sampleType
              sex
              species
              tissueLocation
              tubeId
              tumorOrNormal
              hasStatusStatuses {
                validationReport
                validationStatus
              }
            }
            requestsHasSample {
              igoRequestId
              igoProjectId
              genePanel
              dataAnalystName
              dataAnalystEmail
              dataAccessEmails
              bicAnalysis
              investigatorEmail
              investigatorName
              isCmoRequest
              labHeadEmail
              labHeadName
              libraryType
              otherContactEmails
              piEmail
              projectManagerName
              qcAccessEmails
              smileRequestId
            }
            patientsHasSample {
              smilePatientId
              patientAliasesIsAlias {
                namespace
                value
              }
            }
            cohortsHasCohortSample {
              cohortId
              hasCohortCompleteCohortCompletes {
                date
              }
            }
            hasTempoTempos {
              smileTempoId
              billed
              billedBy
              costCenter
              custodianInformation
              accessLevel
              hasEventBamCompletes {
                date
                status
              }
              hasEventMafCompletes {
                date
                normalPrimaryId
                status
              }
              hasEventQcCompletes {
                date
                reason
                result
                status
              }
            }
          }`,
        });

        return samples;
      },
      async cohorts(_source: undefined, args: any) {
        const cohorts = await ogm.model("Cohort").find({
          where: args.where,
          options: args.options,
          selectionSet: `{
            cohortId
            smileSampleIds
            hasCohortCompleteCohortCompletes {
              date
              endUsers
              pmUsers
              projectTitle
              projectSubtitle
              status
              type
            }
            hasCohortSampleSamplesConnection {
              totalCount
            }
            hasCohortSampleSamples {
              smileSampleId
              hasTempoTempos {
                smileTempoId
                billed
              }
            }
          }`,
        });

        if (args.options?.sort) {
          const sortOptions: SortOptions = args.options.sort;
          const sortField = Object.keys(sortOptions[0])[0];
          const sortOrder = Object.values(sortOptions[0])[0];

          // We don't check for other flattened fields here because the Cohorts AG Grid opts out of the Server-Side Row Model. We only need to sort by initialCohortDeliveryDate for the initial load
          if (sortField === "initialCohortDeliveryDate") {
            sortArrayByNestedField(
              cohorts,
              "Cohort",
              "initialCohortDeliveryDate",
              sortOrder
            );
          }
        }

        return cohorts;
      },
    },
    Request: generateFieldResolvers(flattenedRequestFields, "Request"),
    Patient: generateFieldResolvers(flattenedPatientFields, "Patient"),
    Cohort: generateFieldResolvers(flattenedCohortFields, "Cohort"),
    Sample: generateFieldResolvers(flattenedSampleFields, "Sample"),
  };
}

async function publishNatsMessageForSampleMetadataUpdates(
  sampleManifest: any,
  ogm: OGM
) {
  // remove 'status' from sample metadata to ensure validator and label
  // generator use latest status data added during validation process
  delete sampleManifest["status"];

  // add isCmoSample to sample's 'additionalProperties' if not already present
  // this is to ensure that cmo samples get sent to the label generator after validation
  // since some of the older SMILE samples do not have this additionalProperty set
  if (sampleManifest["additionalProperties"]["isCmoSample"] == null) {
    const requestId = sampleManifest["additionalProperties"]["igoRequestId"];
    let req = ogm.model("Request");
    const rd = await req.find({
      where: { igoRequestId: requestId },
    });
    sampleManifest["additionalProperties"]["isCmoSample"] =
      rd[0]["isCmoRequest"].toString();
  }

  publishNatsMessage(
    props.pub_validate_sample_update,
    JSON.stringify(sampleManifest)
  );

  await ogm.model("Sample").update({
    where: { smileSampleId: sampleManifest.smileSampleId },
    update: { revisable: false },
  });
}

async function publishNatsMessageForSampleBillingUpdates(
  primaryId: string,
  updatedSamples: ApolloQueryResult<UpdateSamplesMutationResponse>
) {
  const { billed, billedBy, costCenter, accessLevel, custodianInformation } =
    updatedSamples.data.samples[0].hasTempoTempos[0];

  const dataForTempoBillingUpdate = {
    primaryId,
    billed,
    billedBy,
    costCenter,
    accessLevel,
    custodianInformation,
  };

  publishNatsMessage(
    props.pub_tempo_sample_billing,
    JSON.stringify(dataForTempoBillingUpdate)
  );
}

async function publishNatsMessage(topic: string, message: string) {
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
