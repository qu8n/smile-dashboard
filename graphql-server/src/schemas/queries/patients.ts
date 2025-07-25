import {
  DashboardPatient,
  PatientIdsTriplet,
  QueryDashboardPatientsArgs,
  AnchorSeqDateByPatientId,
} from "../../generated/graphql";
import { neo4jDriver } from "../../utils/servers";
import {
  buildCypherPredicateFromBooleanColFilter,
  buildCypherPredicatesFromSearchVals,
  buildCypherWhereClause,
  getCypherCustomOrderBy,
} from "../../utils/cypher";
import { queryDatabricks } from "../../utils/databricks";
import { props } from "../../utils/constants";

const FIELDS_TO_SEARCH = [
  "smilePatientId",
  "cmoPatientId",
  "dmpPatientId",
  "cmoSampleIds",
];

export function buildPatientsQueryBody({
  searchVals,
  columnFilters,
}: {
  searchVals: QueryDashboardPatientsArgs["searchVals"];
  columnFilters?: QueryDashboardPatientsArgs["columnFilters"];
}) {
  const queryPredicates = [];

  const searchPredicates = buildCypherPredicatesFromSearchVals({
    searchVals,
    fieldsToSearch: FIELDS_TO_SEARCH,
  });
  if (searchPredicates) queryPredicates.push(searchPredicates);

  const consentPartAColFilter = buildCypherPredicateFromBooleanColFilter({
    columnFilters,
    colFilterField: "consentPartA",
    booleanVar: "tempNode.consentPartA",
    trueVal: "YES",
    falseVal: "NO",
  });
  if (consentPartAColFilter) queryPredicates.push(consentPartAColFilter);

  const consentPartCColFilter = buildCypherPredicateFromBooleanColFilter({
    columnFilters,
    colFilterField: "consentPartC",
    booleanVar: "tempNode.consentPartC",
    trueVal: "YES",
    falseVal: "NO",
  });
  if (consentPartCColFilter) queryPredicates.push(consentPartCColFilter);

  const inDbGapColFilter = buildCypherPredicateFromBooleanColFilter({
    columnFilters,
    colFilterField: "inDbGap",
    booleanVar: "tempNode.inDbGap",
    trueVal: true,
    falseVal: false,
  });
  if (inDbGapColFilter) queryPredicates.push(inDbGapColFilter);

  const cypherWhereClause = buildCypherWhereClause(queryPredicates);

  const patientsQueryBody = `
    MATCH (p:Patient)

    // Get patient aliases
    OPTIONAL MATCH (p)<-[:IS_ALIAS]-(cmoPa:PatientAlias {namespace: 'cmoId'})
    OPTIONAL MATCH (p)<-[:IS_ALIAS]-(dmpPa:PatientAlias {namespace: 'dmpId'})

    OPTIONAL MATCH (p)-[:HAS_SAMPLE]->(s:Sample)

    WITH
      p,
      cmoPa,
      dmpPa,
      s,
      EXISTS {
        MATCH (p)-[:HAS_SAMPLE]->(anyS:Sample)-[:HAS_DBGAP]->(d:DbGap)
        WHERE d.dbGapStudy IS NOT NULL AND d.dbGapStudy <> ""
      } AS inDbGap

    WITH
      p,
      cmoPa,
      dmpPa,
      s,
      inDbGap,
      COLLECT {
      	MATCH (s)-[:HAS_METADATA]->(sm:SampleMetadata)
        RETURN ({
            primaryId: sm.primaryId,
            importDate: sm.importDate,
            consentPartA: apoc.convert.getJsonProperty(sm, "additionalProperties", "$.consent-parta"),
            consentPartC: apoc.convert.getJsonProperty(sm, "additionalProperties", "$.consent-partc")
          })
          AS smResult ORDER BY sm.importDate DESC LIMIT 1
      } AS smList

    WITH
      p.smilePatientId AS smilePatientId,
      cmoPa.value AS cmoPatientId,
      dmpPa.value AS dmpPatientId,
      COUNT(s) AS totalSampleCount,
      smList[0] AS latestSm,
      inDbGap

    WITH
      smilePatientId,
      cmoPatientId,
      dmpPatientId,
      totalSampleCount,
      latestSm,
      inDbGap

    WITH
      ({
        smilePatientId: smilePatientId,
        cmoPatientId: cmoPatientId,
        dmpPatientId: dmpPatientId,
        inDbGap: inDbGap
      }) AS tempNode,
      COUNT(latestSm) AS totalSampleCount,
      apoc.text.join(COLLECT(latestSm.primaryId), ", ") AS cmoSampleIds,
      apoc.coll.max(COLLECT(latestSm.importDate)) AS importDate,
      collect(DISTINCT latestSm.consentPartA) AS consentPartA,
      collect(DISTINCT latestSm.consentPartC) AS consentPartC

    WITH
      tempNode{.*,
        totalSampleCount: totalSampleCount,
        cmoSampleIds: cmoSampleIds,
        consentPartA: consentPartA[0],
        consentPartC: consentPartC[0],
        importDate: importDate
      }

    ${cypherWhereClause}
  `;

  return patientsQueryBody;
}

