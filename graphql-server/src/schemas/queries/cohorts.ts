import {
  QueryDashboardCohortsArgs,
  QueryDashboardPatientsArgs,
} from "../../generated/graphql";
import { neo4jDriver } from "../../utils/servers";
import {
  buildCypherBooleanFilter,
  buildCypherDateFilter,
  buildFinalCypherFilter,
  getNeo4jCustomSort,
} from "../custom";

export function buildCohortsQueryBody({
  searchVals,
  filters,
}: {
  searchVals: QueryDashboardCohortsArgs["searchVals"];
  filters?: QueryDashboardCohortsArgs["filters"];
}) {
  const queryFilters = [];

  if (searchVals?.length) {
    const fieldsToSearch = [
      "cohortId",
      "billed",
      "initialCohortDeliveryDate",
      "endUsers",
      "pmUsers",
      "projectTitle",
      "projectSubtitle",
      "status",
      "type",
    ];
    const searchFilters = fieldsToSearch
      .map((field) => `${field} =~ '(?i).*(${searchVals.join("|")}).*'`)
      .join(" OR ");
    queryFilters.push(searchFilters);
  }

  if (filters) {
    const billedFilterObj = filters?.find(
      (filter) => filter.field === "billed"
    );
    if (billedFilterObj) {
      const billedFilter = buildCypherBooleanFilter({
        booleanVar: "billed",
        filter: JSON.parse(billedFilterObj.filter),
        trueVal: "Yes",
        falseVal: "No",
      });
      queryFilters.push(billedFilter);
    }

    const initialCohortDeliveryDateFilterObj = filters?.find(
      (filter) => filter.field === "initialCohortDeliveryDate"
    );
    if (initialCohortDeliveryDateFilterObj) {
      const initialCohortDeliveryDateFilter = buildCypherDateFilter({
        dateVar: "initialCohortDeliveryDate",
        filter: JSON.parse(initialCohortDeliveryDateFilterObj.filter),
      });
      queryFilters.push(initialCohortDeliveryDateFilter);
    }
  }

  const filtersAsCypher = buildFinalCypherFilter({ queryFilters });

  const cohortsQueryBody = `
    MATCH (c:Cohort)-[:HAS_COHORT_COMPLETE]->(cc:CohortComplete)
    OPTIONAL MATCH (c)-[:HAS_COHORT_SAMPLE]->(s:Sample)-[:HAS_TEMPO]->(t:Tempo)

    // Aggregate Tempo and CohortComplete data
    WITH
        c.cohortId AS cohortId,
        s,
        count(t) AS tempoCount,
        count(CASE WHEN t.billed = true THEN 1 END) AS billedCount,
        collect(cc) AS cohortCompletes,
        max(cc.date) AS latestCohortDeliveryDate,
        min(cc.date) AS initialCohortDeliveryDate

    // Aggregate Sample data and get the latest CohortComplete
    WITH
        collect(s.smileSampleId) AS sampleIdsByCohort,
        cohortId,
        size(collect(s)) AS totalSampleCount,
        tempoCount,
        billedCount,
        initialCohortDeliveryDate,
        [cc IN cohortCompletes WHERE cc.date = latestCohortDeliveryDate][0] AS latestCC

    // Calculate values for the "Billed" column
    WITH
        sampleIdsByCohort,
        cohortId,
        totalSampleCount,
        CASE totalSampleCount
            WHEN 0 THEN "Yes"
            ELSE
                CASE (billedCount = tempoCount)
                    WHEN true THEN "Yes"
                    ELSE "No"
                END
        END AS billed,
        initialCohortDeliveryDate,
        latestCC

    WITH
        sampleIdsByCohort,
        cohortId,
        totalSampleCount,
        billed,
        initialCohortDeliveryDate,
        latestCC.endUsers AS endUsers,
        latestCC.pmUsers AS pmUsers,
        latestCC.projectTitle AS projectTitle,
        latestCC.projectSubtitle AS projectSubtitle,
        latestCC.status AS status,
        latestCC.type AS type

    ${filtersAsCypher}
  `;

  return cohortsQueryBody;
}
export async function queryDashboardCohorts({
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
      cohortId,
      totalSampleCount,
      billed,
      initialCohortDeliveryDate,
      endUsers,
      pmUsers,
      projectTitle,
      projectSubtitle,
      status,
      type

    ORDER BY ${getNeo4jCustomSort(sort)}
    SKIP ${offset}
    LIMIT ${limit}
  `;

  const session = neo4jDriver.session();
  try {
    const result = await session.run(cypherQuery);
    return result.records.map((record) => record.toObject());
  } catch (error) {
    console.error("Error with queryDashboardCohorts:", error);
  }
}
export async function queryDashboardCohortCount({
  queryBody,
}: {
  queryBody: string;
}) {
  const cypherQuery = `
    ${queryBody}
    RETURN
      count(cohortId) AS totalCount,
      size(apoc.coll.toSet(apoc.coll.flatten(collect(sampleIdsByCohort)))) AS uniqueSampleCount
  `;

  const session = neo4jDriver.session();
  try {
    const result = await session.run(cypherQuery);
    return result.records[0].toObject();
  } catch (error) {
    console.error("Error with queryDashboardCohortCount:", error);
  }
}
