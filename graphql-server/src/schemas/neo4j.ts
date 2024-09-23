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
  generateFieldResolvers,
  sortArrayByNestedField,
} from "../utils/flattening";
import { ApolloServerContext } from "../utils/servers";
import { CachedOncotreeData } from "../utils/oncotree";

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

    type SampleDashboardRow {
      primaryId: String!
      status: Boolean
      cmoSampleName: String
      lastUpdated: String
      cmoPatientId: String
      investigatorSampleId: String
      sampleType: String!
      species: String!
      genePanel: String!
      baitSet: String
      preservation: String
      tumorOrNormal: String!
      sampleClass: String!
      oncotreeCode: String
      collectionYear: String!
      sampleOrigin: String
      tissueLocation: String
      sex: String!
      recipe: String
      initialPipelineRunDate: String
      embargoDate: String
      billed: Boolean
      costCenter: String
      editedBy: String
      custodianInformation: String
      accessLevel: String
      bamCompleteDate: String
      bamCompleteStatus: String
      mafCompleteDate: String
      mafCompleteNormalPrimaryId: String
      mafCompleteStatus: String
      qcCompleteDate: String
      qcCompleteResult: String
      qcCompleteReason: String
      qcCompleteStatus: String
    }

    type Query {
      sampleDashboardQuery: [Sample]
    }

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

  const features = {
    filters: {
      String: {
        MATCHES: true,
        ID: {
          MATCHES: true,
        },
      },
    },
  };

  const ogm = new OGM({ typeDefs: extendedTypeDefs, driver, features });
  const neoSchema = new Neo4jGraphQL({
    typeDefs: extendedTypeDefs,
    driver,
    validate: false,
    resolvers: buildResolvers(ogm, client),
    features,
  });

  await ogm.init();
  const neo4jDbSchema = await neoSchema.getSchema();

  return {
    neo4jDbSchema,
    ogm,
  };
}

