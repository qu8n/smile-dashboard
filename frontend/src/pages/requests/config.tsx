import { DashboardRequest } from "../../generated/graphql";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { Button } from "react-bootstrap";
import { RecordValidation } from "../../components/RecordValidation";
import { REQUEST_STATUS_MAP } from "../../configs/recordValidationMaps";
import { Check } from "@material-ui/icons";
import {
  getAgGridBooleanColFilterConfigs,
  getAgGridBooleanValueFormatter,
  getAgGridDateColFilterConfigs,
} from "../../utils/agGrid";
import { DownloadOption } from "../../hooks/useDownload";
import { BuildDownloadOptionsParamsBase } from "../../types/shared";

type BuildDownloadOptionsParams = BuildDownloadOptionsParamsBase & {
  // Put additional parameters here if needed
};

export function buildDownloadOptions({
  getCurrentData,
  currentColDefs,
}: BuildDownloadOptionsParams): Array<DownloadOption> {
  return [
    {
      buttonLabel: "Download as TSV",
      columnDefsForDownload: currentColDefs,
      dataGetter: getCurrentData,
    },
  ];
}

export const requestColDefs: ColDef<DashboardRequest>[] = [
  {
    headerName: "View Samples",
    cellRenderer: (params: ICellRendererParams) => {
      return (
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              if (params.data.igoRequestId !== undefined) {
                params.context.navigateFunction(
                  `/requests/${params.data.igoRequestId}`
                );
              }
            }}
          >
            View
          </Button>
        </div>
      );
    },
    sortable: false,
  },
  {
    headerName: "Status",
    cellRenderer: (params: ICellRendererParams<DashboardRequest>) => {
      if (!params.data) return null;
      const {
        igoRequestId,
        validationStatus,
        validationReport,
        toleratedSampleErrors,
      } = params.data;
      // add check for toleratedSampleErrors if ultimately deciding to displaying tolerated errors always
      // even on the request validation error popup
      return validationReport !== null && validationReport !== "{}" ? (
        <RecordValidation
          validationStatus={validationStatus}
          validationReport={validationReport}
          toleratedSampleErrors={toleratedSampleErrors}
          modalTitle={`Error report for request ${igoRequestId}`}
          recordStatusMap={REQUEST_STATUS_MAP}
        />
      ) : (
        <Check className="check-icon" />
      );
    },
    sortable: false,
  },
  {
    field: "igoRequestId",
    headerName: "IGO Request ID",
  },
  {
    field: "igoProjectId",
    headerName: "IGO Project ID",
  },
  {
    field: "importDate",
    headerName: "Import Date",
    ...getAgGridDateColFilterConfigs(),
  },
  {
    field: "totalSampleCount",
    headerName: "# Samples",
  },
  {
    field: "projectManagerName",
    headerName: "Project Manager Name",
  },
  {
    field: "investigatorName",
    headerName: "Investigator Name",
  },
  {
    field: "investigatorEmail",
    headerName: "Investigator Email",
  },
  {
    field: "piEmail",
    headerName: "PI Email",
  },
  {
    field: "dataAnalystName",
    headerName: "Data Analyst Name",
  },
  {
    field: "dataAnalystEmail",
    headerName: "Data Analyst Email",
  },
  {
    field: "genePanel",
    headerName: "Gene Panel",
  },
  {
    field: "labHeadName",
    headerName: "Lab Head Name",
  },
  {
    field: "labHeadEmail",
    headerName: "Lab Head Email",
  },
  {
    field: "qcAccessEmails",
    headerName: "QC Access Emails",
  },
  {
    field: "dataAccessEmails",
    headerName: "Data Access Emails",
  },
  {
    field: "bicAnalysis",
    headerName: "BIC Analysis",
    ...getAgGridBooleanColFilterConfigs(),
    ...getAgGridBooleanValueFormatter({
      trueVal: true,
      falseVal: false,
    }),
  },
  {
    field: "isCmoRequest",
    headerName: "CMO Request?",
    ...getAgGridBooleanColFilterConfigs(),
    ...getAgGridBooleanValueFormatter({
      trueVal: true,
      falseVal: false,
    }),
  },
  {
    field: "otherContactEmails",
    headerName: "Other Contact Emails",
  },
];
