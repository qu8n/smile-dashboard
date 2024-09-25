import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServerContext, neo4jDriver } from "../utils/servers";
import { CachedOncotreeData } from "../utils/oncotree";
import NodeCache from "node-cache";
import { parseJsonSafely } from "../utils/json";

const resolvers = {
  Query: {
    async dashboardSampleCount() {
      return {
        totalCount: 501, // PLACEHOLDER
      };
    },
    async dashboardSamples(
      _source: undefined,
      { searchVals }: { searchVals: string[] },
      { oncotreeCache }: ApolloServerContext
    ) {
      let addlOncotreeCodes: Set<string> = new Set();
      if (searchVals.length > 0) {
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

      return await queryDashboardSamples(
        searchVals,
        oncotreeCache,
        Array.from(addlOncotreeCodes)
      );
    },
  },
};

const typeDefs = `
  type DashboardSampleCount {
    totalCount: Int
  }

  type DashboardSample {
    # (s:Sample)
    smileSampleId: String
    revisable: Boolean

    # (s:Sample)-[:HAS_METADATA]->(sm:SampleMetadata)
    ## Root-level fields
    primaryId: String
    cmoSampleName: String
    importDate: String
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
    dmpPatientId: String
    ## (sm:SampleMetadata)-[:HAS_STATUS]->(s:Status)
    validationReport: String
    validationStatus: String

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

  type Query {
    dashboardSampleCount(searchVals: [String]): DashboardSampleCount
    dashboardSamples(searchVals: [String]): [DashboardSample]
  }
`;

export const customSchema = makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

async function queryDashboardSamples(
  searchVals: string[],
  oncotreeCache: NodeCache,
  addlOncotreeCodes: string[]
) {
  const startTime = performance.now();
  const session = neo4jDriver.session();

  function createFilters(
    variable: string,
    fields: string[],
    searchVals: string[]
  ): string {
    const regexPattern = `(?i).*(${searchVals.join("|")}).*`;
    return fields
      .map((field) => `${variable}.${field} =~ '${regexPattern}'`)
      .join(" OR ");
  }

  const filtersConfig = [
    {
      variable: "sm",
      fields: [
        "additionalProperties",
        "baitSet",
        "cfDNA2dBarcode",
        "cmoInfoIgoId",
        "cmoPatientId",
        "cmoSampleIdFields",
        "cmoSampleName",
        "collectionYear",
        "genePanel",
        "igoComplete",
        "igoRequestId",
        "importDate",
        "investigatorSampleId",
        "libraries",
        "oncotreeCode",
        "preservation",
        "primaryId",
        "qcReports",
        "sampleClass",
        "sampleName",
        "sampleOrigin",
        "sampleType",
        "sex",
        "species",
        "tissueLocation",
        "tubeId",
        "tumorOrNormal",
      ],
    },
    {
      variable: "t",
      fields: ["costCenter", "billedBy", "custodianInformation", "accessLevel"],
    },
    { variable: "bc", fields: ["date", "status"] },
    { variable: "mc", fields: ["date", "normalPrimaryId", "status"] },
    { variable: "qc", fields: ["date", "result", "reason", "status"] },
  ];

  const filters =
    searchVals.length > 0
      ? filtersConfig.map(
          (config) =>
            `WHERE ${createFilters(config.variable, config.fields, searchVals)}`
        )
      : ["", "", "", "", ""];

  const [smFilters, tFilters, bcFilters, mcFilters, qcFilters] = filters;

  const addlOncotreeCodeFilters =
    addlOncotreeCodes.length > 0
      ? ` OR ${createFilters("sm", ["oncotreeCode"], addlOncotreeCodes)}`
      : "";

  try {
    const result = await session.run(
      `
        // all Samples have at least one SampleMetadata (SampleMetadata is required)
        MATCH (s:Sample)-[:HAS_METADATA]->(sm:SampleMetadata)

        ${smFilters + addlOncotreeCodeFilters}

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

        ${tFilters}

        // now get the most recent date for each Sample from the Tempos (we still have all the Tempos for each Sample)
        WITH s, latestSm, latestSt, oldestCC, collect(t) AS allTempos, max(t.date) AS latestTDate

        // now only keep one of the Tempos that has the most recent date (if there is more than one we take the first)
        WITH s, latestSm, latestSt, oldestCC, [t IN allTempos WHERE t.date = latestTDate][0] AS latestT

        // if the Tempo has any BamCompletes, get them
        OPTIONAL MATCH (latestT)-[:HAS_EVENT]->(bc:BamComplete)

        ${bcFilters}

        // now get the most recent date for each BamComplete (we still have all the BamCompletes for each Tempo)
        WITH s, latestSm, latestSt, oldestCC, latestT, collect(bc) AS allBamCompletes, max(bc.date) AS latestBCDate

        // now only keep one of the BamCompletes that has the most recent date (if there is more than one we take the first)
        WITH s, latestSm, latestSt, oldestCC, latestT, [bc IN allBamCompletes WHERE bc.date = latestBCDate][0] AS latestBC

        // if the Tempo has any MafCompletes, get them
        OPTIONAL MATCH (latestT)-[:HAS_EVENT]->(mc:MafComplete)

        ${mcFilters}

        // now get the most recent date for each MafComplete (we still have all the MafCompletes for each Tempo)
        WITH s, latestSm, latestSt, oldestCC, latestT, latestBC, collect(mc) AS allMafCompletes, max(mc.date) AS latestMCDate

        // now only keep one of the MafCompletes that has the most recent date (if there is more than one we take the first)
        WITH s, latestSm, latestSt, oldestCC, latestT, latestBC, [mc IN allMafCompletes WHERE mc.date = latestMCDate][0] AS latestMC

        // if the Tempo has any QcCompletes, get them
        OPTIONAL MATCH (latestT)-[:HAS_EVENT]->(qc:QcComplete)

        ${qcFilters}

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
          sample.revisable AS revisable,

          latestSm.primaryId AS primaryId,
          latestSm.cmoSampleName AS cmoSampleName,
          latestSm.importDate AS importDate,
          latestSm.cmoPatientId AS cmoPatientId, // MISSING dmpPatientId
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
          latestSm.cmoSampleIdFields AS cmoSampleIdFields,

          oldestCC.date AS initialPipelineRunDate,

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
    );
    const sampleDashboardRows = result.records.map((record) => {
      const recordObject = record.toObject();
      const otCache = recordObject.oncotreeCode
        ? (oncotreeCache.get(recordObject.oncotreeCode) as CachedOncotreeData)
        : null;
      return {
        ...recordObject,
        recipe: parseJsonSafely(recordObject.cmoSampleIdFields)?.recipe,
        embargoDate: recordObject.initialPipelineRunDate
          ? new Date(
              new Date(recordObject.initialPipelineRunDate).setMonth(
                new Date(recordObject.initialPipelineRunDate).getMonth() + 18
              )
            ).toISOString()
          : null,
        cancerType: otCache?.mainType,
        cancerTypeDetailed: otCache?.name,
      };
    });

    const endTime = performance.now();
    console.log(`NEW query took ${(endTime - startTime) / 1000} seconds`);

    return sampleDashboardRows;
  } catch (error) {
    console.error("Error running query:", error);
  }
}
