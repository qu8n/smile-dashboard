import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServerContext } from "../utils/servers";
import { gql } from "apollo-server";
import {
  AgGridSortDirection,
  DashboardSampleInput,
  QueryDashboardCohortsArgs,
  QueryDashboardPatientsArgs,
  QueryDashboardRequestsArgs,
  QueryDashboardSamplesArgs,
  DashboardRecordSort,
} from "../generated/graphql";
import { props } from "../utils/constants";
import { connect, headers, StringCodec } from "nats";
import { OGM } from "@neo4j/graphql-ogm";
import {
  buildPatientsQueryBody,
  queryDashboardPatients,
} from "./queries/patients";
import {
  buildCohortsQueryBody,
  queryDashboardCohorts,
} from "./queries/cohorts";
import {
  buildSamplesQueryBody,
  queryDashboardSamples,
} from "./queries/samples";
import NodeCache from "node-cache";
import { CachedOncotreeData } from "../utils/oncotree";
import {
  buildRequestsQueryBody,
  queryDashboardRequests,
} from "./queries/requests";
const request = require("request-promise-native");

export async function buildCustomSchema(ogm: OGM) {
  const resolvers = {
    Query: {
      async dashboardRequests(
        _source: undefined,
        { searchVals, filters, sort, limit, offset }: QueryDashboardRequestsArgs
      ) {
        const queryBody = buildRequestsQueryBody({ searchVals, filters });
        return await queryDashboardRequests({
          queryBody,
          sort,
          limit,
          offset,
        });
      },

      async dashboardPatients(
        _source: undefined,
        { searchVals, filters, sort, limit, offset }: QueryDashboardPatientsArgs
      ) {
        const queryBody = buildPatientsQueryBody({ searchVals, filters });
        return await queryDashboardPatients({
          queryBody,
          sort,
          limit,
          offset,
        });
      },

      async dashboardCohorts(
        _source: undefined,
        { searchVals, filters, sort, limit, offset }: QueryDashboardCohortsArgs
      ) {
        const queryBody = buildCohortsQueryBody({ searchVals, filters });
        return await queryDashboardCohorts({
          queryBody,
          sort,
          limit,
          offset,
        });
      },

      async dashboardSamples(
        _source: undefined,
        {
          searchVals,
          context,
          sort,
          filters,
          limit,
          offset,
        }: QueryDashboardSamplesArgs,
        { oncotreeCache }: ApolloServerContext
      ) {
        const addlOncotreeCodes = getAddlOtCodesMatchingCtOrCtdVals({
          searchVals,
          oncotreeCache,
        });

        const queryBody = buildSamplesQueryBody({
          searchVals,
          context,
          filters,
          addlOncotreeCodes,
        });

        return await queryDashboardSamples({
          queryBody,
          sort,
          limit,
          offset,
          oncotreeCache,
        });
      },
    },

    Mutation: {
      async updateDashboardSamples(
        _source: undefined,
        { newDashboardSamples }: { newDashboardSamples: DashboardSampleInput[] }
      ) {
        updateAllSamplesConcurrently(newDashboardSamples, ogm);

        // Here, we're returning newDashboardSamples for simplicity. However, if we were to follow
        // GraphQL's convention, we'd return the actual resulting data from the database update. This
        // means we'd wait for SMILE services to finish processing the data changes, then query that
        // data to return it to the frontend. For more context, see:
        // https://www.apollographql.com/docs/react/performance/optimistic-ui/#optimistic-mutation-lifecycle
        return newDashboardSamples;
      },
    },
  };

  return makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers,
  });
}

