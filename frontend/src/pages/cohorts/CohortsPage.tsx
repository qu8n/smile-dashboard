import {
  CohortCompleteOptions,
  CohortWhere,
  SortDirection,
  useCohortsListLazyQuery,
} from "../../generated/graphql";
import { Dispatch, SetStateAction, useState } from "react";
import {
  WesSampleDetailsColumns,
  CohortsListColumns,
  handleSearch,
  prepareCohortDataForAgGrid,
} from "../../shared/helpers";
import RecordsList from "../../components/RecordsList";
import { useParams } from "react-router-dom";

function cohortFilterWhereVariables(parsedSearchVals: string[]): CohortWhere[] {
  if (parsedSearchVals.length > 1) {
    const whereVariables: CohortWhere[] = [
      { cohortId_IN: parsedSearchVals },
      {
        hasCohortCompleteCohortCompletes_SOME: {
          type_IN: parsedSearchVals,
        },
      },
      {
        hasCohortCompleteCohortCompletes_SOME: {
          projectTitle_IN: parsedSearchVals,
        },
      },
      {
        hasCohortCompleteCohortCompletes_SOME: {
          projectSubtitle_IN: parsedSearchVals,
        },
      },
      {
        hasCohortCompleteCohortCompletes_SOME: {
          status_IN: parsedSearchVals,
        },
      },
      {
        hasCohortCompleteCohortCompletes_SOME: {
          date_IN: parsedSearchVals,
        },
      },
      {
        hasCohortSampleSamples_SOME: {
          hasMetadataSampleMetadata_SOME: {
            primaryId_IN: parsedSearchVals,
          },
        },
      },
    ];

    // Enable fuzzy search for these fields instead of exact match
    // because their value type in the DB is a string
    parsedSearchVals.forEach((val) => {
      whereVariables.push({
        hasCohortCompleteCohortCompletes_SOME: {
          endUsers_CONTAINS: val,
        },
      });
      whereVariables.push({
        hasCohortCompleteCohortCompletes_SOME: {
          pmUsers_CONTAINS: val,
        },
      });
    });

    return whereVariables;
  }

  if (parsedSearchVals.length === 1) {
    return [
      { cohortId_CONTAINS: parsedSearchVals[0] },
      {
        hasCohortCompleteCohortCompletes_SOME: {
          type_CONTAINS: parsedSearchVals[0],
        },
      },
      {
        hasCohortCompleteCohortCompletes_SOME: {
          endUsers_CONTAINS: parsedSearchVals[0],
        },
      },
      {
        hasCohortCompleteCohortCompletes_SOME: {
          pmUsers_CONTAINS: parsedSearchVals[0],
        },
      },
      {
        hasCohortCompleteCohortCompletes_SOME: {
          projectTitle_CONTAINS: parsedSearchVals[0],
        },
      },
      {
        hasCohortCompleteCohortCompletes_SOME: {
          projectSubtitle_CONTAINS: parsedSearchVals[0],
        },
      },
      {
        hasCohortCompleteCohortCompletes_SOME: {
          status_CONTAINS: parsedSearchVals[0],
        },
      },
      {
        hasCohortCompleteCohortCompletes_SOME: {
          date_CONTAINS: parsedSearchVals[0],
        },
      },
      {
        hasCohortSampleSamples_SOME: {
          hasMetadataSampleMetadata_SOME: {
            primaryId_CONTAINS: parsedSearchVals[0],
          },
        },
      },
    ];
  }

  return [];
}

interface ICohortsPageProps {
  userEmail: string | null;
  setUserEmail: Dispatch<SetStateAction<string | null>>;
}

export default function CohortsPage({
  userEmail,
  setUserEmail,
}: ICohortsPageProps) {
  const params = useParams();
  const [userSearchVal, setUserSearchVal] = useState<string>("");
  const [parsedSearchVals, setParsedSearchVals] = useState<string[]>([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const dataName = "cohorts";
  const sampleQueryParamFieldName = "cohortId";
  const sampleQueryParamValue = params[sampleQueryParamFieldName];
  const defaultSort = [{ initialCohortDeliveryDate: SortDirection.Desc }];

  return (
    <RecordsList
      colDefs={CohortsListColumns}
      dataName={dataName}
      enableInfiniteScroll={false}
      lazyRecordsQuery={useCohortsListLazyQuery}
      lazyRecordsQueryAddlVariables={
        {
          hasCohortCompleteCohortCompletesOptions2: {
            sort: [{ date: SortDirection.Desc }],
          },
        } as CohortCompleteOptions
      }
      prepareDataForAgGrid={prepareCohortDataForAgGrid}
      queryFilterWhereVariables={cohortFilterWhereVariables}
      defaultSort={defaultSort}
      userSearchVal={userSearchVal}
      setUserSearchVal={setUserSearchVal}
      parsedSearchVals={parsedSearchVals}
      setParsedSearchVals={setParsedSearchVals}
      handleSearch={() => handleSearch(userSearchVal, setParsedSearchVals)}
      showDownloadModal={showDownloadModal}
      setShowDownloadModal={setShowDownloadModal}
      handleDownload={() => setShowDownloadModal(true)}
      samplesColDefs={WesSampleDetailsColumns}
      sampleContext={
        sampleQueryParamValue
          ? {
              fieldName: sampleQueryParamFieldName,
              values: [sampleQueryParamValue],
            }
          : undefined
      }
      userEmail={userEmail}
      setUserEmail={setUserEmail}
    />
  );
}
