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
      "tempNode.cohortId",
      "tempNode.billed",
      "tempNode.initialCohortDeliveryDate",
      "tempNode.endUsers",
      "tempNode.pmUsers",
      "tempNode.projectTitle",
      "tempNode.projectSubtitle",
      "tempNode.status",
      "tempNode.type",
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
    MATCH (c:Cohort)-[:HAS_COHORT_COMPLETE]->(cc: CohortComplete)
    OPTIONAL MATCH (c)-[:HAS_COHORT_SAMPLE]->(s:Sample)-[:HAS_TEMPO]->(t:Tempo)

    // Aggregate Tempo and CohortComplete data
    WITH
        c,
        s,
		apoc.coll.min(collect(cc.date)) AS initialCohortDeliveryDate,
        apoc.coll.max(collect(cc.date)) AS latestCohortDeliveryDate,
        count(t) AS tempoCount,
        count(CASE WHEN t.billed = true THEN 1 END) AS billedCount

    // Aggregate Sample data and get the latest CohortComplete
    WITH
    	c,
    	initialCohortDeliveryDate,
    	latestCohortDeliveryDate,
        collect(s.smileSampleId) AS sampleIdsByCohort,
        size(collect(s)) AS totalSampleCount,
        tempoCount,
        billedCount
        
    // Calculate values for the "Billed" column
    WITH
    	c,
    	initialCohortDeliveryDate,
    	latestCohortDeliveryDate,
        sampleIdsByCohort,
        totalSampleCount,
        CASE totalSampleCount
            WHEN 0 THEN "Yes"
            ELSE
                CASE (billedCount = tempoCount)
                    WHEN true THEN "Yes"
                    ELSE "No"
                END
        END AS billed
	
    WITH
        c,
        initialCohortDeliveryDate,
    	latestCohortDeliveryDate,
        sampleIdsByCohort,
        totalSampleCount,
        billed

    WITH ({
    	cohortId: c.cohortId,
    	sampleIdsByCohort: sampleIdsByCohort,
    	totalSampleCount: totalSampleCount,
    	billed: billed,
    	initialCohortDeliveryDate: initialCohortDeliveryDate,
    	latestCohortDeliveryDate: latestCohortDeliveryDate
    }) as tempNode, 
    COLLECT {
    	MATCH (c)-[:HAS_COHORT_COMPLETE]->(cc: CohortComplete)
    	RETURN cc ORDER BY cc.date DESC LIMIT 1
    } as latestCC
    
    WITH 
    	tempNode,
    	latestCC[0] as latestCC
    
    WITH
      tempNode{.*, endUsers: latestCC.endUsers, pmUsers: latestCC.pmUsers, projectTitle: latestCC.projectTitle, projectSubtitle: latestCC.projectSubtitle, status: latestCC.status, type: latestCC.type}

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
      return record.toObject().resultz;
    });
  } catch (error) {
    console.error("Error with queryDashboardCohorts:", error);
  }
}
