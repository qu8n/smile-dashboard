import SamplesList from "../../components/SamplesList";
import {
  ReadOnlyCohortSampleDetailsColumns,
  cohortSampleFilterWhereVariables,
  combinedSampleDetailsColumns,
  sampleFilterWhereVariables,
} from "../../shared/helpers";
import { useState } from "react";
import { Button } from "react-bootstrap";
import _ from "lodash";
import { InfoToolTip } from "../../shared/components/InfoToolTip";

const WES_CONTEXT = {
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
    : WES_CONTEXT;

  const refetchWhereVariables = (parsedSearchVals: string[]) => {
    const cohortSampleFilters = cohortSampleFilterWhereVariables(
      parsedSearchVals
    ).filter((filter) => filter.hasTempoTempos_SOME);
    const sampleMetadataFilters = {
      hasMetadataSampleMetadata_SOME: {
        OR: sampleFilterWhereVariables(parsedSearchVals),
      },
    };
    return {
      OR: cohortSampleFilters.concat(sampleMetadataFilters),
      ...(_.isEqual(columnDefs, ReadOnlyCohortSampleDetailsColumns) && {
        hasMetadataSampleMetadata_SOME: {
          OR: sampleFilterWhereVariables(WES_CONTEXT.values),
        },
      }),
    };
  };

  return (
    <SamplesList
      columnDefs={columnDefs}
      refetchWhereVariables={refetchWhereVariables}
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
