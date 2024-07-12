import neo4j, { Driver } from "neo4j-driver";
import { Neo4jGraphQL } from "@neo4j/graphql";
import { OGM } from "@neo4j/graphql-ogm";
import { toGraphQLTypeDefs } from "@neo4j/introspector";
import { createHttpLink } from "apollo-link-http";
import { InMemoryCache, NormalizedCacheObject } from "apollo-cache-inmemory";
import { props } from "../utils/constants";
import {
  CohortsListQuery,
  FindSamplesByInputValueQuery,
  PatientsListQuery,
  RequestsListQuery,
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

export async function buildNeo4jDbSchema() {
  const driver = neo4j.driver(
    props.neo4j_graphql_uri,
    neo4j.auth.basic(props.neo4j_username, props.neo4j_password),
    { disableLosslessIntegers: true } // maps Cypher Integer to JavaScript Number
  );

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
      cmoSampleIds: [String]
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
  `;

  const ogm = new OGM({ typeDefs: extendedTypeDefs, driver });
  const neoSchema = new Neo4jGraphQL({
    typeDefs: extendedTypeDefs,
    driver,
    config: {
      skipValidateTypeDefs: true,
    },
    resolvers: buildResolvers(ogm, client, driver),
  });

  await ogm.init();
  const neo4jDbSchema = await neoSchema.getSchema();

  return neo4jDbSchema;
}

function buildResolvers(
  ogm: OGM,
  apolloClient: ApolloClient<NormalizedCacheObject>,
  driver: Driver
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
          options: args.options,
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
          const sortField = Object.keys(args.options.sort[0])[0];
          const sortOrder = Object.values(args.options.sort[0])[0];

          if (sortField === "importDate") {
            requests.sort((a, b) => {
              const importDateA = a.hasMetadataRequestMetadata[0].importDate;
              const importDateB = b.hasMetadataRequestMetadata[0].importDate;
              if (sortOrder === "ASC") {
                return importDateA > importDateB ? 1 : -1;
              } else {
                return importDateA < importDateB ? 1 : -1;
              }
            });
          }
        }

        return requests;
      },
      // For Cohort Samples view, handle tempo and each complete event separately
      async samples(_source: undefined, args: any) {
        let requestWhere = "",
          patientWhere = "",
          cohortWhere = "",
          tempoWhere = "";

        // Handle searching in Request Samples and Patient Samples views
        if ("hasMetadataSampleMetadata_SOME" in args.where) {
          const igoRequestId =
            args.where.hasMetadataSampleMetadata_SOME.igoRequestId;
          if (igoRequestId) {
            requestWhere = `WHERE sm.igoRequestId = "${igoRequestId}"`;
          }

          if (args.where.hasMetadataSampleMetadata_SOME.OR?.length > 0) {
            const argCount = Object.keys(
              args.where.hasMetadataSampleMetadata_SOME
            ).length;
            if (argCount > 1) {
              requestWhere += " AND";
            } else if (argCount == 1) {
              requestWhere += "WHERE ";
            }

            requestWhere += " ANY(prop in keys(sm) WHERE TOSTRING(sm[prop])";

            const searchValues = Object.values(
              args.where.hasMetadataSampleMetadata_SOME.OR[0]
            )[0] as string[] | string;

            if (Array.isArray(searchValues)) {
              requestWhere += ` IN ${JSON.stringify(searchValues)})`;
            } else {
              requestWhere += ` CONTAINS "${searchValues}")`;
            }
          }
        }

        // Handle searching in Cohort Samples view
        const nestedSmWhere = args.where.OR?.find((obj: any) =>
          obj.hasOwnProperty("hasMetadataSampleMetadata_SOME")
        )?.hasMetadataSampleMetadata_SOME?.OR[0];
        if (nestedSmWhere && Object.keys(nestedSmWhere).length > 0) {
          requestWhere = "WHERE ANY(prop in keys(sm) WHERE TOSTRING(sm[prop])";
          const searchValues = Object.values(nestedSmWhere)[0] as
            | string[]
            | string;

          if (Array.isArray(searchValues)) {
            requestWhere += ` IN ${JSON.stringify(searchValues)})`;
          } else {
            requestWhere += ` CONTAINS "${searchValues}")`;
          }
        }

        const nestedTempoWhere = args.where.OR?.find((obj: any) =>
          obj.hasOwnProperty("hasTempoTempos_SOME")
        )?.hasTempoTempos_SOME?.OR[0];
        if (nestedTempoWhere && Object.keys(nestedTempoWhere).length > 0) {
          tempoWhere = "WHERE";
          const searchValues = Object.values(nestedTempoWhere)[0] as
            | string[]
            | string;

          for (const node of ["t", "bc", "mc", "qc"]) {
            if (node !== "t") {
              tempoWhere += " OR";
            }
            tempoWhere += ` ANY(prop in keys(t) WHERE TOSTRING(${node}[prop])`;

            if (Array.isArray(searchValues)) {
              tempoWhere += ` IN ${JSON.stringify(searchValues)})`;
            } else {
              tempoWhere += ` CONTAINS "${searchValues}")`;
            }
          }
        }

        if ("patientsHasSample_SOME" in args.where) {
          const smilePatientId =
            args.where.patientsHasSample_SOME.smilePatientId;
          patientWhere = `WHERE p.smilePatientId = "${smilePatientId}"`;
        }

        if ("cohortsHasCohortSample_SOME" in args.where) {
          const cohortId = args.where.cohortsHasCohortSample_SOME.cohortId;
          cohortWhere = `WHERE c.cohortId = "${cohortId}"`;
        }

        const session = driver.session();
        let samples = [];
        try {
          const tx = session.beginTransaction();
          const neo4jQuery = `
            MATCH (s:Sample)

            ${requestWhere ? "" : "OPTIONAL"} 
              MATCH (s)-[:HAS_METADATA]->(sm:SampleMetadata)
              ${requestWhere}
            
            ${patientWhere ? "" : "OPTIONAL"} 
              MATCH (s)<-[:HAS_SAMPLE]-(p:Patient)
              ${patientWhere}
            
            ${cohortWhere ? "" : "OPTIONAL"}
              MATCH (s)<-[:HAS_COHORT_SAMPLE]-(c:Cohort)
              ${cohortWhere}
            
            ${
              tempoWhere
                ? `
              MATCH (s)-[:HAS_TEMPO]->(t:Tempo)
              MATCH (t)-[:HAS_EVENT]->(bc:BamComplete)
              MATCH (t)-[:HAS_EVENT]->(mc:MafComplete)
              MATCH (t)-[:HAS_EVENT]->(qc:QcComplete)
              ${tempoWhere}
            `
                : `
              OPTIONAL MATCH (s)-[:HAS_TEMPO]->(t:Tempo)
              OPTIONAL MATCH (t)-[:HAS_EVENT]->(bc:BamComplete)
              OPTIONAL MATCH (t)-[:HAS_EVENT]->(mc:MafComplete)
              OPTIONAL MATCH (t)-[:HAS_EVENT]->(qc:QcComplete)
            `
            }
          
            OPTIONAL MATCH (c)-[:HAS_COHORT_COMPLETE]->(ch:CohortComplete)
            OPTIONAL MATCH (sm)-[:HAS_STATUS]->(st:Status)

            WITH
              s,
              p,
              c,
              t,
              sm,
              // Preparation for nested objects at level 3. As Neo4j doesn't support
              // COLLECT inside another COLLect, we need to do it in two steps.
              COLLECT(
                st {
                  .validationReport,
                  .validationStatus
                }
              ) AS hasStatusStatuses,
              COLLECT(
                ch {
                  .date
                }
              ) AS hasCohortCompleteCohortCompletes,
              COLLECT(
                bc {
                  .date,
                  .status
                }
              )  AS bamCompletes,
              COLLECT(
                mc {
                  .date,
                  .normalPrimaryId,
                  .status
                }
              ) AS mafCompletes,
              COLLECT(
                qc {
                  .date,
                  .reason,
                  .result,
                  .status
                }
              ) AS qcCompletes

            WITH
              s,
              p,
              c,
              t,
              sm,
              hasStatusStatuses,
              hasCohortCompleteCohortCompletes,
              // Sort each CohortComplete event type by 'date' and keep only the latest.
              // Unlike SampleMetadata below, these events might be undefined, so we need to
              // handle that case instead of calling apoc.coll.sortMulti directly on COLLECT.
              CASE
                WHEN SIZE(bamCompletes) > 0 THEN apoc.coll.sortMulti(bamCompletes, ['date'], 1)
                ELSE []
              END AS hasEventBamCompletes,
              CASE
                WHEN SIZE(mafCompletes) > 0 THEN apoc.coll.sortMulti(mafCompletes, ['date'], 1)
                ELSE []
              END AS hasEventMafCompletes,
              CASE
                WHEN SIZE(qcCompletes) > 0 THEN apoc.coll.sortMulti(qcCompletes, ['date'], 1)
                ELSE []
              END AS hasEventQcCompletes

            WITH
              s,
              apoc.coll.sortMulti(
                COLLECT(
                  sm {
                    .additionalProperties,
                    .baitSet,
                    .cfDNA2dBarcode,
                    .cmoInfoIgoId,
                    .cmoPatientId,
                    .cmoSampleIdFields,
                    .cmoSampleName,
                    .collectionYear,
                    .genePanel,
                    .igoComplete,
                    .igoRequestId,
                    .importDate,
                    .investigatorSampleId,
                    .libraries,
                    .oncotreeCode,
                    .preservation,
                    .primaryId,
                    .qcReports,
                    .sampleClass,
                    .sampleName,
                    .sampleOrigin,
                    .sampleType,
                    .sex,
                    .species,
                    .tissueLocation,
                    .tubeId,
                    .tumorOrNormal,
                    hasStatusStatuses: hasStatusStatuses
                  }
                ),
                ['importDate'], 1
              ) AS hasMetadataSampleMetadata,
              COLLECT(
                c {
                    .cohortId,
                    hasCohortCompleteCohortCompletes: hasCohortCompleteCohortCompletes
                }
              ) AS cohortsHasCohortSample,
              COLLECT(
                t {
                    .smileTempoId,
                    .billed,
                    .billedBy,
                    .costCenter,
                    .custodianInformation,
                    .accessLevel,
                    hasEventBamCompletes: hasEventBamCompletes,
                    hasEventMafCompletes: hasEventMafCompletes,
                    hasEventQcCompletes: hasEventQcCompletes
                }
              ) AS hasTempoTempos

            RETURN
              s.smileSampleId AS smileSampleId,
              s.revisable AS revisable,
              hasMetadataSampleMetadata,
              cohortsHasCohortSample,
              hasTempoTempos

            ORDER BY hasMetadataSampleMetadata[0].importDate DESC
            LIMIT 500
          `;
          console.log(neo4jQuery);
          const result = await tx.run(neo4jQuery);
          await tx.close();
          samples = result.records.map((record) => record.toObject());
        } finally {
          await session.close();
        }
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
          const sortField = Object.keys(args.options.sort[0])[0];
          const sortOrder = Object.values(args.options.sort[0])[0];

          if (sortField === "initialCohortDeliveryDate") {
            cohorts.sort((a, b) => {
              const dateA =
                a.hasCohortCompleteCohortCompletes?.slice(-1)[0]?.date;
              const dateB =
                b.hasCohortCompleteCohortCompletes?.slice(-1)[0]?.date;
              if (sortOrder === "ASC") {
                return dateA > dateB ? 1 : -1;
              } else {
                return dateA < dateB ? 1 : -1;
              }
            });
          }
        }

        return cohorts;
      },
    },
    Request: {
      importDate: (parent: RequestsListQuery["requests"][number]) => {
        return parent.hasMetadataRequestMetadata[0].importDate;
      },
      totalSampleCount: (parent: RequestsListQuery["requests"][number]) => {
        return parent.hasSampleSamplesConnection?.totalCount;
      },
    },
    Patient: {
      cmoPatientId: (parent: PatientsListQuery["patients"][number]) => {
        return parent.patientAliasesIsAlias?.find(
          (patientAlias) => patientAlias.namespace === "cmoId"
        )?.value;
      },
      dmpPatientId: (parent: PatientsListQuery["patients"][number]) => {
        return parent.patientAliasesIsAlias?.find(
          (patientAlias) => patientAlias.namespace === "dmpId"
        )?.value;
      },
      totalSampleCount: (parent: PatientsListQuery["patients"][number]) => {
        return parent.hasSampleSamplesConnection?.totalCount;
      },
      cmoSampleIds: (parent: PatientsListQuery["patients"][number]) => {
        return parent.hasSampleSamples?.map((s) => {
          const sampleMetadata = s.hasMetadataSampleMetadata[0];
          return sampleMetadata?.cmoSampleName || sampleMetadata?.primaryId;
        });
      },
      consentPartA: (parent: PatientsListQuery["patients"][number]) => {
        try {
          return JSON.parse(
            parent.hasSampleSamples[0].hasMetadataSampleMetadata[0]
              .additionalProperties
          )["consent-parta"];
        } catch {
          return undefined;
        }
      },
      consentPartC: (parent: PatientsListQuery["patients"][number]) => {
        try {
          return JSON.parse(
            parent.hasSampleSamples[0].hasMetadataSampleMetadata[0]
              .additionalProperties
          )["consent-partc"];
        } catch {
          return undefined;
        }
      },
    },
    Cohort: {
      totalSampleCount: (parent: CohortsListQuery["cohorts"][number]) => {
        return parent.hasCohortSampleSamplesConnection?.totalCount;
      },
      smileSampleIds: (parent: CohortsListQuery["cohorts"][number]) => {
        return parent.hasCohortSampleSamples?.map((s) => s.smileSampleId);
      },
      billed: (parent: CohortsListQuery["cohorts"][number]) => {
        const samples = parent.hasCohortSampleSamples;
        const allSamplesBilled =
          samples?.length > 0 &&
          samples.every((sample) => sample.hasTempoTempos?.[0]?.billed);
        return allSamplesBilled ? "Yes" : "No";
      },
      initialCohortDeliveryDate: (
        parent: CohortsListQuery["cohorts"][number]
      ) => {
        return parent.hasCohortCompleteCohortCompletes?.slice(-1)[0]?.date;
      },
      endUsers: (parent: CohortsListQuery["cohorts"][number]) => {
        return parent.hasCohortCompleteCohortCompletes?.[0]?.endUsers; // latest
      },
      pmUsers: (parent: CohortsListQuery["cohorts"][number]) => {
        return parent.hasCohortCompleteCohortCompletes?.[0]?.pmUsers;
      },
      projectTitle: (parent: CohortsListQuery["cohorts"][number]) => {
        return parent.hasCohortCompleteCohortCompletes?.[0]?.projectTitle;
      },
      projectSubtitle: (parent: CohortsListQuery["cohorts"][number]) => {
        return parent.hasCohortCompleteCohortCompletes?.[0]?.projectSubtitle;
      },
      status: (parent: CohortsListQuery["cohorts"][number]) => {
        return parent.hasCohortCompleteCohortCompletes?.[0]?.status;
      },
      type: (parent: CohortsListQuery["cohorts"][number]) => {
        return parent.hasCohortCompleteCohortCompletes?.[0]?.type;
      },
    },
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