/**
 * Build "from" and "to" date predicates to be used in a WHERE clause in Cypher.
 *
 * This function can also handle unsafe date values like Tempo event dates, which can come in a variety of formats
 * such as date values in "yyyy-MM-dd" or "yyyy-MM-dd HH:mm" or "yyyy-MM-dd HH:mm:ss.SSSSSS", empty strings, or "FAILED".
 *
 * @param dateVar The date variable in the current Cypher context e.g. `bc.date` from `MATCH (bc:BamComplete) RETURN bc.date`
 * @param filter The filter object type from AG Grid's `agDateColumnFilter`
 * @param safelyHandleDateString Set this to true when working with date values that are unpredictable/non-standardized
 *
 */
export function buildCypherDateFilter({
  dateVar,
  filter,
  safelyHandleDateString = false,
}: {
  dateVar: string;
  safelyHandleDateString?: boolean;
  filter: {
    dateFrom: string;
    dateTo: string;
  };
}) {
  const formattedDateString = safelyHandleDateString
    ? `
    CASE
      WHEN size(${dateVar}) >= 10 THEN left(${dateVar}, 10) // trims date formats more granular than yyyy-MM-dd
      ELSE '1900-01-01' // excludes record from the result
    END`
    : dateVar;

  return `
      apoc.date.parse(${formattedDateString}, 'ms', 'yyyy-MM-dd')
        >= apoc.date.parse('${filter.dateFrom}', 'ms', 'yyyy-MM-dd HH:mm:ss') // AG Grid's provided date format
      AND apoc.date.parse(${formattedDateString}, 'ms', 'yyyy-MM-dd')
        <= apoc.date.parse('${filter.dateTo}', 'ms', 'yyyy-MM-dd HH:mm:ss')
    `;
}

/**
 * Build boolean predicates to be used in a WHERE clause in Cypher.
 *
 * @param booleanVar The boolean variable in the current Cypher context e.g. `t.billed` from `MATCH (t:Tempo) RETURN t.billed`
 * @param filter The filter object type from AG Grid's `agSetColumnFilter`
 * @param noIncludesFalseAndNull Set this to true if we want the user's filter selection of "No" to include both false and null values
 * @param trueVal The true value that appears in the database for a given field (e.g. "Yes", true)
 * @param falseVal The false value that appears in the database for a given field (e.g. "No", false)
 *
 */
export function buildCypherBooleanFilter({
  booleanVar,
  filter,
  noIncludesFalseAndNull = false,
  trueVal = true,
  falseVal = false,
}: {
  booleanVar: string;
  filter: {
    values: string[];
  };
  noIncludesFalseAndNull?: boolean;
  trueVal?: string | boolean;
  falseVal?: string | boolean;
}) {
  const formattedTrueVal =
    typeof trueVal === "string" ? `'${trueVal}'` : trueVal;
  const formattedFalseVal =
    typeof falseVal === "string" ? `'${falseVal}'` : falseVal;

  const filterValues = filter.values;
  if (filterValues?.length > 0) {
    const activeFilters = [];
    for (const value of filterValues) {
      if (value === "Yes") {
        activeFilters.push(`${booleanVar} = ${formattedTrueVal}`);
      } else if (value === "No") {
        if (!noIncludesFalseAndNull) {
          activeFilters.push(`${booleanVar} = ${formattedFalseVal}`);
        } else {
          activeFilters.push(
            `${booleanVar} = ${formattedFalseVal} OR ${booleanVar} IS NULL`
          );
        }
      } else if (value === null) {
        activeFilters.push(`${booleanVar} IS NULL`);
      }
    }
    return activeFilters.join(" OR ");
  } else {
    return `${booleanVar} <> ${formattedTrueVal} AND ${booleanVar} <> ${formattedFalseVal} AND ${booleanVar} IS NOT NULL`;
  }
}

export function buildFinalCypherFilter({
  queryFilters,
}: {
  queryFilters: string[];
}) {
  const combinedPredicates = queryFilters
    .filter(Boolean)
    .map((queryFilter) => `(${queryFilter})`)
    .join(" AND ");

  return combinedPredicates ? "WHERE " + combinedPredicates : "";
}

/**
 * Disable Neo4j's defaults of showing nulls first for DESC sorting
 * and empty strings first for ASC sorting
 */
