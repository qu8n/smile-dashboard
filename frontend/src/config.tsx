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

export const PHI_WARNING =
  "The information contained in this transmission from Memorial Sloan-Kettering" +
  " Cancer Center is privileged, confidential and protected health" +
  " information (PHI) and it is protected from disclosure under applicable" +
  " law, including the Health Insurance Portability and Accountability Act" +
  " of 1996, as amended (HIPAA). This transmission is intended for the sole" +
  " use of approved individuals with permission and training to access this" +
  " information and PHI. You are notified that your access to this" +
  " transmission is logged. If you have received this transmission in" +
  " error, please immediately delete this information and any attachments" +
  " from any computer.";

export const POLLING_PAUSE_AFTER_UPDATE = 12000; // 12s

export const INVALID_COST_CENTER_WARNING =
  "Please update your Cost Center/Fund Number input as #####/##### " +
  "(5 digits, a forward slash, then 5 digits). For example: 12345/12345.";
