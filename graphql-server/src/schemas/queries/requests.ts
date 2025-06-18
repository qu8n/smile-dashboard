import {
  DashboardRequest,
  QueryDashboardRequestsArgs,
} from "../../generated/graphql";
import { neo4jDriver } from "../../utils/servers";
import {
  buildCypherWhereClause,
  getCypherCustomOrderBy,
  buildCypherPredicateFromDateColFilter,
  buildCypherPredicateFromBooleanColFilter,
  buildCypherPredicatesFromSearchVals,
} from "../../utils/cypher";

const FIELDS_TO_SEARCH = [
  "igoRequestId",
  "igoProjectId",
  "importDate",
  "projectManagerName",
  "investigatorName",
  "investigatorEmail",
  "piEmail",
  "dataAnalystName",
  "dataAnalystEmail",
  "genePanel",
  "labHeadName",
  "labHeadEmail",
  "qcAccessEmails",
  "dataAccessEmails",
  "bicAnalysis",
  "isCmoRequest",
  "otherContactEmails",
];

export function buildRequestsQueryBody({
  searchVals,
  columnFilters,
}: {
  searchVals: QueryDashboardRequestsArgs["searchVals"];
  columnFilters?: QueryDashboardRequestsArgs["columnFilters"];
}) {
  const queryPredicates = [];

  const searchPredicates = buildCypherPredicatesFromSearchVals({
    searchVals,
    fieldsToSearch: FIELDS_TO_SEARCH,
  });
  if (searchPredicates) queryPredicates.push(searchPredicates);

  const importDateColFilter = buildCypherPredicateFromDateColFilter({
    columnFilters,
    colFilterField: "importDate",
    dateVar: "tempNode.importDate",
  });
  if (importDateColFilter) queryPredicates.push(importDateColFilter);

  const bicAnalysisColFilter = buildCypherPredicateFromBooleanColFilter({
    columnFilters,
    colFilterField: "bicAnalysis",
    booleanVar: "tempNode.bicAnalysis",
    noIncludesFalseAndNull: true,
  });
  if (bicAnalysisColFilter) queryPredicates.push(bicAnalysisColFilter);

  const cmoRequestColFilter = buildCypherPredicateFromBooleanColFilter({
    columnFilters,
    colFilterField: "isCmoRequest",
    booleanVar: "tempNode.isCmoRequest",
    noIncludesFalseAndNull: true,
  });
  if (cmoRequestColFilter) queryPredicates.push(cmoRequestColFilter);

  const cypherWhereClause = buildCypherWhereClause(queryPredicates);

  const requestsQueryBody = `
    MATCH (r:Request)

    WITH
      r,
      COLLECT {
        MATCH (r)-[:HAS_METADATA]->(rm:RequestMetadata)-[:HAS_STATUS]->(st:Status)
        RETURN { rm: rm, st: st } ORDER BY rm.importDate DESC LIMIT 1
      } AS latestRm

    OPTIONAL MATCH (r)-[:HAS_SAMPLE]->(s:Sample)-[:HAS_METADATA]->(sm:SampleMetadata)

    WITH
      r,
      latestRm[0].st AS latestStatus,
      COUNT(DISTINCT s.smileSampleId) AS totalSampleCount,
      apoc.coll.max(
        COLLECT(latestRm[0].rm.importDate) +
        COLLECT(DISTINCT sm.importDate)
      ) AS latestImportDate

    OPTIONAL MATCH (r)-[:HAS_SAMPLE]->(s:Sample)

    WITH
      r,
      latestStatus,
      totalSampleCount,
      latestImportDate,
      s,
      COLLECT {
        MATCH (s)-[:HAS_METADATA]->(sm:SampleMetadata)-[:HAS_STATUS]->(ss:Status)
        RETURN {primaryId: sm.primaryId, validationStatus: ss.validationStatus, validationReport: ss.validationReport}
        ORDER BY sm.importDate DESC LIMIT 1
      } as latestSampleData

    WITH
      r,
      latestStatus,
      totalSampleCount,
      latestImportDate,
      latestSampleData[0] as latestSampleData

    WITH
      r,
      latestStatus,
      totalSampleCount,
      latestImportDate,
      COLLECT(latestSampleData) as toleratedSampleErrors

    WITH
      ({igoRequestId: r.igoRequestId,
      igoProjectId: r.igoProjectId,
      validationReport: latestStatus.validationReport,
      validationStatus: latestStatus.validationStatus,
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
      otherContactEmails: r.otherContactEmails,
      toleratedSampleErrors: toleratedSampleErrors}) as tempNode
    WITH tempNode

    ${cypherWhereClause}
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
}): Promise<DashboardRequest[]> {
  const cypherQuery = `
    ${queryBody}
    WITH COUNT(DISTINCT tempNode) AS total, COLLECT(DISTINCT tempNode) AS results
    UNWIND results as resultz
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
    console.error("Error with queryDashboardRequests:", error);
    return [];
  } finally {
    await session.close();
  }
}
