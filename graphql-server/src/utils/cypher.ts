import { partition } from "lodash";
import {
  AgGridSortDirection,
  DashboardRecordColumnFilter,
  DashboardRecordSort,
  InputMaybe,
  QueryDashboardSamplesArgs,
} from "../generated/graphql";

export function isQuotedString(value: string) {
  return (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  );
}

function getParsedColFilter(
  colFilters: InputMaybe<DashboardRecordColumnFilter[]> | undefined,
  colFilterField: DashboardRecordColumnFilter["field"]
) {
  const colFilterObj = colFilters?.find(
    (filter) => filter.field === colFilterField
  );
  return colFilterObj ? JSON.parse(colFilterObj.filter) : null;
}

export function buildCypherPredicatesFromSearchVals({
  searchVals,
  fieldsToSearch,
}: {
  searchVals: QueryDashboardSamplesArgs["searchVals"];
  fieldsToSearch: string[];
}) {
  if (!searchVals || searchVals.length === 0) return "";

  // Split search values into two arrays: quoted and unquoted values
  const [quotedVals, unquotedVals] = partition(searchVals, (val) =>
    isQuotedString(val)
  );

  return fieldsToSearch
    .map((field) => {
      const conditions = [];
      // Generate fuzzy match predicate for unquoted values
      if (unquotedVals.length) {
        conditions.push(
          `tempNode.${field} =~ '(?i).*(${unquotedVals.join("|")}).*'`
        );
      }
      // Generate exact match predicate for quoted values
      if (quotedVals.length) {
        const quotedValsList = quotedVals
          .map((val) => `"${val.slice(1, -1)}"`)
          .join(", ");
        conditions.push(`tempNode.${field} IN [${quotedValsList}]`);
      }
      return conditions.join(" OR ");
    })
    .filter(Boolean)
    .join(" OR ");
}

export function buildCypherPredicateFromDateColFilter({
  columnFilters,
  colFilterField,
  dateVar,
  safelyHandleDateString = false,
}: {
  columnFilters: InputMaybe<DashboardRecordColumnFilter[]> | undefined;
  colFilterField: DashboardRecordColumnFilter["field"];
  /** The date variable in the current Cypher context e.g. `bc.date` from `MATCH (bc:BamComplete) RETURN bc.date` */
  dateVar: string;
  /**
   * Set to True when working with date values that are unpredictable/non-standardized like Tempo event dates,
   * which can come in date value formats such as "yyyy-MM-dd", "yyyy-MM-dd HH:mm", "yyyy-MM-dd HH:mm:ss.SSSSSS",
   * empty strings, or "FAILED".
   */
  safelyHandleDateString?: boolean;
}) {
  const colFilter = getParsedColFilter(columnFilters, colFilterField);
  if (!colFilter) return "";

  const formattedDateString = safelyHandleDateString
    ? `
    CASE
      WHEN size(${dateVar}) >= 10 THEN left(${dateVar}, 10) // trims date formats more granular than yyyy-MM-dd
      ELSE '1900-01-01' // excludes record from the result
    END`
    : dateVar;

  return `
      apoc.date.parse(${formattedDateString}, 'ms', 'yyyy-MM-dd')
        >= apoc.date.parse('${colFilter.dateFrom}', 'ms', 'yyyy-MM-dd HH:mm:ss') // AG Grid's provided date format
      AND apoc.date.parse(${formattedDateString}, 'ms', 'yyyy-MM-dd')
        <= apoc.date.parse('${colFilter.dateTo}', 'ms', 'yyyy-MM-dd HH:mm:ss')
    `;
}

export function buildCypherPredicateFromBooleanColFilter({
  columnFilters,
  colFilterField,
  booleanVar,
  noIncludesFalseAndNull = false,
  trueVal = true,
  falseVal = false,
}: {
  columnFilters: InputMaybe<DashboardRecordColumnFilter[]> | undefined;
  colFilterField: DashboardRecordColumnFilter["field"];
  /** The boolean variable in the current Cypher context e.g. `t.billed` from `MATCH (t:Tempo) RETURN t.billed` */
  booleanVar: string;
  /** Set to True for user's filter selection of "No" to include both false and null values */
  noIncludesFalseAndNull?: boolean;
  /** The true value that appears in the database for a given field (e.g. "Yes", true) */
  trueVal?: string | boolean;
  /** The false value that appears in the database for a given field (e.g. "No", false) */
  falseVal?: string | boolean;
}) {
  const colFilter = getParsedColFilter(columnFilters, colFilterField);
  if (!colFilter) return "";

  const formattedTrueVal =
    typeof trueVal === "string" ? `'${trueVal}'` : trueVal;
  const formattedFalseVal =
    typeof falseVal === "string" ? `'${falseVal}'` : falseVal;

  const colFilterValues = colFilter.values;
  if (colFilterValues?.length > 0) {
    const activeColFilters = [];
    for (const value of colFilterValues) {
      if (value === "Yes") {
        activeColFilters.push(`${booleanVar} = ${formattedTrueVal}`);
      } else if (value === "No") {
        if (!noIncludesFalseAndNull) {
          activeColFilters.push(`${booleanVar} = ${formattedFalseVal}`);
        } else {
          activeColFilters.push(
            `${booleanVar} = ${formattedFalseVal} OR ${booleanVar} IS NULL`
          );
        }
      } else if (value === null) {
        activeColFilters.push(`${booleanVar} IS NULL`);
      }
    }
    return activeColFilters.join(" OR ");
  } else {
    return `${booleanVar} <> ${formattedTrueVal} AND ${booleanVar} <> ${formattedFalseVal} AND ${booleanVar} IS NOT NULL`;
  }
}

export function buildCypherWhereClause(queryPredicates: string[]) {
  const combinedPredicates = queryPredicates
    .filter(Boolean)
    .map((predicate) => `(${predicate})`)
    .join(" AND ");

  return combinedPredicates ? "WHERE " + combinedPredicates : "";
}

/**
 * Adjusts sorting behavior to display string values first when used with Cypher's `ORDER BY` clause:
 * - For DESC, moves nulls to the end instead of the beginning (overriding Cypher's default).
 * - For ASC, moves empty strings to the end instead of the beginning (overriding Cypher's default).
 */
export function getCypherCustomOrderBy(sort: DashboardRecordSort) {
  return sort.sort === AgGridSortDirection.Desc
    ? `COALESCE(resultz.${sort.colId}, '') DESC`
    : `resultz.${sort.colId}='' ASC, resultz.${sort.colId} ASC`;
}
