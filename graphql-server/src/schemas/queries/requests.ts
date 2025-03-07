import {
  DashboardRequest,
  QueryDashboardRequestsArgs,
} from "../../generated/graphql";
import { neo4jDriver } from "../../utils/servers";
import {
  buildFinalCypherFilter,
  getNeo4jCustomSort,
  buildCypherDateFilter,
  buildCypherBooleanFilter,
} from "../custom";

export function buildRequestsQueryBody({
  searchVals,
  filters,
}: {
  searchVals: QueryDashboardRequestsArgs["searchVals"];
  filters?: QueryDashboardRequestsArgs["filters"];
}) {
  const queryFilters = [];

  if (searchVals?.length) {
    const fieldsToSearch = [
      "resultz.igoRequestId",
      "resultz.igoProjectId",
      "resultz.importDate",
      "resultz.projectManagerName",
      "resultz.investigatorName",
      "resultz.investigatorEmail",
      "resultz.piEmail",
      "resultz.dataAnalystName",
      "resultz.dataAnalystEmail",
      "resultz.genePanel",
      "resultz.labHeadName",
      "resultz.labHeadEmail",
      "resultz.qcAccessEmails",
      "resultz.dataAccessEmails",
      "resultz.bicAnalysis",
      "resultz.isCmoRequest",
      "resultz.otherContactEmails",
    ];
    const searchFilters = fieldsToSearch
      .map((field) => `${field} =~ '(?i).*(${searchVals.join("|")}).*'`)
      .join(" OR ");
    queryFilters.push(searchFilters);
  }

  if (filters) {
    const importDateFilterObj = filters?.find(
      (filter) => filter.field === "importDate"
    );
    if (importDateFilterObj) {
      const importDateFilter = buildCypherDateFilter({
        dateVar: "importDate",
        filter: JSON.parse(importDateFilterObj.filter),
      });
      queryFilters.push(importDateFilter);
    }
    const bicAnalysisFilterObj = filters?.find(
      (filter) => filter.field === "bicAnalysis"
    );
    if (bicAnalysisFilterObj) {
      const bicAnalysisFilter = buildCypherBooleanFilter({
        booleanVar: "bicAnalysis",
        filter: JSON.parse(bicAnalysisFilterObj.filter),
        noIncludesFalseAndNull: true,
      });
      queryFilters.push(bicAnalysisFilter);
    }
    const cmoRequestFilterObj = filters?.find(
      (filter) => filter.field === "isCmoRequest"
    );
    if (cmoRequestFilterObj) {
      const cmoRequestFilter = buildCypherBooleanFilter({
        booleanVar: "isCmoRequest",
        filter: JSON.parse(cmoRequestFilterObj.filter),
        noIncludesFalseAndNull: true,
      });
      queryFilters.push(cmoRequestFilter);
    }
  }

  const filtersAsCypher = buildFinalCypherFilter({ queryFilters });

  const requestsQueryBody = `
    MATCH (r:Request)-[:HAS_METADATA]->(rm:RequestMetadata)

    // Get the latest SampleMetadata of each Sample
    OPTIONAL MATCH (r)-[:HAS_SAMPLE]->(s:Sample)-[:HAS_METADATA]->(sm:SampleMetadata)
    WITH
      r,
      count(DISTINCT s.smileSampleId) AS totalSampleCount,
      collect(distinct sm.importDate) + collect(distinct rm.importDate) as allImportDates
    WITH
      r,
      totalSampleCount,
      apoc.coll.max(allImportDates) as latestImportDate
    WITH
      ({igoRequestId: r.igoRequestId, 
        igoProjectId: r.igoProjectId,
        importDate: latestImportDate,
        totalSampleCount: totalSampleCount,
        projectManagerName: r.projectManagerName,
        investigatorName: r.investigatorName,
        investigatorEmail: r.investigatorEmail,
        piEmail: r.piEmail,
        dataAnalystName: r.dataAnalystName,
        dataAnalystEmail: r.dataAnalystEmail,
        genePanel: r.genePanel,
        labHeadName: r.labHeadName,
        labHeadEmail: r.labHeadEmail,
        qcAccessEmails: r.qcAccessEmails,
        dataAccessEmails: r.dataAccessEmails,
        bicAnalysis: r.bicAnalysis,
        isCmoRequest: r.isCmoRequest,
        otherContactEmails: r.otherContactEmails}) as tempNode
    WITH tempNode
    UNWIND tempNode AS unsortedTempNode
    WITH COUNT(unsortedTempNode) as total, COLLECT(unsortedTempNode) as results
    UNWIND results as resultz
    WITH resultz, total

    ${filtersAsCypher}
  `;

  return requestsQueryBody;
}
export async function queryDashboardRequests({
  queryBody,
  sort,
  limit,
  offset,
}: {
  queryBody: string;
  sort: QueryDashboardRequestsArgs["sort"];
  limit: QueryDashboardRequestsArgs["limit"];
  offset: QueryDashboardRequestsArgs["offset"];
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
    console.error("Error with queryDashboardRequests:", error);
  }
}
