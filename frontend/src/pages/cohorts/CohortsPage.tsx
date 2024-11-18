import {
  CohortCompleteOptions,
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