export function getNeo4jCustomSort(sort: DashboardRecordSort) {
  return sort.sort === AgGridSortDirection.Desc
    ? `COALESCE(resultz.${sort.colId}, '') DESC`
    : `resultz.${sort.colId}='' ASC, resultz.${sort.colId} ASC`;
}

async function updateSampleMetadata(
  newDashboardSample: DashboardSampleInput,
  ogm: OGM
) {
  return new Promise(async (resolve) => {
    const sampleManifest = await request(
      props.smile_sample_endpoint + newDashboardSample.primaryId,
      {
        json: true,
      }
    );

    Object.keys(newDashboardSample).forEach((key) => {
      if (key in sampleManifest) {
        console.log(key);

        sampleManifest[key] =
          newDashboardSample[key as keyof DashboardSampleInput];
      }
    });

    // Ensure validator and label generator use latest status data added during validation
    delete sampleManifest.status;

    // Ensure isCmoSample is set in sample's 'additionalProperties' if not already present
    if (sampleManifest.additionalProperties.isCmoSample == null) {
      // For research samples, this ensures that they get sent to the label generator after
      // validation as some of the older SMILE samples do not have this additionalProperty set
      if (sampleManifest.datasource === "igo") {
        const requestId = sampleManifest.additionalProperties.igoRequestId;
        let requestOgm = ogm.model("Request");
        const requestOfSample = await requestOgm.find({
          where: { igoRequestId: requestId },
        });
        sampleManifest.additionalProperties.isCmoSample =
          requestOfSample[0].isCmoRequest.toString();
      }

      if (sampleManifest.datasource === "dmp") {
        sampleManifest.additionalProperties.isCmoSample = false;
      }
    }

    publishNatsMessage(
      props.pub_validate_sample_update,
      JSON.stringify(sampleManifest)
    );

    await ogm.model("Sample").update({
      where: { smileSampleId: sampleManifest.smileSampleId },
      update: { revisable: false },
    });

    resolve(null);
  });
}

async function updateTempo(newDashboardSample: DashboardSampleInput) {
  return new Promise((resolve) => {
    const dataForTempoBillingUpdate = {
      primaryId: newDashboardSample.primaryId,
      billed: newDashboardSample.billed,
      billedBy: newDashboardSample.billedBy,
      costCenter: newDashboardSample.costCenter,
      accessLevel: newDashboardSample.accessLevel,
      custodianInformation: newDashboardSample.custodianInformation,
    };

    publishNatsMessage(
      props.pub_tempo_sample_billing,
      JSON.stringify(dataForTempoBillingUpdate)
    );

    resolve(null);
  });
}

const editableSampleMetadataFields = new Set([
  "cmoPatientId",
  "investigatorSampleId",
  "sampleType",
  "preservation",
  "tumorOrNormal",
  "sampleClass",
  "oncotreeCode",
  "collectionYear",
  "sampleOrigin",
  "tissueLocation",
]);

const editableTempoFields = new Set([
  "billed",
  "costCenter",
  "billedBy",
  "custodianInformation",
  "accessLevel",
]);

async function updateAllSamplesConcurrently(
  newDashboardSamples: DashboardSampleInput[],
  ogm: OGM
) {
  const allPromises = newDashboardSamples.map(async (dashboardSample) => {
    try {
      const metadataChanged = dashboardSample.changedFieldNames.some((field) =>
        editableSampleMetadataFields.has(field)
      );
      const tempoChanged = dashboardSample.changedFieldNames.some((field) =>
        editableTempoFields.has(field)
      );

      const promises = [];
      if (metadataChanged) {
        promises.push(updateSampleMetadata(dashboardSample, ogm));
      }
      if (tempoChanged) {
        promises.push(updateTempo(dashboardSample));
      }

      return Promise.all(promises);
    } catch (error) {
      console.error(
        `Failed to update sample with primaryId ${dashboardSample.primaryId}. Error:`,
        error
      );
      throw error; // ensure Promise.allSettled captures the error
    }
  });

  await Promise.allSettled(allPromises);
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
    console.info(
      `Publishing message to NATS server at ${natsConn.getServer()} under topic ${topic}: `,
      message
    );
    const h = headers();
    h.append("Nats-Msg-Subject", topic);
    natsConn.publish(topic, sc.encode(JSON.stringify(message)), { headers: h });
  } catch (err) {
    console.error(
      `error connecting to ${JSON.stringify(natsConnProperties)}`,
      err
    );
  }
}

