import {
  combinedSampleColDefs,
  dbGapPhenotypeColumns,
  readOnlyAccessSampleColDefs,
  readOnlyWesSampleColDefs,
} from "../../shared/helpers";
import { FilterOptionProps } from "../../components/FilterButtons";
import { parseUserSearchVal } from "../../utils/parseSearchQueries";
import { QueryResult } from "@apollo/client";
import {
  DashboardRecordContext,
  DashboardSample,
} from "../../generated/graphql";

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

export const filterButtonOptions = new Map<string, FilterOptionProps>([
  [
    "All",
    {
      columnDefs: combinedSampleColDefs,
      contexts: undefined,
    },
  ],
  [
    "WES",
    {
      columnDefs: readOnlyWesSampleColDefs,
      contexts: WES_SAMPLE_CONTEXT,
    },
  ],
  [
    "ACCESS/CMO-CH",
    {
      columnDefs: readOnlyAccessSampleColDefs,
      contexts: ACCESS_SAMPLE_CONTEXT,
    },
  ],
]);

export function buildDownloadOptions(
  getRenderedData: () => Promise<Array<DashboardSample>>
) {
  return [
    {
      label: "Download as TSV",
      // FIX: this should reflect the tab selection, right now always "All"
      columnDefs: combinedSampleColDefs,
      dataGetter: getRenderedData,
    },
    {
      label: "Export in Phenotype format for dbGaP",
      columnDefs: dbGapPhenotypeColumns,
      dataGetter: getRenderedData,
    },
  ];
}
