import {
  CohortCompleteOptions,
  CohortWhere,
  SampleWhere,
  SortDirection,
  useCohortsListLazyQuery,
} from "../../generated/graphql";
import { Dispatch, SetStateAction, useState } from "react";
import {
  CohortSampleDetailsColumns,
  CohortsListColumns,
  cohortSampleFilterWhereVariables,
  prepareSampleCohortDataForAgGrid,
  handleSearch,
  prepareCohortDataForAgGrid,
} from "../../shared/helpers";
import RecordsList from "../../components/RecordsList";
import { useParams } from "react-router-dom";
import { PageHeader } from "../../shared/components/PageHeader";

function cohortFilterWhereVariables(parsedSearchVals: string[]): CohortWhere[] {
  if (parsedSearchVals.length > 1) {
    return [
      { cohortId_IN: parsedSearchVals },
      {
        hasCohortCompleteCohortCompletes_SOME: {
          type_IN: parsedSearchVals,
        },
      },
      {
        hasCohortCompleteCohortCompletes_SOME: {
          endUsers_INCLUDES: parsedSearchVals[0],
        },
      },
      {
        hasCohortCompleteCohortCompletes_SOME: {
          pmUsers_INCLUDES: parsedSearchVals[0],
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
  } else {
    return [
      { cohortId_CONTAINS: parsedSearchVals[0] },
      {
        hasCohortCompleteCohortCompletes_SOME: {
          type_CONTAINS: parsedSearchVals[0],
        },
      },
      {
        hasCohortCompleteCohortCompletes_SOME: {
          endUsers_INCLUDES: parsedSearchVals[0],
        },
      },
      {
        hasCohortCompleteCohortCompletes_SOME: {
          pmUsers_INCLUDES: parsedSearchVals[0],
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
  const sampleQueryParamHeaderName = "Cohort ID";
  const sampleQueryParamValue = params[sampleQueryParamFieldName];
  const sampleKeyForUpdate = "hasTempoTempos";

  return (
    <>
      <PageHeader dataName={dataName} />

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
        userSearchVal={userSearchVal}
        setUserSearchVal={setUserSearchVal}
        parsedSearchVals={parsedSearchVals}
        setParsedSearchVals={setParsedSearchVals}
        handleSearch={() => handleSearch(userSearchVal, setParsedSearchVals)}
        showDownloadModal={showDownloadModal}
        setShowDownloadModal={setShowDownloadModal}
        handleDownload={() => setShowDownloadModal(true)}
        samplesColDefs={CohortSampleDetailsColumns}
        samplesQueryParam={
          sampleQueryParamValue &&
          `${sampleQueryParamHeaderName} "${sampleQueryParamValue}"`
        }
        prepareSamplesDataForAgGrid={prepareSampleCohortDataForAgGrid}
        samplesParentWhereVariables={
          {
            cohortsHasCohortSampleConnection_SOME: {
              node: {
                [sampleQueryParamFieldName]: sampleQueryParamValue,
              },
            },
          } as SampleWhere
        }
        samplesRefetchWhereVariables={(samplesParsedSearchVals) => {
          return {
            cohortsHasCohortSampleConnection_SOME: {
              node: {
                [sampleQueryParamFieldName]: sampleQueryParamValue,
              },
            },
            OR: cohortSampleFilterWhereVariables(samplesParsedSearchVals),
          } as SampleWhere;
        }}
        sampleKeyForUpdate={sampleKeyForUpdate}
        userEmail={userEmail}
        setUserEmail={setUserEmail}
      />
    </>
  );
}
