import SamplesList from "../../components/SamplesList";
import {
  ReadOnlyCohortSampleDetailsColumns,
  cohortSampleFilterWhereVariables,
  combinedSampleDetailsColumns,
  sampleFilterWhereVariables,
} from "../../shared/helpers";
import { SampleWhere } from "../../generated/graphql";
import { useState } from "react";
import { Button } from "react-bootstrap";
import _ from "lodash";
import { InfoToolTip } from "../../shared/components/InfoToolTip";

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
        } as SampleWhere;
      }}
      customToolbarUI={
        <>
          <InfoToolTip>
            These tabs change the fields displayed in the table below. "View
            All" shows all fields, including both SampleMetadata and Tempo
            fields.
          </InfoToolTip>{" "}
          <Button
            onClick={() => {
              setColumnDefs(combinedSampleDetailsColumns);
            }}
            size="sm"
            variant="outline-secondary"
            active={_.isEqual(columnDefs, combinedSampleDetailsColumns)}
          >
            View all columns
          </Button>{" "}
          <Button
            onClick={() => {
              setColumnDefs(ReadOnlyCohortSampleDetailsColumns);
            }}
            size="sm"
            variant="outline-secondary"
            active={_.isEqual(columnDefs, ReadOnlyCohortSampleDetailsColumns)}
          >
            View TEMPO columns
          </Button>
        </>
      }
    />
  );
}
