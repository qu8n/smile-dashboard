import { PageHeader } from "../../shared/components/PageHeader";
import SamplesList from "../../components/SamplesList";
import {
  cohortSampleFilterWhereVariables,
  combinedSampleDetailsColumns,
  prepareCombinedSampleDataForAgGrid,
  sampleFilterWhereVariables,
} from "../../shared/helpers";
import { SampleWhere } from "../../generated/graphql";

export default function SamplesPage() {
  return (
    <>
      <PageHeader dataName={"samples"} />

      <SamplesList
        columnDefs={combinedSampleDetailsColumns}
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
      />
    </>
  );
}
