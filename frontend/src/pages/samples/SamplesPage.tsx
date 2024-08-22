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

const WES_SAMPLE_FILTERS = [
  "Agilent_51MB",
  "Agilent_v4_51MB_Human",
  "CustomCapture",
  "IDT_Exome_v1_FP",
  "IDT_Exome_v1_FP_Viral_Probes",
  "IDT_Exome_V1_IMPACT468",
  "WES_Human",
  "WholeExomeSequencing",
];

export default function SamplesPage() {
  const [columnDefs, setColumnDefs] = useState(combinedSampleDetailsColumns);

  return (
    <SamplesList
      columnDefs={columnDefs}
      refetchWhereVariables={(parsedSearchVals) => {
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
              OR: sampleFilterWhereVariables(WES_SAMPLE_FILTERS),
            },
          }),
        };
      }}
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
