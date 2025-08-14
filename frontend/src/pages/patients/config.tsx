import { DashboardPatient } from "../../generated/graphql";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { Button } from "react-bootstrap";
import { getPhiColDefProps } from "../../config";
import {
  getAgGridBooleanColFilterConfigs,
  getAgGridBooleanValueFormatter,
} from "../../utils/agGrid";
import { DownloadOption } from "../../hooks/useDownload";
import { BuildDownloadOptionsParamsBase } from "../../types";

export function buildDownloadOptions({
  getCurrentData,
  currentColumnDefs,
}: BuildDownloadOptionsParamsBase): Array<DownloadOption> {
  return [
    {
      buttonLabel: "Download as TSV",
      columnDefsForDownload: currentColumnDefs,
      dataGetter: getCurrentData,
    },
  ];
}

export const phiModeSwitchTooltipContent =
  "Turn on this switch to return patients' MRNs and Anchor Sequencing Dates" +
  " in the results. The table will display MRNs and sequencing dates only" +
  " after you (1) have logged in and (2) just performed a search with" +
  " specific patient IDs. Turning on this switch for the first time will" +
  " prompt you to log in if you have not already.";

export const patientColDefs: ColDef<DashboardPatient>[] = [
  {
    headerName: "View Samples",
    cellRenderer: (params: ICellRendererParams) => {
      return (
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => {
            const patientId =
              params.data.cmoPatientId || params.data.dmpPatientId;
            params.context.navigateFunction(`/patients/${patientId}`);
          }}
        >
          View
        </Button>
      );
    },
    sortable: false,
  },
  {
    field: "mrn",
    headerName: "Patient MRN",
    ...getPhiColDefProps({ widthSize: 175 }),
  },
  {
    field: "anchorSequencingDate",
    headerName: "Anchor Sequencing Date",
    ...getPhiColDefProps({ widthSize: 260 }),
  },
  {
    field: "cmoPatientId",
    headerName: "CMO Patient ID",
  },
  {
    field: "dmpPatientId",
    headerName: "DMP Patient ID",
  },
  {
    field: "consentPartA",
    headerName: "12-245 Part A",
    ...getAgGridBooleanColFilterConfigs({
      showBlanksFilterOption: true,
    }),
    ...getAgGridBooleanValueFormatter({
      trueVal: "YES",
      falseVal: "NO",
    }),
  },
  {
    field: "consentPartC",
    headerName: "12-245 Part C",
    ...getAgGridBooleanColFilterConfigs({
      showBlanksFilterOption: true,
    }),
    ...getAgGridBooleanValueFormatter({
      trueVal: "YES",
      falseVal: "NO",
    }),
  },
  {
    field: "inDbGap",
    headerName: "dbGaP",
    ...getAgGridBooleanColFilterConfigs({
      showBlanksFilterOption: false,
    }),
    ...getAgGridBooleanValueFormatter({
      trueVal: true,
      falseVal: false,
    }),
  },
  {
    field: "totalSampleCount",
    headerName: "# Samples",
  },
  {
    field: "cmoSampleIds",
    headerName: "Sample IDs",
    maxWidth: 300,
  },
  {
    field: "smilePatientId",
    headerName: "SMILE Patient ID",
    hide: true,
  },
];
