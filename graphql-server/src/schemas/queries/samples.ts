import {
  DashboardRecordContext,
  DashboardSample,
  InputMaybe,
  QueryDashboardSamplesArgs,
} from "../../generated/graphql";
import { OncotreeCache } from "../../utils/cache";
import { neo4jDriver } from "../../utils/servers";
import {
  buildCypherPredicateFromDateColFilter,
  buildCypherPredicateFromBooleanColFilter,
  getCypherCustomOrderBy,
  buildCypherPredicatesFromSearchVals,
  isQuotedString,
} from "../../utils/cypher";

const FIELDS_TO_SEARCH = [
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
  "dbGapStudy",
  "cfDNA2dBarcode",
];

export function buildSamplesQueryBody({
  searchVals,
  contexts,
  columnFilters,
  addlOncotreeCodes,
}: {
  searchVals: QueryDashboardSamplesArgs["searchVals"];
  contexts?: QueryDashboardSamplesArgs["contexts"];
  columnFilters?: QueryDashboardSamplesArgs["columnFilters"];
  addlOncotreeCodes: string[];
}) {
  // Because the samples query is more complex than other queries (e.g. requests), we improve its performance
  // by building WHERE clauses and injecting them into the query as early as possible and when convenient.
  // This contrasts with our approach in other query builders, where we combine all predicates into a single
  // WHERE clause and injecting that at the end (right before the RETURN statement).

  let searchPredicates = "";
  if (searchVals?.length) {
    searchPredicates = buildCypherPredicatesFromSearchVals({
      searchVals,
      fieldsToSearch: FIELDS_TO_SEARCH,
    });
    if (addlOncotreeCodes.length) {
      searchPredicates += ` OR tempNode.oncotreeCode =~ '^(${addlOncotreeCodes.join(
        "|"
      )})'`;
    }
  }

  // Filters for WES samples on the Samples page
  const genePanelContext = buildCypherPredicateFromContext({
    contexts,
    contextField: "genePanel",
    predicateField: "latestSm.genePanel",
  });
  const baitSetContext = buildCypherPredicateFromContext({
    contexts,
    contextField: "baitSet",
    predicateField: "latestSm.baitSet",
  });

  // Filter for the current request in the Request Samples view
  const requestContext = buildCypherPredicateFromContext({
    contexts,
    contextField: "igoRequestId",
    predicateField: "latestSm.igoRequestId",
  });

  // Filter for the current patient in the Patient Samples view
  const patientContext = buildCypherPredicateFromContext({
    contexts,
    contextField: "patientId",
    predicateField: "pa.value",
  });

  // Filter for the current cohort in the Cohort Samples view
  const cohortContext = buildCypherPredicateFromContext({
    contexts,
    contextField: "cohortId",
    predicateField: "c.cohortId",
  });

  // Column filters in the Samples Metadata view
  const importDateColFilter = buildCypherPredicateFromDateColFilter({
    columnFilters,
    colFilterField: "importDate",
    dateVar: "latestSm.importDate",
  });

  // Column filters in the Cohort Samples view
  const billedColFilter = buildCypherPredicateFromBooleanColFilter({
    columnFilters,
    colFilterField: "billed",
    booleanVar: "t.billed",
    noIncludesFalseAndNull: true,
  });
  const initialPipelineRunDateColFilter = buildCypherPredicateFromDateColFilter(
    {
      columnFilters,
      colFilterField: "initialPipelineRunDate",
      dateVar: "t.initialPipelineRunDate",
    }
  );
  const embargoDateColFilter = buildCypherPredicateFromDateColFilter({
    columnFilters,
    colFilterField: "embargoDate",
    dateVar: "t.embargoDate",
  });
  const cohortDateColFilters = [
    initialPipelineRunDateColFilter,
    embargoDateColFilter,
  ]
    .filter(Boolean)
    .map((filter) => `(${filter})`)
    .join(" AND ");
  const bamCompleteDateColFilter = buildCypherPredicateFromDateColFilter({
    columnFilters,
    colFilterField: "bamCompleteDate",
    dateVar: "latestBC.date",
    safelyHandleDateString: true,
  });
  const mafCompleteDateColFilter = buildCypherPredicateFromDateColFilter({
    columnFilters,
    colFilterField: "mafCompleteDate",
    dateVar: "latestMC.date",
    safelyHandleDateString: true,
  });
  const qcCompleteDateColFilter = buildCypherPredicateFromDateColFilter({
    columnFilters,
    colFilterField: "qcCompleteDate",
    dateVar: "latestQC.date",
    safelyHandleDateString: true,
  });

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
    ${genePanelContext && `WHERE ${genePanelContext}`}
    ${baitSetContext && `OR ${baitSetContext}`}

    ${requestContext && `WHERE ${requestContext}`}

    // Get SampleMetadata's Status
    OPTIONAL MATCH (latestSm)-[:HAS_STATUS]->(st:Status)
    WITH
      s,
      latestSm,
      historicalCmoSampleNames,
      st AS latestSt
    ${importDateColFilter && `WHERE ${importDateColFilter}`}

    // Filters for Patient Samples view, if applicable
    ${
      patientContext ? "" : "OPTIONAL "
    }MATCH (s)<-[:HAS_SAMPLE]-(p:Patient)<-[:IS_ALIAS]-(pa:PatientAlias)
    ${patientContext && `WHERE ${patientContext}`}
    WITH
      s,
      latestSm,
      historicalCmoSampleNames,
      latestSt,
      head([pa IN collect(pa) WHERE pa.namespace = 'dmpId' | pa.value]) AS dmpPatientAlias

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
      historicalCmoSampleNames,
      latestSt,
      dmpPatientAlias,
      t
    ${billedColFilter && `WHERE ${billedColFilter}`}
    ${cohortDateColFilters && `WHERE ${cohortDateColFilters}`}

    // Get the most recent Tempo events
    WITH
      s,
      latestSm,
      historicalCmoSampleNames,
      latestSt,
      dmpPatientAlias,
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
      dmpPatientAlias,
      t,
      latestBC[0] AS latestBC,
      latestMC[0] AS latestMC,
      latestQC[0] AS latestQC,
      apoc.convert.fromJsonMap(latestSm.cmoSampleIdFields) AS cmoSampleIdFields

      ${bamCompleteDateColFilter && `WHERE ${bamCompleteDateColFilter}`}
      ${mafCompleteDateColFilter && `WHERE ${mafCompleteDateColFilter}`}
      ${qcCompleteDateColFilter && `WHERE ${qcCompleteDateColFilter}`}

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
        cfDNA2dBarcode: latestSm.cfDNA2dBarcode,
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

        dbGapStudy: d.dbGapStudy,

        dmpPatientAlias: dmpPatientAlias
      }) AS tempNode

    ${searchPredicates && `WHERE ${searchPredicates}`}
  `;

  return samplesQueryBody;
}

function buildCypherPredicateFromContext({
  contexts,
  contextField,
  predicateField,
}: {
  contexts: InputMaybe<InputMaybe<DashboardRecordContext>[]> | undefined;
  contextField: DashboardRecordContext["fieldName"];
  /** Left-hand side of the Cypher predicate (e.g. latestSm.baitSet) */
  predicateField: string;
}): string {
  const contextObj = contexts?.find((ctx) => ctx?.fieldName === contextField);
  if (!contextObj || !contextObj.values || contextObj.values.length === 0)
    return "";
  if (contextObj.values.length > 1) {
    return `${predicateField} =~ '(?i).*(${contextObj.values.join("|")}).*'`;
  } else {
    return `${predicateField} = '${contextObj.values[0]}'`;
  }
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

    ORDER BY ${getCypherCustomOrderBy(sort)}
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
        const valWithoutQuotes = isQuotedString(val) ? val.slice(1, -1) : val;
        if (
          name?.toLowerCase().includes(valWithoutQuotes.toLowerCase()) ||
          mainType?.toLowerCase().includes(valWithoutQuotes.toLowerCase())
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