export function getAddlOtCodesMatchingCtOrCtdVals({
  searchVals,
  oncotreeCache,
}: {
  searchVals: QueryDashboardSamplesArgs["searchVals"];
  oncotreeCache: NodeCache;
}) {
  let addlOncotreeCodes: Set<string> = new Set();
  if (searchVals?.length) {
    oncotreeCache.keys().forEach((code) => {
      const { name, mainType } = (oncotreeCache.get(
        code
      ) as CachedOncotreeData)!;
      searchVals.forEach((val) => {
        if (
          name?.toLowerCase().includes(val?.toLowerCase()) ||
          mainType?.toLowerCase().includes(val?.toLowerCase())
        ) {
          addlOncotreeCodes.add(code);
        }
      });
    });
  }
  return Array.from(addlOncotreeCodes);
}

const typeDefs = gql`
  type DashboardRequest {
    igoRequestId: String!
    igoProjectId: String
    importDate: String
    totalSampleCount: Int
    projectManagerName: String
    investigatorName: String
    investigatorEmail: String
    piEmail: String
    dataAnalystName: String
    dataAnalystEmail: String
    genePanel: String
    labHeadName: String
    labHeadEmail: String
    qcAccessEmails: String
    dataAccessEmails: String
    bicAnalysis: Boolean
    isCmoRequest: Boolean
    otherContactEmails: String
    _total: Int
  }

  type DashboardPatient {
    smilePatientId: String!
    cmoPatientId: String
    dmpPatientId: String
    totalSampleCount: Int
    cmoSampleIds: String
    consentPartA: String
    consentPartC: String
    _total: Int
  }

  type DashboardCohort {
    cohortId: String!
    totalSampleCount: Int
    billed: String
    initialCohortDeliveryDate: String
    endUsers: String
    pmUsers: String
    projectTitle: String
    projectSubtitle: String
    status: String
    type: String
    _total: Int
    _uniqueSampleCount: Int
  }

  type DashboardSample {
    # (s:Sample)
    smileSampleId: String!
    revisable: Boolean

    # (s:Sample)-[:HAS_METADATA]->(sm:SampleMetadata)
    ## Root-level fields
    primaryId: String!
    cmoSampleName: String
    importDate: String!
    cmoPatientId: String
    investigatorSampleId: String
    sampleType: String
    species: String
    genePanel: String
    baitSet: String
    preservation: String
    tumorOrNormal: String
    sampleClass: String
    oncotreeCode: String
    collectionYear: String
    sampleOrigin: String
    tissueLocation: String
    sex: String
    ## Custom fields
    recipe: String
    altId: String
    historicalCmoSampleNames: String
    ## (sm:SampleMetadata)-[:HAS_STATUS]->(s:Status)
    validationReport: String
    validationStatus: Boolean

    # Oncotree API
    cancerType: String
    cancerTypeDetailed: String

    ## (s:Sample)-[:HAS_TEMPO]->(t:Tempo)
    ## Root-level fields
    billed: Boolean
    costCenter: String
    billedBy: String
    custodianInformation: String
    accessLevel: String
    ## Custom fields
    initialPipelineRunDate: String
    embargoDate: String
    ## (t:Tempo)-[:HAS_EVENT]->(bc:BamComplete)
    bamCompleteDate: String
    bamCompleteStatus: String
    ## (t:Tempo)-[:HAS_EVENT]->(mc:MafComplete)
    mafCompleteDate: String
    mafCompleteNormalPrimaryId: String
    mafCompleteStatus: String
    # (t:Tempo)-[:HAS_EVENT]->(qc:QcComplete)
    qcCompleteDate: String
    qcCompleteResult: String
    qcCompleteReason: String
    qcCompleteStatus: String

    # results total
    _total: Int
  }

  enum AgGridSortDirection {
    asc
    desc
  }

  type DashboardRecordCount {
    totalCount: Int!
    uniqueSampleCount: Int
  }

  input DashboardRecordContext {
    fieldName: String
    values: [String!]!
  }

  # Modeling after AG Grid's SortModel type
  input DashboardRecordSort {
    colId: String! # field name
    sort: AgGridSortDirection!
  }

  input DashboardRecordFilter {
    field: String!
    filter: String!
  }

  type Query {
    dashboardRequests(
      searchVals: [String!]
      filters: [DashboardRecordFilter!]
      sort: DashboardRecordSort!
      limit: Int!
      offset: Int!
    ): [DashboardRequest!]!

    dashboardPatients(
      searchVals: [String!]
      filters: [DashboardRecordFilter!]
      sort: DashboardRecordSort!
      limit: Int!
      offset: Int!
    ): [DashboardPatient!]!

    dashboardCohorts(
      searchVals: [String!]
      filters: [DashboardRecordFilter!]
      sort: DashboardRecordSort!
      limit: Int!
      offset: Int!
    ): [DashboardCohort!]!

    dashboardSamples(
      searchVals: [String!]
      context: DashboardRecordContext
      filters: [DashboardRecordFilter!]
      sort: DashboardRecordSort!
      limit: Int!
      offset: Int!
    ): [DashboardSample!]!
  }

  # We have to define a separate "input" type for the mutation and can't reuse DashboardSample.
  # For more context, see: https://stackoverflow.com/q/41743253
  input DashboardSampleInput {
    changedFieldNames: [String!]!
    _total: Int

    # (s:Sample)
    smileSampleId: String!
    revisable: Boolean

    # (s:Sample)-[:HAS_METADATA]->(sm:SampleMetadata)
    ## Root-level fields
    primaryId: String!
    cmoSampleName: String
    importDate: String!
    cmoPatientId: String
    investigatorSampleId: String
    sampleType: String
    species: String
    genePanel: String
    baitSet: String
    preservation: String
    tumorOrNormal: String
    sampleClass: String
    oncotreeCode: String
    collectionYear: String
    sampleOrigin: String
    tissueLocation: String
    sex: String
    ## Custom fields
    recipe: String
    altId: String
    historicalCmoSampleNames: String
    ## (sm:SampleMetadata)-[:HAS_STATUS]->(s:Status)
    validationReport: String
    validationStatus: Boolean

    # Oncotree API
    cancerType: String
    cancerTypeDetailed: String

    ## (s:Sample)-[:HAS_TEMPO]->(t:Tempo)
    ## Root-level fields
    billed: Boolean
    costCenter: String
    billedBy: String
    custodianInformation: String
    accessLevel: String
    ## Custom fields
    initialPipelineRunDate: String
    embargoDate: String
    ## (t:Tempo)-[:HAS_EVENT]->(bc:BamComplete)
    bamCompleteDate: String
    bamCompleteStatus: String
    ## (t:Tempo)-[:HAS_EVENT]->(mc:MafComplete)
    mafCompleteDate: String
    mafCompleteNormalPrimaryId: String
    mafCompleteStatus: String
    # (t:Tempo)-[:HAS_EVENT]->(qc:QcComplete)
    qcCompleteDate: String
    qcCompleteResult: String
    qcCompleteReason: String
    qcCompleteStatus: String
  }

  type Mutation {
    updateDashboardSamples(
      newDashboardSamples: [DashboardSampleInput]
    ): [DashboardSample]
  }
`;
