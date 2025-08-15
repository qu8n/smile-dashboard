import {
  AllAnchorSeqDateByPatientIdQuery,
  AnchorSeqDateByPatientId,
  DashboardPatient,
  Exact,
  InputMaybe,
  Scalars,
} from "../../generated/graphql";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import { Button } from "react-bootstrap";
import { getPhiColDefProps } from "../../config";
import {
  getAgGridBooleanColFilterConfigs,
  getAgGridBooleanValueFormatter,
} from "../../utils/agGrid";
import { DownloadOption } from "../../hooks/useDownload";
import { BuildDownloadOptionsParamsBase } from "../../types";
import { LazyQueryExecFunction } from "@apollo/client";

export const allAnchorSeqDateColDefs: Array<ColDef<AnchorSeqDateByPatientId>> =
  [
    {
      field: "MRN",
      headerName: "Patient MRN",
    },
    {
      field: "DMP_PATIENT_ID",
      headerName: "DMP Patient ID",
    },
    {
      field: "ANCHOR_SEQUENCING_DATE",
      headerName: "Anchor Sequencing Date",
    },
    {
      field: "ANCHOR_ONCOTREE_CODE",
      headerName: "Anchor OncoTree Code",
    },
  ];

interface AdditionalBuildDownloadOptionsParams {
  queryAllSeqDates: LazyQueryExecFunction<
    AllAnchorSeqDateByPatientIdQuery,
    Exact<{ phiEnabled?: InputMaybe<Scalars["Boolean"]> }>
  >;
  phiEnabled: boolean;
  userEmail: string | undefined;
}

type BuildDownloadOptionsParams = BuildDownloadOptionsParamsBase &
  AdditionalBuildDownloadOptionsParams;

export function buildDownloadOptions({
  getCurrentData,
  currentColDefs: currentColumnDefs,
  queryAllSeqDates,
  phiEnabled,
  userEmail,
}: BuildDownloadOptionsParams): Array<DownloadOption> {
  return [
    {
      buttonLabel: "Download as TSV",
      columnDefsForDownload: currentColumnDefs,
      dataGetter: getCurrentData,
    },
    {
      buttonLabel: "Export all anchor dates for clinical cohort",
      columnDefsForDownload: allAnchorSeqDateColDefs,
      dataGetter: async () => {
        const result = await queryAllSeqDates({
          variables: { phiEnabled: phiEnabled },
        });
        return result.data!.allAnchorSeqDateByPatientId || [];
      },
      disabled: !phiEnabled || !userEmail,
      tooltipContent:
        "You must enable PHI and log in to export anchor sequencing dates",
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
