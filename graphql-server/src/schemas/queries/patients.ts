import {
  DashboardPatient,
  QueryDashboardPatientsArgs,
} from "../../generated/graphql";
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
      "smilePatientId",
      "cmoPatientId",
      "dmpPatientId",
      "cmoSampleIds",
    ];
    const searchFilters = fieldsToSearch
      .map(
        (field) => `tempNode.${field} =~ '(?i).*(${searchVals.join("|")}).*'`
      )
      .join(" OR ");
    queryFilters.push(searchFilters);
  }

  if (filters) {
    const consentPartAFilterObj = filters?.find(
      (filter) => filter.field === "consentPartA"
    );
    if (consentPartAFilterObj) {
      const consentPartAFilter = buildCypherBooleanFilter({
        booleanVar: "tempNode.consentPartA",
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
        booleanVar: "tempNode.consentPartC",
        filter: JSON.parse(consentPartCFilterObj.filter),
        trueVal: "YES",
        falseVal: "NO",
      });
      queryFilters.push(consentPartCFilter);
    }

    const inDbGapFilterObj = filters?.find(
      (filter) => filter.field === "inDbGap"
    );
    if (inDbGapFilterObj) {
      const inDbGapFilter = buildCypherBooleanFilter({
        booleanVar: "tempNode.inDbGap",
        filter: JSON.parse(inDbGapFilterObj.filter),
        trueVal: true,
        falseVal: false,
      });
      queryFilters.push(inDbGapFilter);
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
}): Promise<DashboardPatient[]> {
  const cypherQuery = `
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
