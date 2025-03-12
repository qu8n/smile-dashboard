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
      "tempNode.primaryId",
      "tempNode.cmoSampleName",
      "tempNode.importDate",
      "tempNode.cmoPatientId",
      "tempNode.investigatorSampleId",
      "tempNode.sampleType",
      "tempNode.species",
      "tempNode.genePanel",
      "tempNode.baitSet",
      "tempNode.preservation",
      "tempNode.tumorOrNormal",
      "tempNode.sampleClass",
      "tempNode.oncotreeCode",
      "tempNode.collectionYear",
      "tempNode.sampleOrigin",
      "tempNode.tissueLocation",
      "tempNode.sex",
      "tempNode.recipe",
      "tempNode.altId",
      "tempNode.costCenter",
      "tempNode.billedBy",
      "tempNode.custodianInformation",
      "tempNode.accessLevel",
      "tempNode.bamCompleteDate",
      "tempNode.bamCompleteStatus",
      "tempNode.mafCompleteDate",
      "tempNode.mafCompleteNormalPrimaryId",
      "tempNode.mafCompleteStatus",
      "tempNode.qcCompleteDate",
      "tempNode.qcCompleteResult",
      "tempNode.qcCompleteReason",
      "tempNode.qcCompleteStatus",
      "tempNode.historicalCmoSampleNames",
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
    MATCH (s:Sample)
    WITH
      s,
      COLLECT {
      	MATCH (s)-[:HAS_METADATA]->(sm:SampleMetadata)
      	RETURN sm ORDER BY sm.importDate DESC LIMIT 1
      } as latestSm
    
    WITH
      s,
      latestSm[0] as latestSm,
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
      } as latestBC,
      COLLECT {
        OPTIONAL MATCH (t)-[:HAS_EVENT]->(mc:MafComplete)
        RETURN mc ORDER BY mc.date DESC LIMIT 1
      } as latestMC,
      COLLECT {
        OPTIONAL MATCH (t)-[:HAS_EVENT]->(qc:QcComplete)
        RETURN qc ORDER BY qc.date DESC LIMIT 1
      } as latestQC

    WITH
      s,
      latestSm,
      historicalCmoSampleNames,
      latestSt,
      t,
      latestBC[0] as latestBC,
      latestMC[0] as latestMC,
      latestQC[0] as latestQC

      ${bamCompleteDateFilter && `WHERE ${bamCompleteDateFilter}`}
      ${mafCompleteDateFilter && `WHERE ${mafCompleteDateFilter}`}
      ${qcCompleteDateFilter && `WHERE ${qcCompleteDateFilter}`}      
      
    WITH
      ({
        smileSampleId: s.smileSampleId, 
        revisable: s.revisable,
        
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
        recipe: apoc.convert.fromJsonMap(latestSm.cmoSampleIdFields).recipe,
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
        qcCompleteStatus: latestQC.status 
        }) AS tempNode

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
    UNWIND tempNode AS unsortedTempNode
    WITH COUNT(unsortedTempNode) AS total, COLLECT(unsortedTempNode) AS results
    UNWIND results AS resultz
    WITH resultz, total

    RETURN
      resultz{.*, _total: total}

    ORDER BY ${getNeo4jCustomSort(sort)}
    SKIP ${offset}
    LIMIT ${limit}
  `;

  const session = neo4jDriver.session();
  try {
    const result = await session.run(cypherQuery);

    return result.records.map((record) => {
      const recordObject = record.toObject().resultz;
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
