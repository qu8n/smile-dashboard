import {
  DashboardPatient,
  QueryDashboardPatientsArgs,
} from "../../generated/graphql";
import { neo4jDriver } from "../../utils/servers";
import {
  buildCypherPredicateFromBooleanColFilter,
  buildCypherPredicatesFromSearchVals,
  buildCypherWhereClause,
  getCypherCustomOrderBy,
} from "../../utils/cypher";

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
export async function queryDashboardPatients({
  queryBody,
  sort,
  limit,
  offset,
}: {
  queryBody: string;
  sort: QueryDashboardPatientsArgs["sort"];
  limit: QueryDashboardPatientsArgs["limit"];
  offset: QueryDashboardPatientsArgs["offset"];
}): Promise<DashboardPatient[]> {
  const cypherQuery = `
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

  const session = neo4jDriver.session();
  try {
    const result = await session.run(cypherQuery);
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
