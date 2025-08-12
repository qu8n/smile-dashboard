import {
  combinedSampleColDefs,
  dbGapPhenotypeColumns,
  readOnlyAccessSampleColDefs,
  readOnlyWesSampleColDefs,
} from "../../shared/helpers";
import { FilterButtonOption } from "../../components/FilterButtons";
import {
  DashboardRecordContext,
  DashboardSample,
} from "../../generated/graphql";
import { ColDef } from "ag-grid-community";
import { DownloadOption } from "../../shared/components/DownloadButton";

export const WES_SAMPLE_CONTEXT: Array<DashboardRecordContext> = [
  {
    fieldName: "genePanel",
    values: [
      "Agilent_51MB",
      "Agilent_v4_51MB_Human",
      "CustomCapture",
      "IDT_Exome_v1_FP",
      "IDT_Exome_V1_IMPACT468",
      "WES_Human",
      "WholeExomeSequencing",
    ],
  },
];

export const ACCESS_SAMPLE_CONTEXT: Array<DashboardRecordContext> = [
  {
    fieldName: "genePanel",
    values: [
      "ACCESS129",
      "ACCESS146",
      "ACCESS148",
      "ACCESS-Heme",
      "ACCESS-HEME-115",
      "HC_ACCESS",
      "HC_Custom",
      "MSK-ACCESS_v1",
      "MSK-ACCESS_v2",
      "HC_CMOCH",
      "CMO-CH",
    ],
  },
  {
    fieldName: "baitSet",
    values: [
      "MSK-ACCESS-v1_0-probesAllwFP",
      "MSK-ACCESS-v1_0-probesAllwFP_GRCh38",
      "MSK-ACCESS-v1_0-probesAllwFP_hg19_sort_BAITS",
      "MSK-ACCESS-v1_0-probesAllwFP_hg37_sort-BAITS",
      "MSK-ACCESS-v2_0-probesAllwFP",
      "ACCESS_HEME_MN1",
      "ACCESS129",
      "ACCESS146",
      "ACCESS148",
      "ACCESS-HEME-115",
      "CMO-CH",
      "MSK-CH",
    ],
  },
];

export const filterButtonOptions: Array<FilterButtonOption> = [
  {
    label: "All",
    columnDefs: combinedSampleColDefs,
    contexts: undefined,
  },
  {
    label: "WES",
    columnDefs: readOnlyWesSampleColDefs,
    contexts: WES_SAMPLE_CONTEXT,
  },
  {
    label: "ACCESS/CMO-CH",
    columnDefs: readOnlyAccessSampleColDefs,
    contexts: ACCESS_SAMPLE_CONTEXT,
  },
];

export const filterButtonsTooltipContent =
  "These tabs filter the data and relevant columns displayed in the table." +
  '"All" shows all samples, whereas "WES" and "ACCESS/CMO-CH" show only' +
  "whole exome and MSK-ACCESS/CMO-CH samples, respectively.";

interface BuildDownloadOptionsParams {
  /**
   * Callback function provided by the useDownload hook to fetch all data for the
   * current search value.
   */
  getRenderedData: () => Promise<Array<DashboardSample>>;
  /**
   * The current column definitions state of the table.
   */
  columnDefs: Array<ColDef>;
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
    {
      label: "Download in Phenotype format for dbGaP",
      columnDefs: dbGapPhenotypeColumns,
      dataGetter: getRenderedData,
    },
  ];
}

export const phiModeSwitchTooltipContent =
  "Turn on this switch to return samples' sequencing dates in the results." +
  " The table will display sequencing dates only after you (1) have logged" +
  " in and (2) just performed a search with specific DMP Sample IDs. Turning" +
  " on this switch for the first time will prompt you to log in if you are" +
  " not already.";
