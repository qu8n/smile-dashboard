import { ColDef } from "ag-grid-community";

export const POLL_INTERVAL = 5000; // 5s
export const CACHE_BLOCK_SIZE = 500; // number of rows to fetch at a time

/**
 * Placeholder values for the variable parts of route paths.
 * When a page uses one of these params, they're captured from the URL in these
 * variables.
 * For example, in the route `/requests/<igoRequestId>` like `/requests/12345`,
 * the component can access the `12345` value as follows:
 * ```tsx
 * const { igoRequestId } = useParams();
 * ```
 */
export const ROUTE_PARAMS = {
  requests: "igoRequestId",
  patients: "patientId",
  cohorts: "cohortId",
} as const;

export function getPhiColDefProps({
  widthSize,
}: {
  widthSize: number;
}): ColDef {
  return {
    width: widthSize, // prevent truncation when columns are unhidden
    hide: true,
    cellStyle: { color: "crimson" },
    sortable: false,
  };
}

export const multiLineColDef: ColDef = {
  wrapText: true,
  autoHeight: true,
  cellStyle: {
    wordBreak: "break-word",
    lineHeight: "1.25",
    padding: "6px 18px",
  },
};
