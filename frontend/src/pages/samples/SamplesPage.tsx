import { PageHeader } from "../../shared/components/PageHeader";
import SamplesList from "../../components/SamplesList";
import {
  SampleDetailsColumns,
  getSampleMetadataFromSamplesQuery,
  sampleFilterWhereVariables,
} from "../../shared/helpers";
import { SampleWhere } from "../../generated/graphql";

export default function SamplesPage() {
  return (
    <>
      <PageHeader dataName={"samples"} />

      <SamplesList
        columnDefs={SampleDetailsColumns}
        getRowData={getSampleMetadataFromSamplesQuery}
        refetchWhereVariables={(parsedSearchVals) => {
          return {
            hasMetadataSampleMetadata_SOME: {
              OR: sampleFilterWhereVariables(parsedSearchVals),
            },
          } as SampleWhere;
        }}
      />
    </>
  );
}
