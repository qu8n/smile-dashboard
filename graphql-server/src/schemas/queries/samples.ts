import {
  DashboardSample,
  QueryDashboardSamplesArgs,
} from "../../generated/graphql";
import { OncotreeCache } from "../../utils/cache";
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
  searchVals: QueryDashboardSamplesArgs["searchVals"];
  context?: QueryDashboardSamplesArgs["context"];
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
      "primaryId",
      "cmoSampleName",
      "importDate",
      "cmoPatientId",
      "investigatorSampleId",
      "sampleType",
      "species",
      "genePanel",
      "baitSet",
      "preservation",
      "tumorOrNormal",
      "sampleClass",
      "oncotreeCode",
      "collectionYear",
      "sampleOrigin",
      "tissueLocation",
      "sex",
      "recipe",
      "altId",
      "costCenter",
      "billedBy",
      "custodianInformation",
      "accessLevel",
      "bamCompleteDate",
      "bamCompleteStatus",
      "mafCompleteDate",
      "mafCompleteNormalPrimaryId",
      "mafCompleteStatus",
      "qcCompleteDate",
      "qcCompleteResult",
      "qcCompleteReason",
      "qcCompleteStatus",
      "historicalCmoSampleNames",
      "sampleCategory",
    ];
    searchFilters += fieldsToSearch
      .map(
        (field) => `tempNode.${field} =~ '(?i).*(${searchVals.join("|")}).*'`
      )
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
    MATCH (s:Sample)
    WITH
      s,
      COLLECT {
      	MATCH (s)-[:HAS_METADATA]->(sm:SampleMetadata)
      	RETURN sm ORDER BY sm.importDate DESC LIMIT 1
      } AS latestSm

    WITH
      s,
      latestSm[0] AS latestSm,
      COLLECT {
      	MATCH (s)-[:HAS_METADATA]->(sm:SampleMetadata)
      	RETURN ({
      		cmoSampleName: sm.cmoSampleName,
      		importDate: sm.importDate
      	})
      } AS sampleIdsList

    WITH
      s,
      latestSm,
      apoc.text.join(
        apoc.coll.toSet(
          [sid IN apoc.coll.sortMaps(sampleIdsList, "importDate")
            WHERE sid.cmoSampleName <> latestSm.cmoSampleName AND sid.cmoSampleName <> ""
            | sid.cmoSampleName + " (" + sid.importDate + ")"
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

    // Get the most recent Tempo events
    WITH
      s,
      latestSm,
      latestSt,
      historicalCmoSampleNames,
      t,
      COLLECT {
        OPTIONAL MATCH (t)-[:HAS_EVENT]->(bc:BamComplete)
        RETURN bc ORDER BY bc.date DESC LIMIT 1
      } AS latestBC,
      COLLECT {
        OPTIONAL MATCH (t)-[:HAS_EVENT]->(mc:MafComplete)
        RETURN mc ORDER BY mc.date DESC LIMIT 1
      } AS latestMC,
      COLLECT {
        OPTIONAL MATCH (t)-[:HAS_EVENT]->(qc:QcComplete)
        RETURN qc ORDER BY qc.date DESC LIMIT 1
      } AS latestQC

    WITH
      s,
      latestSm,
      historicalCmoSampleNames,
      latestSt,
      t,
      latestBC[0] AS latestBC,
      latestMC[0] AS latestMC,
      latestQC[0] AS latestQC,
      apoc.convert.fromJsonMap(latestSm.cmoSampleIdFields) AS cmoSampleIdFields

      ${bamCompleteDateFilter && `WHERE ${bamCompleteDateFilter}`}
      ${mafCompleteDateFilter && `WHERE ${mafCompleteDateFilter}`}
      ${qcCompleteDateFilter && `WHERE ${qcCompleteDateFilter}`}

    // Get DbGap data
    OPTIONAL MATCH (s)-[:HAS_DBGAP]->(d:DbGap)

    WITH
      ({
        smileSampleId: s.smileSampleId,
        revisable: s.revisable,
        sampleCategory: s.sampleCategory,

        primaryId: latestSm.primaryId,
        cmoSampleName: latestSm.cmoSampleName,
        importDate: latestSm.importDate,
        historicalCmoSampleNames: historicalCmoSampleNames,
        validationReport: latestSt.validationReport,
        validationStatus: latestSt.validationStatus,
        cmoPatientId: latestSm.cmoPatientId,
        investigatorSampleId: latestSm.investigatorSampleId,
        sampleType: latestSm.sampleType,
        species: latestSm.species,
        genePanel: latestSm.genePanel,
        baitSet: latestSm.baitSet,
        preservation: latestSm.preservation,
        tumorOrNormal: latestSm.tumorOrNormal,
        sampleClass: latestSm.sampleClass,
        oncotreeCode: latestSm.oncotreeCode,
        collectionYear: latestSm.collectionYear,
        sampleOrigin: latestSm.sampleOrigin,
        tissueLocation: latestSm.tissueLocation,
        sex: latestSm.sex,
        libraries: latestSm.libraries,
        recipe: cmoSampleIdFields.recipe,
        analyteType: cmoSampleIdFields.naToExtract,
        altId: apoc.convert.fromJsonMap(latestSm.additionalProperties).altId,
        validationReport: latestSt.validationReport,
        validationStatus: latestSt.validationStatus,

        smileTempoId: t.smileTempoId,
        billed: t.billed,
        costCenter: t.costCenter,
        billedBy: t.billedBy,
        custodianInformation: t.custodianInformation,
        accessLevel: t.accessLevel,
        initialPipelineRunDate: t.initialPipelineRunDate,
        embargoDate: t.embargoDate,
        bamCompleteDate: latestBC.date,
        bamCompleteStatus: latestBC.status,
        mafCompleteDate: latestMC.date,
        mafCompleteNormalPrimaryId: latestMC.normalPrimaryId,
        mafCompleteStatus: latestMC.status,
        qcCompleteDate: latestQC.date,
        qcCompleteResult: latestQC.result,
        qcCompleteReason: latestQC.reason,
        qcCompleteStatus: latestQC.status,

        dbGapStudy: d.dbGapStudy
      }) AS tempNode

    ${searchFilters && `WHERE ${searchFilters}`}
  `;

  return samplesQueryBody;
}

export function buildSamplesQueryFinal({
  queryBody,
  sort,
  limit,
  offset,
}: {
  queryBody: string;
  sort: QueryDashboardSamplesArgs["sort"];
  limit: QueryDashboardSamplesArgs["limit"];
  offset: QueryDashboardSamplesArgs["offset"];
}) {
  return `
    ${queryBody}
    WITH COUNT(DISTINCT tempNode) AS total, COLLECT(DISTINCT tempNode) AS results
    UNWIND results AS resultz
    WITH resultz, total

    RETURN
      resultz{.*, _total: total}

    ORDER BY ${getNeo4jCustomSort(sort)}
    SKIP ${offset}
    LIMIT ${limit}
  `;
}

export async function queryDashboardSamples({
  samplesCypherQuery,
  oncotreeCache,
}: {
  samplesCypherQuery: string;
  oncotreeCache: OncotreeCache | undefined;
}): Promise<DashboardSample[]> {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(samplesCypherQuery);
    return result.records.map((record) => {
      const recordObject = record.toObject().resultz;
      const instrumentModel = getInstrumentModelByLibraries(
        recordObject.libraries
      );
      return {
        ...recordObject,
        cancerType: oncotreeCache?.[recordObject.oncotreeCode]?.mainType,
        cancerTypeDetailed: oncotreeCache?.[recordObject.oncotreeCode]?.name,
        instrumentModel: instrumentModel,
        platform: getPlatformByInstrumentModel(instrumentModel),
      };
    });
  } catch (error) {
    console.error("Error with queryDashboardSamples:", error);
    return [];
  } finally {
    await session.close();
  }
}

export function getAddlOtCodesMatchingCtOrCtdVals({
  searchVals,
  oncotreeCache,
}: {
  searchVals: QueryDashboardSamplesArgs["searchVals"];
  oncotreeCache: OncotreeCache;
}) {
  let addlOncotreeCodes: Set<string> = new Set();
  if (searchVals?.length) {
    for (const [code, { name, mainType }] of Object.entries(oncotreeCache)) {
      for (const val of searchVals) {
        if (
          name?.toLowerCase().includes(val?.toLowerCase()) ||
          mainType?.toLowerCase().includes(val?.toLowerCase())
        ) {
          addlOncotreeCodes.add(code);
        }
      }
    }
  }
  return Array.from(addlOncotreeCodes);
}

export type SampleDataForCacheUpdate = Record<
  string,
  Pick<
    DashboardSample,
    | "primaryId"
    | "cmoSampleName"
    | "historicalCmoSampleNames"
    | "importDate"
    | "revisable"
  >
>;

export async function querySelectSampleDataForCacheUpdate(
  primaryIds: string[]
): Promise<SampleDataForCacheUpdate> {
  const cypherQuery = `
    MATCH (s:Sample)
    WITH
      s,
      COLLECT {
      	MATCH (s)-[:HAS_METADATA]->(sm:SampleMetadata)
      	RETURN sm ORDER BY sm.importDate DESC LIMIT 1
      } AS latestSm
    WITH
      s,
      latestSm[0] AS latestSm,
      COLLECT {
      	MATCH (s)-[:HAS_METADATA]->(sm:SampleMetadata)
      	RETURN ({
      		cmoSampleName: sm.cmoSampleName,
      		importDate: sm.importDate
      	})
      } AS sampleIdsList
    WITH
      s,
      latestSm,
      apoc.text.join(
        apoc.coll.toSet(
          [sid IN apoc.coll.sortMaps(sampleIdsList, "importDate")
            WHERE sid.cmoSampleName <> latestSm.cmoSampleName AND sid.cmoSampleName <> ""
            | sid.cmoSampleName + " (" + sid.importDate + ")"
          ]
        ),
      ", ") AS historicalCmoSampleNames
    WHERE latestSm.primaryId IN $primaryIds
    RETURN
      latestSm.primaryId AS primaryId,
      latestSm.cmoSampleName AS cmoSampleName,
      latestSm.importDate AS importDate,
      historicalCmoSampleNames,
      s.revisable AS revisable
  `;

  const session = neo4jDriver.session();
  try {
    const result = await session.run(cypherQuery, { primaryIds });
    return result.records
      .map((record) => record.toObject())
      .reduce((acc, { primaryId, ...rest }) => {
        acc[primaryId] = rest;
        return acc;
      }, {});
  } catch (error) {
    console.error("Error with querySelectSampleDataForCacheUpdate:", error);
    return {};
  } finally {
    await session.close();
  }
}

/**
 * Extracts the instrument model from a JSON string containing libraries data
 * Returns the most recent instrument model based on run dates (confirmed with PMs)
 */
function getInstrumentModelByLibraries(
  libraries: string | null
): string | null {
  if (libraries == null) return null;
  try {
    const libs = JSON.parse(libraries) as Array<{
      runs?: Array<{
        runMode?: string;
        runDate?: string;
      }>;
    }>;
    const latestRun = {
      runMode: null as string | null,
      runDate: null as Date | null,
    };
    for (const currLib of libs) {
      if (!Array.isArray(currLib.runs) || currLib.runs.length === 0) continue;
      for (const currRun of currLib.runs) {
        if (!currRun.runMode || !currRun.runDate) continue;
        const currRunDate = new Date(currRun.runDate);
        if (!latestRun.runDate || currRunDate > latestRun.runDate) {
          latestRun.runDate = currRunDate;
          latestRun.runMode = currRun.runMode;
        }
      }
    }
    return latestRun.runMode;
  } catch (e) {
    return null;
  }
}

/**
 * Set of Illumina platform's instrument models
 * Source: Sinisa
 */
const ILLUMINA_INSTRUMENT_MODELS = new Set([
  "HiSeq",
  "HiSeq High Output",
  "HiSeq Rapid Run",
  "HiSeq X",
  "MiSeq",
  "NextSeq",
  "NextSeq 2000",
  "NovaSeq",
  "NovaSeq S1",
  "NovaSeq S2",
  "NovaSeq S4",
  "NovaSeq SP",
  "NovaSeq X 10B",
  "NovaSeq X 1.5B",
  "NovaSeq X 25B",
]);

/**
 * Returns the platform based on the instrument model value
 * Currently only supports Illumina
 */
function getPlatformByInstrumentModel(
  instrumentModel: string | null
): string | null {
  return instrumentModel && ILLUMINA_INSTRUMENT_MODELS.has(instrumentModel)
    ? "Illumina"
    : null;
}
