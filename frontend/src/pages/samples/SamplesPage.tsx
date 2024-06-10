import { Dispatch, SetStateAction } from "react";
import { PageHeader } from "../../shared/components/PageHeader";
import SamplesList from "../../components/SamplesList";
import {
  cohortSampleFilterWhereVariables,
  combinedSampleDetailsColumns,
  prepareCombinedSampleDataForAgGrid,
  sampleFilterWhereVariables,
} from "../../shared/helpers";
import { SampleWhere } from "../../generated/graphql";

interface ISamplesPageProps {
  userEmail: string | null;
  setUserEmail: Dispatch<SetStateAction<string | null>>;
}

export default function SamplesPage({
  userEmail,
  setUserEmail,
}: ISamplesPageProps) {
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
        userEmail={userEmail}
        setUserEmail={setUserEmail}
      />
    </>
  );
}
