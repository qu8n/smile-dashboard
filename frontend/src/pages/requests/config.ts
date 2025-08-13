import { DashboardRequest } from "../../generated/graphql";
import { ColDef } from "ag-grid-community";
import { DownloadOption } from "../../shared/components/DownloadButton";

interface BuildDownloadOptionsParams {
  /**
   * Callback function provided by the useDownload hook to fetch all data for the
   * current search value.
   */
  getRenderedData: () => Promise<Array<DashboardRequest>>;
  /**
   * The current column definitions state of the table.
   */
  requestColDefs: Array<ColDef<DashboardRequest>>;
}

export function buildDownloadOptions({
  getRenderedData,
  requestColDefs,
}: BuildDownloadOptionsParams): Array<DownloadOption> {
  return [
    {
      label: "Download as TSV",
      columnDefs: requestColDefs,
      dataGetter: getRenderedData,
    },
  ];
}
