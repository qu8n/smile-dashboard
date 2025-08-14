import { DashboardCohort } from "../../generated/graphql";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { Button } from "react-bootstrap";
import {
  getAgGridBooleanColFilterConfigs,
  getAgGridDateColFilterConfigs,
} from "../../utils/agGrid";
import { formatDate } from "../../utils/dateFormatters";
import { DownloadOption } from "../../hooks/useDownload";
import { BuildDownloadOptionsParamsBase } from "../../types";

type BuildDownloadOptionsParams = BuildDownloadOptionsParamsBase & {
  // Put additional parameters here if needed
};

export function buildDownloadOptions({
  getCurrentData,
  currentColumnDefs,
}: BuildDownloadOptionsParams): Array<DownloadOption> {
  return [
    {
      buttonLabel: "Download as TSV",
      columnDefsForDownload: currentColumnDefs,
      dataGetter: getCurrentData,
    },
  ];
}

export const cohortColDefs: ColDef<DashboardCohort>[] = [
  {
    headerName: "View Samples",
    cellRenderer: (params: ICellRendererParams) => {
      return (
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => {
            if (params.data.cohortId !== undefined) {
              params.context.navigateFunction(
                `/cohorts/${params.data.cohortId}`
              );
            }
          }}
        >
          View
        </Button>
      );
    },
    sortable: false,
  },
  {
    field: "cohortId",
    headerName: "Cohort ID",
  },
  {
    field: "totalSampleCount",
    headerName: "# Samples",
  },
  {
    field: "billed",
    headerName: "Billed",
    ...getAgGridBooleanColFilterConfigs(),
  },
  {
    field: "initialCohortDeliveryDate",
    headerName: "Initial Cohort Delivery Date",
    valueFormatter: (params) => formatDate(params.value) ?? "",
    ...getAgGridDateColFilterConfigs(),
  },
  {
    field: "endUsers",
    headerName: "End Users",
  },
  {
    field: "pmUsers",
    headerName: "PM Users",
  },
  {
    field: "projectTitle",
    headerName: "Project Title",
  },
  {
    field: "projectSubtitle",
    headerName: "Project Subtitle",
  },
  {
    field: "status",
    headerName: "Status",
  },
  {
    field: "type",
    headerName: "Type",
  },
];
