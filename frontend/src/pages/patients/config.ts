import { DashboardPatient } from "../../generated/graphql";
import { ColDef } from "ag-grid-community";
import { DownloadOption } from "../../shared/components/DownloadButton";

interface BuildDownloadOptionsParams {
  getRenderedData: () => Promise<Array<DashboardPatient>>;
  columnDefs: Array<ColDef<DashboardPatient>>;
}

export function buildDownloadOptions({
  getRenderedData,
  columnDefs,
}: BuildDownloadOptionsParams): Array<DownloadOption> {
  return [
    {
      label: "Download as TSV",
      columnDefs: columnDefs,
      dataGetter: getRenderedData,
    },
  ];
}

export const phiModeSwitchTooltipContent =
  "Turn on this switch to return patients' MRNs and Anchor Sequencing Dates" +
  " in the results. The table will display MRNs and sequencing dates only" +
  " after you (1) have logged in and (2) just performed a search with" +
  " specific patient IDs. Turning on this switch for the first time will" +
  " prompt you to log in if you have not already.";
