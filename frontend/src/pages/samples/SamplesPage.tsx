import SamplesList from "../../components/SamplesList";
import {
  DbGapPhenotypeColumns,
  ReadOnlyCohortSampleDetailsColumns,
  combinedSampleDetailsColumns,
} from "../../shared/helpers";
import { useState } from "react";
import { Button } from "react-bootstrap";
import _ from "lodash";
import { CustomTooltip } from "../../shared/components/CustomToolTip";
import InfoIcon from "@material-ui/icons/InfoOutlined";

const WES_SAMPLE_CONTEXT = {
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
};

export default function SamplesPage() {
  const [columnDefs, setColumnDefs] = useState(combinedSampleDetailsColumns);

  const sampleContext = _.isEqual(columnDefs, combinedSampleDetailsColumns)
    ? undefined
    : WES_SAMPLE_CONTEXT;

  return (
    <SamplesList
      columnDefs={columnDefs}
      sampleContext={sampleContext}
      customToolbarUI={
        <>
          <CustomTooltip
            icon={<InfoIcon style={{ fontSize: 18, color: "grey" }} />}
          >
            These tabs change the data displayed in the table. "View all
            samples" shows all data and columns, including those of
            SampleMetadata and WES samples.
          </CustomTooltip>{" "}
          <Button
            onClick={() => {
              setColumnDefs(combinedSampleDetailsColumns);
            }}
            size="sm"
            variant="outline-secondary"
            active={_.isEqual(columnDefs, combinedSampleDetailsColumns)}
          >
            View all samples
          </Button>{" "}
          <Button
            onClick={() => {
              setColumnDefs(ReadOnlyCohortSampleDetailsColumns);
            }}
            size="sm"
            variant="outline-secondary"
            active={_.isEqual(columnDefs, ReadOnlyCohortSampleDetailsColumns)}
          >
            View WES samples
          </Button>
        </>
      }
      exportDropdownItems={[
        {
          label: "Generate Phenotype files for dbGaP",
          columnDefs: DbGapPhenotypeColumns,
        },
      ]}
    />
  );
}
