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
      "smilePatientId",
      "cmoPatientId",
      "dmpPatientId",
      "cmoSampleIds",
      "consentPartA",
      "consentPartC",
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

    // Get the latest SampleMetadata of each Sample
    OPTIONAL MATCH (p)-[:HAS_SAMPLE]->(s:Sample)-[:HAS_METADATA]->(sm:SampleMetadata)
    WITH
      p,
      cmoPa,
      dmpPa,
      s,
      collect(sm) AS allSampleMetadata,
      max(sm.importDate) AS latestImportDate
    WITH
      p,
      cmoPa,
      dmpPa,
      s,
      latestImportDate,
      [sm IN allSampleMetadata WHERE sm.importDate = latestImportDate][0] AS latestSm

    // Get the CMO Sample IDs and additionalProperties JSONs from SampleMetadata
    WITH
      p,
      cmoPa,
      dmpPa,
      s,
      latestImportDate,
      CASE
        WHEN latestSm.cmoSampleName IS NOT NULL THEN latestSm.cmoSampleName
            ELSE latestSm.primaryId
        END AS cmoSampleId,
      apoc.convert.fromJsonMap(latestSm.additionalProperties) AS latestSmAddlPropsJson

    // Implode/aggregate the different arrays
    WITH
      p,
      cmoPa,
      dmpPa,
      max(latestImportDate) AS latestImportDate,
      collect(s) AS samples,
      collect(cmoSampleId) AS cmoSampleIds,
      collect(latestSmAddlPropsJson.\`consent-parta\`) AS consentPartAs,
      collect(latestSmAddlPropsJson.\`consent-partc\`) AS consentPartCs

    WITH
      p.smilePatientId AS smilePatientId,
      cmoPa.value AS cmoPatientId,
      dmpPa.value AS dmpPatientId,
      latestImportDate,
      size(samples) AS totalSampleCount,
      apoc.text.join([id IN cmoSampleIds WHERE id <> ''], ', ') AS cmoSampleIds,
      consentPartAs[0] AS consentPartA,
      consentPartCs[0] AS consentPartC

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
      smilePatientId,
      cmoPatientId,
      dmpPatientId,
      totalSampleCount,
      cmoSampleIds,
      consentPartA,
      consentPartC
    ORDER BY ${getNeo4jCustomSort(sort)}
    SKIP ${offset}
    LIMIT ${limit}
  `;

  const session = neo4jDriver.session();
  try {
    const result = await session.run(cypherQuery);
    return result.records.map((record) => record.toObject());
  } catch (error) {
    console.error("Error with queryDashboardPatients:", error);
  }
}
export async function queryDashboardPatientCount({
  queryBody,
}: {
  queryBody: string;
}) {
  const cypherQuery = `
    ${queryBody}
    RETURN count(smilePatientId) AS totalCount
  `;

  const session = neo4jDriver.session();
  try {
    const result = await session.run(cypherQuery);
    return result.records[0].toObject();
  } catch (error) {
    console.error("Error with queryDashboardPatientCount:", error);
  }
}
