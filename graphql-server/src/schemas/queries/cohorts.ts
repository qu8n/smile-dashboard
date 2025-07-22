import {
  DashboardCohort,
  QueryDashboardCohortsArgs,
  QueryDashboardPatientsArgs,
} from "../../generated/graphql";
import { neo4jDriver } from "../../utils/servers";
import {
  buildCypherPredicateFromBooleanColFilter,
  buildCypherPredicateFromDateColFilter,
  buildCypherPredicatesFromSearchVals,
  buildCypherWhereClause,
  getCypherCustomOrderBy,
} from "../../utils/cypher";

const FIELDS_TO_SEARCH = [
  "cohortId",
  "billed",
  "initialCohortDeliveryDate",
  "endUsers",
  "pmUsers",
  "projectTitle",
  "projectSubtitle",
  "status",
  "type",
  "searchableSampleIds", // hidden searchable field
];

export function buildCohortsQueryBody({
  searchVals,
  columnFilters,
}: {
  searchVals: QueryDashboardCohortsArgs["searchVals"];
  columnFilters?: QueryDashboardCohortsArgs["columnFilters"];
}) {
  const queryPredicates = [];

  const searchPredicates = buildCypherPredicatesFromSearchVals({
    searchVals,
    fieldsToSearch: FIELDS_TO_SEARCH,
  });
  if (searchPredicates) queryPredicates.push(searchPredicates);

  const billedColFilter = buildCypherPredicateFromBooleanColFilter({
    columnFilters,
    colFilterField: "billed",
    booleanVar: "tempNode.billed",
    trueVal: "Yes",
    falseVal: "No",
  });
  if (billedColFilter) queryPredicates.push(billedColFilter);

  const initialCohortDeliveryDateColFilter =
    buildCypherPredicateFromDateColFilter({
      columnFilters,
      colFilterField: "initialCohortDeliveryDate",
      dateVar: "tempNode.initialCohortDeliveryDate",
    });
  if (initialCohortDeliveryDateColFilter)
    queryPredicates.push(initialCohortDeliveryDateColFilter);

  const cypherWhereClause = buildCypherWhereClause(queryPredicates);

  const cohortsQueryBody = `
    MATCH (c:Cohort)-[:HAS_COHORT_COMPLETE]->(cc: CohortComplete)
    OPTIONAL MATCH (c)-[:HAS_COHORT_SAMPLE]->(s:Sample)-[:HAS_TEMPO]->(t:Tempo)

    // Aggregate Tempo and CohortComplete data
    WITH
        c,
        s,
        COLLECT {
          MATCH (s)-[:HAS_METADATA]->(sm:SampleMetadata)
          RETURN sm ORDER BY sm.importDate DESC LIMIT 1
        } AS latestSm,
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
      billedCount,
      apoc.coll.toSet(
        COLLECT(DISTINCT latestSm[0].cmoSampleName) +
        COLLECT(DISTINCT latestSm[0].primaryId)
      ) AS searchableSampleIds

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
      END AS billed,
      searchableSampleIds

    WITH
      c,
      initialCohortDeliveryDate,
      latestCohortDeliveryDate,
      sampleIdsByCohort,
      totalSampleCount,
      billed,
      searchableSampleIds

    WITH ({
      cohortId: c.cohortId,
      sampleIdsByCohort: sampleIdsByCohort,
      totalSampleCount: totalSampleCount,
      searchableSampleIds: apoc.text.join(searchableSampleIds, ","),
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
      tempNode{.*,
        endUsers: latestCC.endUsers,
        pmUsers: latestCC.pmUsers,
        projectTitle: latestCC.projectTitle,
        projectSubtitle: latestCC.projectSubtitle,
        status: latestCC.status,
        type: latestCC.type
      }

    ${cypherWhereClause}
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
}): Promise<DashboardCohort[]> {
  const cypherQuery = `
    ${queryBody}
    WITH COUNT(DISTINCT tempNode) AS total, size(apoc.coll.toSet(apoc.coll.flatten(collect(tempNode.sampleIdsByCohort)))) AS uniqueSampleCount, collect(DISTINCT tempNode) AS results
    WITH total, uniqueSampleCount, results
    UNWIND results AS resultz
    RETURN
      resultz{.*, _total:total, _uniqueSampleCount: uniqueSampleCount}

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
    console.error("Error with queryDashboardCohorts:", error);
    return [];
  } finally {
    await session.close();
  }
}