export function buildPatientsQueryFinal({
  queryBody,
  sort,
  limit,
  offset,
}: {
  queryBody: string;
  sort: QueryDashboardPatientsArgs["sort"];
  limit: QueryDashboardPatientsArgs["limit"];
  offset: QueryDashboardPatientsArgs["offset"];
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

export async function queryDashboardPatients(
  patientsCypherQuery: string
): Promise<DashboardPatient[]> {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(patientsCypherQuery);
    return result.records.map((record) => {
      return record.toObject().resultz;
    });
  } catch (error) {
    console.error("Error with queryDashboardPatients:", error);
    return [];
  } finally {
    await session.close();
  }
}

export async function queryPatientIdsTriplets(searchVals: Array<string>) {
  const searchValsWithoutCDash = searchVals.map((searchVal) =>
    searchVal.startsWith("C-") ? searchVal.slice(2) : searchVal
  );
  const searchValList = searchValsWithoutCDash
    .map((searchVal) => `'${searchVal}'`)
    .join(",");
  const query = `
    SELECT
      CMO_PATIENT_ID,
      DMP_PATIENT_ID,
      MRN
    FROM
      ${props.databricks_phi_id_mapping_table}
    WHERE
      DMP_PATIENT_ID IN (${searchValList})
      OR MRN IN (${searchValList})
      OR CMO_PATIENT_ID IN (${searchValList})
  `;
  const patientIdsTriplets = await queryDatabricks<PatientIdsTriplet>(query);
  patientIdsTriplets.forEach((patientIdTriplet) => {
    patientIdTriplet.CMO_PATIENT_ID = `C-${patientIdTriplet.CMO_PATIENT_ID}`;
  });
  return patientIdsTriplets;
}

export async function queryAnchorSeqDatesByPatientId(
  mrnsAndDmpPatientIds: Array<string>
) {
  const mrnsAndDmpPatientIdsList = mrnsAndDmpPatientIds
    .map((dmpPatientId) => `'${dmpPatientId}'`)
    .join(",");
  const query = `
    SELECT
      MRN,
      DMP_PATIENT_ID,
      ANCHOR_SEQUENCING_DATE
    FROM
      ${props.databricks_seq_dates_by_patient_table}
    WHERE
      MRN IN (${mrnsAndDmpPatientIdsList})
      OR DMP_PATIENT_ID IN (${mrnsAndDmpPatientIdsList})
  `;
  return await queryDatabricks<AnchorSeqDateByPatientId>(query);
}

export function mapPhiToPatientsData({
  patientsData,
  patientIdsTriplets,
  anchorSeqDatesByPatientId,
}: {
  patientsData: DashboardPatient[];
  patientIdsTriplets: Array<PatientIdsTriplet>;
  anchorSeqDatesByPatientId: Array<AnchorSeqDateByPatientId>;
}): Array<DashboardPatient> {
  // Create maps for quick lookup of MRN by either CMO or DMP Patient ID
  const mrnByCmoPatientIdMap: Record<string, string> = {};
  const mrnByDmpPatientIdMap: Record<string, string> = {};
  patientIdsTriplets.forEach((triplet) => {
    if (triplet.MRN) {
      if (triplet.CMO_PATIENT_ID) {
        mrnByCmoPatientIdMap[triplet.CMO_PATIENT_ID] = triplet.MRN;
      }
      if (triplet.DMP_PATIENT_ID) {
        mrnByDmpPatientIdMap[triplet.DMP_PATIENT_ID] = triplet.MRN;
      }
    }
  });
  // Create a map for quick lookup of anchor sequencing date by MRN or DMP Patient ID
  const anchorSeqDateByMrnMap: Record<string, string> = {};
  const anchorSeqDateByDmpPatientIdMap: Record<string, string> = {};
  anchorSeqDatesByPatientId.forEach((record) => {
    if (record.ANCHOR_SEQUENCING_DATE) {
      if (record.MRN) {
        anchorSeqDateByMrnMap[record.MRN] = record.ANCHOR_SEQUENCING_DATE;
      }
      if (record.DMP_PATIENT_ID) {
        anchorSeqDateByDmpPatientIdMap[record.DMP_PATIENT_ID] =
          record.ANCHOR_SEQUENCING_DATE;
      }
    }
  });
  // Map MRN and anchor sequencing date to each patient in the patients data from Neo4j
  return patientsData.map((patient) => {
    const cmoPatientId = patient.cmoPatientId;
    const dmpPatientId = patient.dmpPatientId;
    const mrn = cmoPatientId
      ? mrnByCmoPatientIdMap[cmoPatientId]
      : dmpPatientId
      ? mrnByDmpPatientIdMap[dmpPatientId]
      : null;
    const anchorSequencingDate = mrn
      ? anchorSeqDateByMrnMap[mrn]
      : dmpPatientId
      ? anchorSeqDateByDmpPatientIdMap[dmpPatientId]
      : null;
    return {
      ...patient,
      mrn,
      anchorSequencingDate,
    };
  });
}

export async function queryAllAnchorSeqDateByPatientId() {
  const query = `
    SELECT
      MRN,
      DMP_PATIENT_ID,
      ANCHOR_SEQUENCING_DATE
    FROM
      ${props.databricks_seq_dates_by_patient_table}
  `;
  return await queryDatabricks<AnchorSeqDateByPatientId>(query);
}
