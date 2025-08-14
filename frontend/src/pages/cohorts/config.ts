import { DashboardCohort } from "../../generated/graphql";
import { ColDef } from "ag-grid-community";
import { DownloadOption } from "../../shared/components/DownloadButton";

// TODO: make this a base type/interface for all download options across all pages
// use generic T too
interface BuildDownloadOptionsParams {
  getRenderedData: () => Promise<Array<DashboardCohort>>;
  columnDefs: Array<ColDef<DashboardCohort>>;
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
