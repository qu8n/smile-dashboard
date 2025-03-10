import { QueryDashboardPatientsArgs } from "../../generated/graphql";
import { neo4jDriver } from "../../utils/servers";
import {
  buildCypherBooleanFilter,
  buildFinalCypherFilter,
  getNeo4jCustomSort,
} from "../custom";

export function buildPatientsQueryBody({
  searchVals,
  filters,
}: {
  searchVals: QueryDashboardPatientsArgs["searchVals"];
  filters?: QueryDashboardPatientsArgs["filters"];
}) {
  const queryFilters = [];

  if (searchVals?.length) {
    const fieldsToSearch = [
      "resultz.smilePatientId",
      "resultz.cmoPatientId",
      "resultz.dmpPatientId",
      "resultz.cmoSampleIds",
      "resultz.consentPartA",
      "resultz.consentPartC",
    ];
    const searchFilters = fieldsToSearch
      .map((field) => `${field} =~ '(?i).*(${searchVals.join("|")}).*'`)
      .join(" OR ");
    queryFilters.push(searchFilters);
  }

  if (filters) {
    const consentPartAFilterObj = filters?.find(
      (filter) => filter.field === "consentPartA"
    );
    if (consentPartAFilterObj) {
      const consentPartAFilter = buildCypherBooleanFilter({
        booleanVar: "consentPartA",
        filter: JSON.parse(consentPartAFilterObj.filter),
        trueVal: "YES",
        falseVal: "NO",
      });
      queryFilters.push(consentPartAFilter);
    }

    const consentPartCFilterObj = filters?.find(
      (filter) => filter.field === "consentPartC"
    );
    if (consentPartCFilterObj) {
      const consentPartCFilter = buildCypherBooleanFilter({
        booleanVar: "consentPartC",
        filter: JSON.parse(consentPartCFilterObj.filter),
        trueVal: "YES",
        falseVal: "NO",
      });
      queryFilters.push(consentPartCFilter);
    }
  }

  const filtersAsCypher = buildFinalCypherFilter({ queryFilters });

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
        smList[0] AS latestSm
    WITH
      smilePatientId,
      cmoPatientId,
      dmpPatientId,
      totalSampleCount,
      latestSm
    WITH 
      ({
      smilePatientId: smilePatientId,
      cmoPatientId: cmoPatientId,
      dmpPatientId: dmpPatientId}) AS tempNode,
      COUNT(latestSm) AS totalSampleCount,
      apoc.text.join(COLLECT(latestSm.primaryId), ", ") AS cmoSampleIds,
      apoc.coll.max(COLLECT(latestSm.importDate)) AS importDate,
      collect(DISTINCT latestSm.consentPartA) AS consentPartA,
      collect(DISTINCT latestSm.consentPartC) AS consentPartC
    WITH 
      tempNode{.*, totalSampleCount: totalSampleCount, cmoSampleIds: cmoSampleIds, consentPartA: consentPartA[0], consentPartC: consentPartC[0], importDate: importDate} 
    UNWIND tempNode AS unsortedTempNode
    WITH COUNT(unsortedTempNode) AS total, COLLECT(unsortedTempNode) AS results
    UNWIND results AS resultz
    WITH resultz, total

    ${filtersAsCypher}
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
}) {
  const cypherQuery = `
    ${queryBody}
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
      return record.toObject().resultz;
    });
  } catch (error) {
    console.error("Error with queryDashboardPatients:", error);
  }
}
