import SamplesList from "../../components/SamplesList";
import {
  ReadOnlyCohortSampleDetailsColumns,
  cohortSampleFilterWhereVariables,
  combinedSampleDetailsColumns,
  prepareCombinedSampleDataForAgGrid,
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
      prepareDataForAgGrid={prepareCombinedSampleDataForAgGrid}
      refetchWhereVariables={(parsedSearchVals) => {
        return {
          OR: cohortSampleFilterWhereVariables(parsedSearchVals).concat({
            hasMetadataSampleMetadata_SOME: {
              OR: sampleFilterWhereVariables(parsedSearchVals),
            },
          }),
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
