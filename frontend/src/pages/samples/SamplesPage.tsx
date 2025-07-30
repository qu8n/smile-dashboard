import SamplesList from "../../components/SamplesList";
import {
  DbGapPhenotypeColumns,
  readOnlyAccessSampleColDefs,
  readOnlyWesSampleColDefs,
  combinedSampleColDefs,
} from "../../shared/helpers";
import { useState } from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import { CustomTooltip } from "../../shared/components/CustomToolTip";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { ColDef } from "ag-grid-community";
import { DashboardRecordContext } from "../../generated/graphql";

const WES_SAMPLE_CONTEXT = [
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

const ACCESS_SAMPLE_CONTEXT = [
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

const tabSettings = new Map<
  string,
  {
    columnDefs: ColDef[];
    sampleContexts?: DashboardRecordContext[];
  }
>([
  [
    "All",
    {
      columnDefs: combinedSampleColDefs,
      sampleContexts: undefined,
    },
  ],
  [
    "WES",
    {
      columnDefs: readOnlyWesSampleColDefs,
      sampleContexts: WES_SAMPLE_CONTEXT,
    },
  ],
  [
    "ACCESS/CMO-CH",
    {
      columnDefs: readOnlyAccessSampleColDefs,
      sampleContexts: ACCESS_SAMPLE_CONTEXT,
    },
  ],
]);

export default function SamplesPage() {
  const [filteredTabKey, setFilteredTabKey] = useState("All");

  return (
    <SamplesList
      columnDefs={
        tabSettings.get(filteredTabKey)?.columnDefs ?? combinedSampleColDefs
      }
      sampleContexts={tabSettings.get(filteredTabKey)?.sampleContexts}
      customToolbarUI={
        <>
          <CustomTooltip
            icon={<InfoIcon style={{ fontSize: 18, color: "grey" }} />}
          >
            These tabs filter the data and relevant columns displayed in the
            table. "All" shows all samples, whereas "WES" and "ACCESS/CMO-CH"
            show only whole exome and MSK-ACCESS/CMO-CH samples, respectively.
          </CustomTooltip>{" "}
          <ButtonGroup>
            {Array.from(tabSettings.keys()).map((tabKey) => (
              <Button
                key={tabKey}
                onClick={() => setFilteredTabKey(tabKey)}
                size="sm"
                variant="outline-secondary"
                active={filteredTabKey === tabKey}
              >
                {tabKey}
              </Button>
            ))}
          </ButtonGroup>
        </>
      }
      addlExportDropdownItems={[
        {
          label: "Export in Phenotype format for dbGaP",
          columnDefs: DbGapPhenotypeColumns,
        },
      ]}
    />
  );
}
