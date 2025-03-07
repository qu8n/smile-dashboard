import NodeCache from "node-cache";
import {
  QueryDashboardSampleCountArgs,
  QueryDashboardSamplesArgs,
} from "../../generated/graphql";
import { CachedOncotreeData } from "../../utils/oncotree";
import { neo4jDriver } from "../../utils/servers";
import {
  buildCypherDateFilter,
  buildCypherBooleanFilter,
  getNeo4jCustomSort,
} from "../custom";

export function buildSamplesQueryBody({
  searchVals,
  context,
  filters,
  addlOncotreeCodes,
}: {
  searchVals: QueryDashboardSampleCountArgs["searchVals"];
  context?: QueryDashboardSampleCountArgs["context"];
  filters?: QueryDashboardSamplesArgs["filters"];
  addlOncotreeCodes: string[];
}) {
  // Because the samples query is more complex than other queries (e.g. requests), we improve its performance
  // by building WHERE clauses and injecting them into the query as early as possible and when convenient.
  // This contrasts with our approach in other query builders, where we combine all predicates into a single
  // WHERE clause and injecting that at the end (right before the RETURN statement).
  let searchFilters = "";
  if (searchVals?.length) {
    const fieldsToSearch = [
      "latestSm.primaryId",
      "latestSm.cmoSampleName",
      "latestSm.importDate",
      "latestSm.cmoPatientId",
      "latestSm.investigatorSampleId",
      "latestSm.sampleType",
      "latestSm.species",
      "latestSm.genePanel",
      "latestSm.baitSet",
      "latestSm.preservation",
      "latestSm.tumorOrNormal",
      "latestSm.sampleClass",
      "latestSm.oncotreeCode",
      "latestSm.collectionYear",
      "latestSm.sampleOrigin",
      "latestSm.tissueLocation",
      "latestSm.sex",
      "latestSm.cmoSampleIdFields", // for searching recipe
      "latestSm.additionalProperties", // for searching alt ID
      "t.costCenter",
      "t.billedBy",
      "t.custodianInformation",
      "t.accessLevel",
      "latestBC.date",
      "latestBC.status",
      "latestMC.date",
      "latestMC.normalPrimaryId",
      "latestMC.status",
      "latestQC.date",
      "latestQC.result",
      "latestQC.reason",
      "latestQC.status",
      "historicalCmoSampleNames",
    ];
    searchFilters += fieldsToSearch
      .map((field) => `${field} =~ '(?i).*(${searchVals.join("|")}).*'`)
      .join(" OR ");
    if (addlOncotreeCodes.length) {
      searchFilters += ` OR latestSm.oncotreeCode =~ '^(${addlOncotreeCodes.join(
        "|"
      )})'`;
    }
  }

  // Filter for WES samples on click on the Samples page
  const wesContext =
    context?.fieldName === "genePanel"
      ? `latestSm.genePanel =~ '(?i).*(${context.values.join("|")}).*'`
      : "";

  // Filter for the current request in the Request Samples view
  const requestContext =
    context?.fieldName === "igoRequestId"
      ? `latestSm.igoRequestId = '${context.values[0]}'`
      : "";

  // Filter for the current patient for the Patient Samples view
  const patientContext =
    context?.fieldName === "patientId"
      ? `pa.value = '${context.values[0]}'`
      : "";

  // Filter for the current cohort for the Cohort Samples view
  const cohortContext =
    context?.fieldName === "cohortId"
      ? `c.cohortId = '${context.values[0]}'`
      : "";

  // "Last Updated" column filter in the Samples Metadata view
  let importDateFilter = "";
  const importDateFilterObj = filters?.find(
    (filter) => filter.field === "importDate"
  );
  if (importDateFilterObj) {
    importDateFilter = buildCypherDateFilter({
      dateVar: "latestSm.importDate",
      filter: JSON.parse(importDateFilterObj.filter),
    });
  }

  // "Billed" column filter for the Cohort Samples view
  let billedFilter = "";
  const billedFilterObj = filters?.find((filter) => filter.field === "billed");
  if (billedFilterObj) {
    billedFilter = buildCypherBooleanFilter({
      booleanVar: "t.billed",
      filter: JSON.parse(billedFilterObj.filter),
      noIncludesFalseAndNull: true,
    });
  }

  // "Initial Pipeline Run Date" column filter in the Cohort Samples view
  let initialPipelineRunDateFilter = "";
  const initialPipelineRunDateFilterObj = filters?.find(
    (filter) => filter.field === "initialPipelineRunDate"
  );
  if (initialPipelineRunDateFilterObj) {
    initialPipelineRunDateFilter = buildCypherDateFilter({
      dateVar: "t.initialPipelineRunDate",
      filter: JSON.parse(initialPipelineRunDateFilterObj.filter),
    });
  }
  // Embargo Date" column filter in the Cohort Samples view
  let embargoDateFilter = "";
  const embargoDateFilterObj = filters?.find(
    (filter) => filter.field === "embargoDate"
  );
  if (embargoDateFilterObj) {
    embargoDateFilter = buildCypherDateFilter({
      dateVar: "t.embargoDate",
      filter: JSON.parse(embargoDateFilterObj.filter),
    });
  }
  const cohortDateFilters = [initialPipelineRunDateFilter, embargoDateFilter]
    .filter(Boolean)
    .map((filter) => `(${filter})`)
    .join(" AND ");

  // "Latest BAM Complete Date" column filter in the Cohort Samples view
  let bamCompleteDateFilter = "";
  const bamCompleteDateFilterObj = filters?.find(
    (filter) => filter.field === "bamCompleteDate"
  );
  if (bamCompleteDateFilterObj) {
    bamCompleteDateFilter = buildCypherDateFilter({
      dateVar: "latestBC.date",
      safelyHandleDateString: true,
      filter: JSON.parse(bamCompleteDateFilterObj.filter),
    });
  }

  // "Latest MAF Complete Date" column filter in the Cohort Samples view
  let mafCompleteDateFilter = "";
  const mafCompleteDateFilterObj = filters?.find(
    (filter) => filter.field === "mafCompleteDate"
  );
  if (mafCompleteDateFilterObj) {
    mafCompleteDateFilter = buildCypherDateFilter({
      dateVar: "latestMC.date",
      safelyHandleDateString: true,
      filter: JSON.parse(mafCompleteDateFilterObj.filter),
    });
  }

  // "Latest QC Complete Date" column filter in the Cohort Samples view
  let qcCompleteDateFilter = "";
  const qcCompleteDateFilterObj = filters?.find(
    (filter) => filter.field === "qcCompleteDate"
  );
  if (qcCompleteDateFilterObj) {
    qcCompleteDateFilter = buildCypherDateFilter({
      dateVar: "latestQC.date",
      safelyHandleDateString: true,
      filter: JSON.parse(qcCompleteDateFilterObj.filter),
    });
  }

  // NOTE: For future reference, we can get a list of historical CMO labels and import dates by replacing
  // '| sm.cmoSampleName' with '| {cmoSampleName: sm.cmoSampleName, importDate: sm.importDate}'
  const samplesQueryBody = `
    // Get Sample and the most recent SampleMetadata
    MATCH (s:Sample)-[:HAS_METADATA]->(sm:SampleMetadata)
    WITH
      s,
      collect(sm) AS allSampleMetadata,
      max(sm.importDate) AS latestImportDate
    WITH
      s,
      allSampleMetadata,
      [sm IN allSampleMetadata WHERE sm.importDate = latestImportDate][0] AS latestSm

    // Get a list of historical CMO sample labels
    WITH
      s,
      latestSm,
      apoc.text.join(
        apoc.coll.toSet(
          [sm IN apoc.coll.sortMaps(allSampleMetadata, "importDate")
            WHERE sm.cmoSampleName <> latestSm.cmoSampleName AND sm.cmoSampleName <> ""
            | sm.cmoSampleName + " (" + sm.importDate + ")"
          ]
        ),
      ", ") AS historicalCmoSampleNames

    // Filters for either the WES Samples or Request Samples view, if applicable
    ${wesContext && `WHERE ${wesContext}`}
    ${requestContext && `WHERE ${requestContext}`}

    // Get SampleMetadata's Status
    OPTIONAL MATCH (latestSm)-[:HAS_STATUS]->(st:Status)
    WITH
      s,
      latestSm,
      historicalCmoSampleNames,
      st AS latestSt
    ${importDateFilter && `WHERE ${importDateFilter}`}

    // Filters for Patient Samples view, if applicable
    ${
      patientContext &&
      `MATCH (s)<-[:HAS_SAMPLE]-(p:Patient)<-[:IS_ALIAS]-(pa:PatientAlias) WHERE ${patientContext}`
    }

    // Filters for Cohort Samples view, if applicable
    ${
      cohortContext ? "" : "OPTIONAL "
    }MATCH (s)<-[:HAS_COHORT_SAMPLE]-(c:Cohort)
    ${cohortContext && `WHERE ${cohortContext}`}

    // Get Tempo data
    OPTIONAL MATCH (s)-[:HAS_TEMPO]->(t:Tempo)
    // We're calling WITH immediately after OPTIONAL MATCH here to correctly filter Tempo data
    WITH
      s,
      latestSm,
      latestSt,
      historicalCmoSampleNames,
      t
    ${billedFilter && `WHERE ${billedFilter}`}
    ${cohortDateFilters && `WHERE ${cohortDateFilters}`}

    // Get the most recent BamComplete event
    OPTIONAL MATCH (t)-[:HAS_EVENT]->(bc:BamComplete)
    WITH
      s,
      latestSm,
      latestSt,
      historicalCmoSampleNames,
      t,
      collect(bc) AS allBamCompletes,
      max(bc.date) AS latestBCDate
    WITH
      s,
      latestSm,
      latestSt,
      historicalCmoSampleNames,
      t,
      [bc IN allBamCompletes WHERE bc.date = latestBCDate][0] AS latestBC
    ${bamCompleteDateFilter && `WHERE ${bamCompleteDateFilter}`}

    // Get the most recent MafComplete event
    OPTIONAL MATCH (t)-[:HAS_EVENT]->(mc:MafComplete)
    WITH
      s,
      latestSm,
      latestSt,
      historicalCmoSampleNames,
      t,
      latestBC,
      collect(mc) AS allMafCompletes,
      max(mc.date) AS latestMCDate
    WITH
      s,
      latestSm,
      latestSt,
      historicalCmoSampleNames,
      t,
      latestBC,
      [mc IN allMafCompletes WHERE mc.date = latestMCDate][0] AS latestMC
    ${mafCompleteDateFilter && `WHERE ${mafCompleteDateFilter}`}

    // Get the most recent QcComplete event
    OPTIONAL MATCH (t)-[:HAS_EVENT]->(qc:QcComplete)
    WITH
      s,
      latestSm,
      latestSt,
      historicalCmoSampleNames,
      t,
      latestBC,
      latestMC,
      collect(qc) AS allQcCompletes,
      max(qc.date) AS latestQCDate
    WITH
      s,
      latestSm,
      latestSt,
      historicalCmoSampleNames,
      t,
      latestBC,
      latestMC,
      [qc IN allQcCompletes WHERE qc.date = latestQCDate][0] AS latestQC
    ${qcCompleteDateFilter && `WHERE ${qcCompleteDateFilter}`}

    WITH
      s,
      latestSm,
      latestSt,
      historicalCmoSampleNames,
      t,
      latestBC,
      latestMC,
      latestQC
    ${searchFilters && `WHERE ${searchFilters}`}
  `;

  return samplesQueryBody;
}
export async function queryDashboardSamples({
  queryBody,
  sort,
  limit,
  offset,
  oncotreeCache,
}: {
  queryBody: string;
  sort: QueryDashboardSamplesArgs["sort"];
  limit: QueryDashboardSamplesArgs["limit"];
  offset: QueryDashboardSamplesArgs["offset"];
  oncotreeCache: NodeCache;
}) {
  const cypherQuery = `
    ${queryBody}
    RETURN
      s.smileSampleId AS smileSampleId,
      s.revisable AS revisable,

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
      apoc.convert.fromJsonMap(latestSm.cmoSampleIdFields).recipe AS recipe,
      apoc.convert.fromJsonMap(latestSm.additionalProperties).altId AS altId,
      historicalCmoSampleNames,
      latestSt.validationReport AS validationReport,
      latestSt.validationStatus AS validationStatus,

      t.smileTempoId AS smileTempoId,
      t.billed AS billed,
      t.costCenter AS costCenter,
      t.billedBy AS billedBy,
      t.custodianInformation AS custodianInformation,
      t.accessLevel AS accessLevel,
      t.initialPipelineRunDate AS initialPipelineRunDate,
      t.embargoDate AS embargoDate,

      latestBC.date AS bamCompleteDate,
      latestBC.status AS bamCompleteStatus,

      latestMC.date AS mafCompleteDate,
      latestMC.normalPrimaryId AS mafCompleteNormalPrimaryId,
      latestMC.status AS mafCompleteStatus,

      latestQC.date AS qcCompleteDate,
      latestQC.result AS qcCompleteResult,
      latestQC.reason AS qcCompleteReason,
      latestQC.status AS qcCompleteStatus

    ORDER BY ${getNeo4jCustomSort(sort)}
    SKIP ${offset}
    LIMIT ${limit}
  `;

  const session = neo4jDriver.session();
  try {
    const result = await session.run(cypherQuery);

    return result.records.map((record) => {
      const recordObject = record.toObject();
      const otCache = recordObject.oncotreeCode
        ? (oncotreeCache.get(recordObject.oncotreeCode) as CachedOncotreeData)
        : null;

      return {
        ...recordObject,
        cancerType: otCache?.mainType,
        cancerTypeDetailed: otCache?.name,
      };
    });
  } catch (error) {
    console.error("Error with queryDashboardSamples:", error);
  }
}
export async function queryDashboardSampleCount({
  queryBody,
}: {
  queryBody: string;
}) {
  const cypherQuery = `
    ${queryBody}
    RETURN
      count(s) AS totalCount
  `;

  const session = neo4jDriver.session();
  try {
    const result = await session.run(cypherQuery);
    return result.records[0].toObject();
  } catch (error) {
    console.error("Error with queryDashboardSampleCount:", error);
  }
}