// TODO THIS IS THE ONE GETTING CALLED
export const runQuery = {
  async sampleDashboardQuery(_: any, args: any) {
    //}, { oncotreeCache }: ApolloServerContext) {
    var startTime = performance.now();
    const session = driver.session();
    try {
      const result = await session.run(
        `
        // all Samples have at least one SampleMetadata (SampleMetadata is required)
        MATCH (s:Sample)-[:HAS_METADATA]->(sm:SampleMetadata)

        // now get the most recent import date for each Sample from the SampleMetadata (we still have all the SampleMetadata for each Sample)
        WITH s, collect(sm) AS allSampleMetadata, max(sm.importDate) AS latestImportDate

        // now only keep one of the SampleMetadata that has the most recent importDate (if there is more than one we take the first)
        WITH s, [sm IN allSampleMetadata WHERE sm.importDate = latestImportDate][0] AS latestSm
        
        // if the most recent SampleMetadata for a Sample has a Status attached to it
        OPTIONAL MATCH (latestSm)-[:HAS_STATUS]->(st:Status)
        WITH s, latestSm, st AS latestSt
        
        // if the Sample belongs to any Cohorts, get them - the Cohort will have a CohortComplete so get that too
        OPTIONAL MATCH (s:Sample)<-[:HAS_COHORT_SAMPLE]-(c:Cohort)-[:HAS_COHORT_COMPLETE]->(cc:CohortComplete)

        // we then collect all the CohortCompletes for each Sample and get the most recent CohortComplete.date
        WITH s, latestSm, latestSt, collect(cc) AS allCohortComplete, min(cc.date) AS oldestCCDate

        // now only keep one of the CohortCompletes that has the most recent CohortComplete date (if there is more than one take the first)
        WITH s, latestSm, latestSt, [cc IN allCohortComplete WHERE cc.date = oldestCCDate][0] AS oldestCC
        
        // if the Sample has Tempos get them
        OPTIONAL MATCH (s:Sample)-[:HAS_TEMPO]->(t:Tempo)

        // now get the most recent date for each Sample from the Tempos (we still have all the Tempos for each Sample)
        WITH s, latestSm, latestSt, oldestCC, collect(t) AS allTempos, max(t.date) AS latestTDate

        // now only keep one of the Tempos that has the most recent date (if there is more than one we take the first)
        WITH s, latestSm, latestSt, oldestCC, [t IN allTempos WHERE t.date = latestTDate][0] AS latestT

        // if the Tempo has any BamCompletes, get them
        OPTIONAL MATCH (latestT)-[:HAS_EVENT]->(bc:BamComplete)

        // now get the most recent date for each BamComplete (we still have all the BamCompletes for each Tempo)
        WITH s, latestSm, latestSt, oldestCC, latestT, collect(bc) AS allBamCompletes, max(bc.date) AS latestBCDate

        // now only keep one of the BamCompletes that has the most recent date (if there is more than one we take the first)
        WITH s, latestSm, latestSt, oldestCC, latestT, [bc IN allBamCompletes WHERE bc.date = latestBCDate][0] AS latestBC

        // if the Tempo has any MafCompletes, get them
        OPTIONAL MATCH (latestT)-[:HAS_EVENT]->(mc:MafComplete)

        // now get the most recent date for each MafComplete (we still have all the MafCompletes for each Tempo)
        WITH s, latestSm, latestSt, oldestCC, latestT, latestBC, collect(mc) AS allMafCompletes, max(mc.date) AS latestMCDate

        // now only keep one of the MafCompletes that has the most recent date (if there is more than one we take the first)
        WITH s, latestSm, latestSt, oldestCC, latestT, latestBC, [mc IN allMafCompletes WHERE mc.date = latestMCDate][0] AS latestMC

        // if the Tempo has any QcCompletes, get them
        OPTIONAL MATCH (latestT)-[:HAS_EVENT]->(qc:QcComplete)

        // now get the most recent date for each QcComplete (we still have all the QcCompletes for each Tempo)
        WITH s, latestSm, latestSt, oldestCC, latestT, latestBC, latestMC, collect(qc) AS allQcCompletes, max(qc.date) AS latestQCDate

        // now only keep one of the QcCompletes that has the most recent date (if there is more than one we take the first)
        WITH s, latestSm, latestSt, oldestCC, latestT, latestBC, latestMC, [qc IN allQcCompletes WHERE qc.date = latestQCDate][0] AS latestQC

        // return whatever we need (TODO would it be faster if we only return the fields we need?  should we be filtering those from the start of the query?)
        WITH s AS sample,
              latestSm,
              latestSt,
              oldestCC,
              latestT,
              latestBC,
              latestMC,
              latestQC
        RETURN
          sample, // TEMP TO SATISFY RETURN TYPE OF SAMPLE UNTIL WE CREATE A CUSTOM TYPE
          sample.revisable AS revisable,

          latestSm.primaryId AS primaryId,
          latestSm.cmoSampleName AS cmoSampleName,
          latestSm.importDate AS importDate,
          latestSm.cmoPatientId AS cmoPatientId,
          latestSm.investigatorSampleId AS investigatorSampleId,
          latestSm.sampleType AS sampleType,
          latestSm.species AS species,
          latestSm.genePanel AS genePanel,
          latestSm.baitSet AS baitSet,
          latestSm.preservation AS preservation,
          latestSm.tumorOrNormal AS tumorOrNormal,
          latestSm.sampleClass AS sampleClass,
          latestSm.oncotreeCode AS oncotreeCode,
          latestSm.collectionYear AS collectionYear,
          latestSm.sampleOrigin AS sampleOrigin,
          latestSm.tissueLocation AS tissueLocation,
          latestSm.sex AS sex,
          latestSm.recipe AS recipe,

          oldestCC.date AS initialPipelineRunDate, // MISSING embargo date

          latestT.smileTempoId AS smileTempoId,
          latestT.billed AS billed,
          latestT.costCenter AS costCenter,
          latestT.billedBy AS billedBy,
          latestT.custodianInformation AS custodianInformation,
          latestT.accessLevel AS accessLevel,

          latestBC.date AS bamCompleteDate,
          latestBC.status AS bamCompleteStatus,

          latestMC.date AS mafCompleteDate,
          latestMC.normalPrimaryId AS mafCompleteNormalPrimaryId,
          latestMC.status AS mafCompleteStatus,

          latestQC.date AS qcCompleteDate,
          latestQC.result AS qcCompleteResult,
          latestQC.reason AS qcCompleteReason,
          latestQC.status AS qcCompleteStatus

        ORDER BY importDate DESC
        LIMIT 500
        `
      ); // NOTE above the LIMIT clause, use SKIP 0 to skip the first 0 samples, SKIP 10 to skip the first 10, etc.

      // Process the results
      const sampleDashboardRows = result.records.map((record) => {
        const recordObject = record.toObject();
        const sample = record.get("sample");
        return {
          ...recordObject,

          // TEMP TO SATISFY RETURN TYPE OF SAMPLE UNTIL WE CREATE A CUSTOM TYPE
          datasource: sample.properties.datasource,
          revisable: sample.properties.revisable,
          sampleCategory: sample.properties.sampleCategory,
          smileSampleId: sample.properties.smileSampleId,

          embargoDate: recordObject.initialPipelineRunDate
            ? new Date(
                new Date(recordObject.initialPipelineRunDate).setMonth(
                  new Date(recordObject.initialPipelineRunDate).getMonth() + 18
                )
              ).toISOString()
            : null,
          cancerType: null,
          cancerTypeDetailed: null,
          cohortsHasCohortSample: [],
          hasMetadataSampleMetadata: [],
          hasTempoTempos: [],
          patientsHasSample: [],
          requestsHasSample: [],
          sampleAliasesIsAlias: [],
        };
        // TODO still add indexes
        // const sample = record.get("sample");
        // const latestSm = record.get("latestSm");
        // const latestSt = record.get("latestSt"); // can be null
        // const oldestCC = record.get("oldestCC"); // can be null
        // const latestT = record.get("latestT"); // can be null
        // const latestBC = record.get("latestBC"); // can be null
        // const latestMC = record.get("latestMC"); // can be null
        // const latestQC = record.get("latestQC"); // can be null

        // const oncotreeCode = latestSm.properties.oncotreeCode;
        let cancerType: string;
        let cancerTypeDetailed: string;

        // TODO deal with this
        // if (oncotreeCode)  {
        //   let cachedData = oncotreeCache?.get<CachedOncotreeData>(oncotreeCode);
        //   // if (!cachedData && oncotreeCache) {
        //   //   await fetchAndCacheOncotreeData(oncotreeCache);
        //   //   cachedData = oncotreeCache.get(oncotreeCode);
        //   // }
        //   if (cachedData) {
        //     cancerType = cachedData.mainType;
        //     cancerTypeDetailed = cachedData.name;
        //   }
        // }

        // const toReturn = {
        //   primaryId: latestSm.properties.primaryId,
        //   datasource: sample.properties.datasource, // TODO not required for dashboard, but is required if returning a "Sample"
        //   revisable: sample.properties.revisable, // TODO not required for dashboard, but is required if returning a "Sample"
        //   sampleCategory: sample.properties.sampleCategory, // TODO not required for dashboard, but is required if returning a "Sample"
        //   smileSampleId: sample.properties.smileSampleId, // TODO not required for dashboard, but is required if returning a "Sample"
        //   validationStatus: latestSt
        //     ? latestSt.properties.validationStatus
        //     : null,
        //   cmoSampleName: latestSm.properties.cmoSampleName,
        //   importDate: latestSm.properties.importDate,
        //   cmoPatientId: latestSm.properties.cmoPatientId,
        //   investigatorSampleId:
        //     latestSm.properties.investigatorSampleId,
        //   sampleType: latestSm.properties.sampleType,
        //   species: latestSm.properties.species,
        //   genePanel: latestSm.properties.genePanel,
        //   baitSet: latestSm.properties.baitSet,
        //   preservation: latestSm.properties.preservation,
        //   tumorOrNormal: latestSm.properties.tumorOrNormal,
        //   sampleClass: sample.properties.sampleClass,
        //   oncotreeCode: latestSm.properties.oncotreeCode,
        //   collectionYear: latestSm.properties.collectionYear,
        //   sampleOrigin: latestSm.properties.sampleOrigin,
        //   tissueLocation: latestSm.properties.tissueLocation,
        //   sex: latestSm.properties.sex,
        //   recipe: latestSm.properties.cmoSampleIdFields.recipe,
        //   initialPipelineRunDate: oldestCC
        //     ? oldestCC.properties.date
        //     : null,
        //   embargoDate: oldestCC
        //     ? new Date(
        //         new Date(oldestCC.properties.date).setMonth(
        //           new Date(oldestCC.properties.date).getMonth() + 18
        //         )
        //       ).toISOString()
        //     : null,
        //   billed: latestT ? latestT.properties.billed : null,
        //   costCenter: latestT
        //     ? latestT.properties.costCenter
        //     : null,
        //   billedBy: latestT // editedBy
        //     ? latestT.properties.billedBy
        //     : null,
        //   custodianInformation: latestT
        //     ? latestT.properties.custodianInformation
        //     : null,
        //   accessLevel: latestT
        //     ? latestT.properties.accessLevel
        //     : null,
        //   bamCompleteDate: latestBC
        //     ? latestBC.properties.date
        //     : null,
        //   bamCompleteStatus: latestBC
        //     ? latestBC.properties.status
        //     : null,
        //   mafCompleteDate: latestMC
        //     ? latestMC.properties.date
        //     : null,
        //   mafCompleteNormalPrimaryId: latestMC
        //     ? latestMC.properties.normalPrimaryId
        //     : null,
        //   mafCompleteStatus: latestMC
        //     ? latestMC.properties.status
        //     : null,
        //   qcCompleteDate: latestQC
        //     ? latestQC.properties.date
        //     : null,
        //   qcCompleteResult: latestQC
        //     ? latestQC.properties.result
        //     : null,
        //   qcCompleteReason: latestQC
        //     ? latestQC.properties.reason
        //     : null,
        //   qcCompleteStatus: latestQC
        //     ? latestQC.properties.status
        //     : null,
        //   cohortsHasCohortSample: [],
        //   hasMetadataSampleMetadata: [],
        //   hasTempoTempos: [],
        //   patientsHasSample: [],
        //   requestsHasSample: [],
        //   sampleAliasesIsAlias: [],
        // };
        // return toReturn;
      });

      var endTime = performance.now();
      console.log(`NEW query took ${(endTime - startTime) / 1000} seconds`);

      return sampleDashboardRows;
    } catch (error) {
      console.error("Error running query:", error);
    }
  },
};

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
        const primaryId = where.hasMetadataSampleMetadata_SOME!.primaryId!;

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

    // async samples(
    //   _source: undefined,
    //   args: any,
    //   { samplesLoader }: ApolloServerContext
    // ) {

    Query: {
      // THIS ONE CAN BE CALLED FROM THE BROWSER
      async sampleDashboardQuery(
        _: any,
        args: any,
        { oncotreeCache }: ApolloServerContext
      ) {
        var startTime = performance.now();
        const session = driver.session();
        try {
          const result = await session.run(
            `
            // all Samples have at least one SampleMetadata (SampleMetadata is required)
            MATCH (s:Sample)-[:HAS_METADATA]->(sm:SampleMetadata)
            // now get the most recent import date for each Sample from the SampleMetadata (we still have all the SampleMetadata for each Sample)
            WITH s, collect(sm) AS allSampleMetadata, max(sm.importDate) AS latestImportDate
            // now only keep one of the SampleMetadata that has the most recent importDate (if there is more than one we take the first)
            WITH s, [sm IN allSampleMetadata WHERE sm.importDate = latestImportDate][0] AS latestSm
            
            // if the most recent SampleMetadata for a Sample has a Status attached to it
            OPTIONAL MATCH (latestSm)-[:HAS_STATUS]->(st:Status)
            WITH s, latestSm, st AS latestSt
            
            // if the Sample belongs to any Cohorts, get them - the Cohort will have a CohortComplete so get that too
            OPTIONAL MATCH (s:Sample)<-[:HAS_COHORT_SAMPLE]-(c:Cohort)-[:HAS_COHORT_COMPLETE]->(cc:CohortComplete)
            // we then collect all the CohortCompletes for each Sample and get the most recent CohortComplete.date
            WITH s, latestSm, latestSt, collect(cc) AS allCohortComplete, min(cc.date) AS oldestCCDate
            // now only keep one of the CohortCompletes that has the most recent CohortComplete date (if there is more than one take the first)
            WITH s, latestSm, latestSt, [cc IN allCohortComplete WHERE cc.date = oldestCCDate][0] AS oldestCC
            
            // if the Sample has Tempos get them
            OPTIONAL MATCH (s:Sample)-[:HAS_TEMPO]->(t:Tempo)
            // now get the most recent date for each Sample from the Tempos (we still have all the Tempos for each Sample)
            WITH s, latestSm, latestSt, oldestCC, collect(t) AS allTempos, max(t.date) AS latestTDate
            // now only keep one of the Tempos that has the most recent date (if there is more than one we take the first)
            WITH s, latestSm, latestSt, oldestCC, [t IN allTempos WHERE t.date = latestTDate][0] AS latestT

            // if the Tempo has any BamCompletes, get them
            OPTIONAL MATCH (latestT)-[:HAS_EVENT]->(bc:BamComplete)
            // now get the most recent date for each BamComplete (we still have all the BamCompletes for each Tempo)
            WITH s, latestSm, latestSt, oldestCC, latestT, collect(bc) AS allBamCompletes, max(bc.date) AS latestBCDate
            // now only keep one of the BamCompletes that has the most recent date (if there is more than one we take the first)
            WITH s, latestSm, latestSt, oldestCC, latestT, [bc IN allBamCompletes WHERE bc.date = latestBCDate][0] AS latestBC

            // if the Tempo has any MafCompletes, get them
            OPTIONAL MATCH (latestT)-[:HAS_EVENT]->(mc:MafComplete)
            // now get the most recent date for each MafComplete (we still have all the MafCompletes for each Tempo)
            WITH s, latestSm, latestSt, oldestCC, latestT, latestBC, collect(mc) AS allMafCompletes, max(mc.date) AS latestMCDate
            // now only keep one of the MafCompletes that has the most recent date (if there is more than one we take the first)
            WITH s, latestSm, latestSt, oldestCC, latestT, latestBC, [mc IN allMafCompletes WHERE mc.date = latestMCDate][0] AS latestMC

            // if the Tempo has any QcCompletes, get them
            OPTIONAL MATCH (latestT)-[:HAS_EVENT]->(qc:QcComplete)
            // now get the most recent date for each QcComplete (we still have all the QcCompletes for each Tempo)
            WITH s, latestSm, latestSt, oldestCC, latestT, latestBC, latestMC, collect(qc) AS allQcCompletes, max(qc.date) AS latestQCDate
            // now only keep one of the QcCompletes that has the most recent date (if there is more than one we take the first)
            WITH s, latestSm, latestSt, oldestCC, latestT, latestBC, latestMC, [qc IN allQcCompletes WHERE qc.date = latestQCDate][0] AS latestQC

            // return whatever we need (TODO would it be faster if we only return the fields we need?  should we be filtering those from the start of the query?)
            RETURN s AS sample,
                  latestSm,
                  latestSt,
                  oldestCC,
                  latestT,
                  latestBC,
                  latestMC,
                  latestQC
            ORDER BY latestSm.importDate DESC
            LIMIT 500
            `
          ); // NOTE above the LIMIT clause, use SKIP 0 to skip the first 0 samples, SKIP 10 to skip the first 10, etc.

          // Process the results
          const sampleDashboardRows = result.records.map((record) => {
            // TODO still add indexes
            const sample = record.get("sample");
            const latestSm = record.get("latestSm");
            const latestSt = record.get("latestSt"); // can be null
            const oldestCC = record.get("oldestCC"); // can be null
            const latestT = record.get("latestT"); // can be null
            const latestBC = record.get("latestBC"); // can be null
            const latestMC = record.get("latestMC"); // can be null
            const latestQC = record.get("latestQC"); // can be null

            const oncotreeCode = latestSm.properties.oncotreeCode;
            let cancerType: string;
            let cancerTypeDetailed: string;

            if (oncotreeCode) {
              let cachedData =
                oncotreeCache?.get<CachedOncotreeData>(oncotreeCode);
              // if (!cachedData && oncotreeCache) {
              //   await fetchAndCacheOncotreeData(oncotreeCache);
              //   cachedData = oncotreeCache.get(oncotreeCode);
              // }
              if (cachedData) {
                cancerType = cachedData.mainType;
                cancerTypeDetailed = cachedData.name;
              }
            }

            const toReturn = {
              primaryId: latestSm.properties.primaryId,
              datasource: sample.properties.datasource, // TODO not required for dashboard, but is required if returning a "Sample"
              revisable: sample.properties.revisable, // TODO not required for dashboard, but is required if returning a "Sample"
              sampleCategory: sample.properties.sampleCategory, // TODO not required for dashboard, but is required if returning a "Sample"
              smileSampleId: sample.properties.smileSampleId, // TODO not required for dashboard, but is required if returning a "Sample"
              validationStatus: latestSt
                ? latestSt.properties.validationStatus
                : null,
              cmoSampleName: latestSm.properties.cmoSampleName,
              importDate: latestSm.properties.importDate,
              cmoPatientId: latestSm.properties.cmoPatientId,
              investigatorSampleId: latestSm.properties.investigatorSampleId,
              sampleType: latestSm.properties.sampleType,
              species: latestSm.properties.species,
              genePanel: latestSm.properties.genePanel,
              baitSet: latestSm.properties.baitSet,
              preservation: latestSm.properties.preservation,
              tumorOrNormal: latestSm.properties.tumorOrNormal,
              sampleClass: sample.properties.sampleClass,
              oncotreeCode: latestSm.properties.oncotreeCode,
              collectionYear: latestSm.properties.collectionYear,
              sampleOrigin: latestSm.properties.sampleOrigin,
              tissueLocation: latestSm.properties.tissueLocation,
              sex: latestSm.properties.sex,
              recipe: latestSm.properties.cmoSampleIdFields.recipe,
              initialPipelineRunDate: oldestCC
                ? oldestCC.properties.date
                : null,
              embargoDate: oldestCC
                ? new Date(
                    new Date(oldestCC.properties.date).setMonth(
                      new Date(oldestCC.properties.date).getMonth() + 18
                    )
                  ).toISOString()
                : null,
              billed: latestT ? latestT.properties.billed : null,
              costCenter: latestT ? latestT.properties.costCenter : null,
              billedBy: latestT // editedBy
                ? latestT.properties.billedBy
                : null,
              custodianInformation: latestT
                ? latestT.properties.custodianInformation
                : null,
              accessLevel: latestT ? latestT.properties.accessLevel : null,
              bamCompleteDate: latestBC ? latestBC.properties.date : null,
              bamCompleteStatus: latestBC ? latestBC.properties.status : null,
              mafCompleteDate: latestMC ? latestMC.properties.date : null,
              mafCompleteNormalPrimaryId: latestMC
                ? latestMC.properties.normalPrimaryId
                : null,
              mafCompleteStatus: latestMC ? latestMC.properties.status : null,
              qcCompleteDate: latestQC ? latestQC.properties.date : null,
              qcCompleteResult: latestQC ? latestQC.properties.result : null,
              qcCompleteReason: latestQC ? latestQC.properties.reason : null,
              qcCompleteStatus: latestQC ? latestQC.properties.status : null,
            };
            return toReturn;
          });

          var endTime = performance.now();
          console.log(`NEW query took ${(endTime - startTime) / 1000} seconds`);

          return sampleDashboardRows;
        } catch (error) {
          console.error("Error running query:", error);
        }
      },
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
            await sortArrayByNestedField(
              requests,
              "Request",
              sortField,
              sortOrder
            );
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
            await sortArrayByNestedField(
              patients,
              "Patient",
              sortField,
              sortOrder
            );
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
        { samplesLoader }: ApolloServerContext
      ) {
        const result = await samplesLoader.load(args);
        return result.data;
      },
      async samplesConnection(
        _source: undefined,
        args: any,
        { samplesLoader }: ApolloServerContext
      ) {
        const result = await samplesLoader.load(args);
        return {
          totalCount: result.totalCount,
        };
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
            await sortArrayByNestedField(
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
    //Sample: generateFieldResolvers(flattenedSampleFields, "Sample"),
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
