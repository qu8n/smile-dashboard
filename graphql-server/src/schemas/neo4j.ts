import neo4j from "neo4j-driver";
import { Neo4jGraphQL } from "@neo4j/graphql";
import { OGM } from "@neo4j/graphql-ogm";
import { toGraphQLTypeDefs } from "@neo4j/introspector";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { props } from "../utils/constants";
import {
  CohortsListQuery,
  PatientAlias,
  PatientsListQuery,
  RequestsListQuery,
  Sample,
  SampleHasMetadataSampleMetadataUpdateFieldInput,
  SampleHasTempoTemposUpdateFieldInput,
  SampleMetadata,
  SampleMetadataUpdateInput,
  SampleUpdateInput,
  SampleWhere,
  SamplesDocument,
  SamplesListQuery,
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
  CachedOncotreeData,
  fetchAndCacheOncotreeData,
} from "../utils/oncotree";
import { ApolloServerContext } from "../utils/servers";

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

    extend type SampleMetadata {
      cancerType: String
      cancerTypeDetailed: String
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

          if (["importDate", "totalSampleCount"].includes(sortField)) {
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

          if (
            [
              "cmoPatientId",
              "dmpPatientId",
              "totalSampleCount",
              "cmoSampleIds",
              "consentPartA",
              "consentPartC",
            ].includes(sortField)
          ) {
            sortArrayByNestedField(patients, "Patient", sortField, sortOrder);
          }
        }

        if (args.options?.limit == null) {
          return patients;
        }
        return patients.slice(args.options.offset, args.options.limit + 1);
      },
      async samples(_source: undefined, args: any) {
        const samples = await ogm.model("Sample").find({
          where: args.where,
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
              cancerType
              cancerTypeDetailed
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
              cmoPatientId
              dmpPatientId
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
    Request: {
      importDate: (parent: RequestsListQuery["requests"][number]) => {
        return getNestedValue(parent, "Request", "importDate");
      },
      totalSampleCount: (parent: RequestsListQuery["requests"][number]) => {
        return getNestedValue(parent, "Request", "totalSampleCount");
      },
    },
    Patient: {
      cmoPatientId: (parent: PatientsListQuery["patients"][number]) => {
        return getNestedValue(parent, "Patient", "cmoPatientId");
      },
      dmpPatientId: (parent: PatientsListQuery["patients"][number]) => {
        return getNestedValue(parent, "Patient", "dmpPatientId");
      },
      totalSampleCount: (parent: PatientsListQuery["patients"][number]) => {
        return getNestedValue(parent, "Patient", "totalSampleCount");
      },
      cmoSampleIds: (parent: PatientsListQuery["patients"][number]) => {
        return getNestedValue(parent, "Patient", "cmoSampleIds");
      },
      consentPartA: (parent: PatientsListQuery["patients"][number]) => {
        return getNestedValue(parent, "Patient", "consentPartA");
      },
      consentPartC: (parent: PatientsListQuery["patients"][number]) => {
        return getNestedValue(parent, "Patient", "consentPartC");
      },
    },
    Cohort: {
      totalSampleCount: (parent: CohortsListQuery["cohorts"][number]) => {
        return getNestedValue(parent, "Cohort", "totalSampleCount");
      },
      smileSampleIds: (parent: CohortsListQuery["cohorts"][number]) => {
        return getNestedValue(parent, "Cohort", "smileSampleIds");
      },
      billed: (parent: CohortsListQuery["cohorts"][number]) => {
        return getNestedValue(parent, "Cohort", "billed");
      },
      initialCohortDeliveryDate: (
        parent: CohortsListQuery["cohorts"][number]
      ) => {
        return getNestedValue(parent, "Cohort", "initialCohortDeliveryDate");
      },
      endUsers: (parent: CohortsListQuery["cohorts"][number]) => {
        return getNestedValue(parent, "Cohort", "endUsers");
      },
      pmUsers: (parent: CohortsListQuery["cohorts"][number]) => {
        return getNestedValue(parent, "Cohort", "pmUsers");
      },
      projectTitle: (parent: CohortsListQuery["cohorts"][number]) => {
        return getNestedValue(parent, "Cohort", "projectTitle");
      },
      projectSubtitle: (parent: CohortsListQuery["cohorts"][number]) => {
        return getNestedValue(parent, "Cohort", "projectSubtitle");
      },
      status: (parent: CohortsListQuery["cohorts"][number]) => {
        return getNestedValue(parent, "Cohort", "status");
      },
      type: (parent: CohortsListQuery["cohorts"][number]) => {
        return getNestedValue(parent, "Cohort", "type");
      },
    },
    SampleMetadata: {
      cancerType: async (
        { oncotreeCode }: SampleMetadata,
        _: any,
        { oncotreeCache }: ApolloServerContext
      ) => {
        if (oncotreeCode) {
          let cachedData = oncotreeCache.get<CachedOncotreeData>(oncotreeCode);
          if (!cachedData) {
            await fetchAndCacheOncotreeData(oncotreeCache);
            cachedData = oncotreeCache.get(oncotreeCode);
          }
          return cachedData?.mainType;
        }
        return null;
      },
      cancerTypeDetailed: async (
        { oncotreeCode }: SampleMetadata,
        _: any,
        { oncotreeCache }: ApolloServerContext
      ) => {
        if (oncotreeCode) {
          let cachedData = oncotreeCache.get<CachedOncotreeData>(oncotreeCode);
          if (!cachedData) {
            await fetchAndCacheOncotreeData(oncotreeCache);
            cachedData = oncotreeCache.get(oncotreeCode);
          }
          return cachedData?.name;
        }
        return null;
      },
    },
  };
}

function sortArrayByNestedField(
  arr: any[],
  nodeLabel: string,
  fieldName: string,
  sortOrder: SortDirection
) {
  arr.sort((objA, objB) => {
    let a = getNestedValue(objA, nodeLabel, fieldName);
    let b = getNestedValue(objB, nodeLabel, fieldName);

    if (a === null || a === undefined) return 1;
    if (b === null || b === undefined) return -1;

    if (Array.isArray(a)) a = a.join(", ");
    if (Array.isArray(b)) b = b.join(", ");

    if (typeof a === "number" && typeof b === "number") {
      return sortOrder === "ASC" ? a - b : b - a;
    } else if (typeof a === "string" && typeof b === "string") {
      return sortOrder === "ASC"
        ? a.localeCompare(b, "en", { sensitivity: "base" })
        : b.localeCompare(a, "en", { sensitivity: "base" });
    } else {
      return 0;
    }
  });
}

function getNestedValue(node: any, nodeLabel: string, fieldName: string) {
  if (nodeLabel === "Request") {
    switch (fieldName) {
      case "importDate":
        return node.hasMetadataRequestMetadata[0]?.importDate;
      case "totalSampleCount":
        return node.hasSampleSamplesConnection?.totalCount;
    }
  }

  if (nodeLabel === "Patient") {
    switch (fieldName) {
      case "cmoPatientId":
        return node.patientAliasesIsAlias?.find(
          (patientAlias: PatientAlias) => patientAlias.namespace === "cmoId"
        )?.value;
      case "dmpPatientId":
        return node.patientAliasesIsAlias?.find(
          (patientAlias: PatientAlias) => patientAlias.namespace === "dmpId"
        )?.value;
      case "totalSampleCount":
        return node.hasSampleSamplesConnection?.totalCount;
      case "cmoSampleIds":
        return node.hasSampleSamples
          ?.map((s: Sample) => {
            const sampleMetadata = s.hasMetadataSampleMetadata[0];
            return sampleMetadata?.cmoSampleName || sampleMetadata?.primaryId;
          })
          ?.join(", ");
      case "consentPartA":
        try {
          return JSON.parse(
            node.hasSampleSamples[0].hasMetadataSampleMetadata[0]
              .additionalProperties
          )["consent-parta"];
        } catch {
          return null;
        }
      case "consentPartC":
        try {
          return JSON.parse(
            node.hasSampleSamples[0].hasMetadataSampleMetadata[0]
              .additionalProperties
          )["consent-partc"];
        } catch {
          return null;
        }
    }
  }

  if (nodeLabel === "Cohort") {
    switch (fieldName) {
      case "totalSampleCount":
        return node.hasCohortSampleSamplesConnection?.totalCount;
      case "smileSampleIds":
        return node.hasCohortSampleSamples?.map((s: Sample) => s.smileSampleId);
      case "billed":
        const samples: SamplesListQuery["samples"] =
          node.hasCohortSampleSamples;
        const allSamplesBilled =
          samples?.length > 0 &&
          samples.every((sample) => sample.hasTempoTempos?.[0]?.billed);
        return allSamplesBilled ? "Yes" : "No";
      case "initialCohortDeliveryDate":
        return node.hasCohortCompleteCohortCompletes?.slice(-1)[0]?.date;
      case "endUsers":
        return node.hasCohortCompleteCohortCompletes?.[0]?.endUsers;
      case "pmUsers":
        return node.hasCohortCompleteCohortCompletes?.[0]?.pmUsers;
      case "projectTitle":
        return node.hasCohortCompleteCohortCompletes?.[0]?.projectTitle;
      case "projectSubtitle":
        return node.hasCohortCompleteCohortCompletes?.[0]?.projectSubtitle;
      case "status":
        return node.hasCohortCompleteCohortCompletes?.[0]?.status;
      case "type":
        return node.hasCohortCompleteCohortCompletes?.[0]?.type;
    }
  }
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
