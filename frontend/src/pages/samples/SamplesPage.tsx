import SamplesList from "../../components/SamplesList";
import {
  ReadOnlyCohortSampleDetailsColumns,
  combinedSampleDetailsColumns,
} from "../../shared/helpers";
import { useState } from "react";
import { Button } from "react-bootstrap";
import _ from "lodash";
import { InfoToolTip } from "../../shared/components/InfoToolTip";

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
          <InfoToolTip>
            These tabs change the data displayed in the table. "View all
            samples" shows all data and columns, including those of
            SampleMetadata and WES samples.
          </InfoToolTip>{" "}
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
    />
  );
}
