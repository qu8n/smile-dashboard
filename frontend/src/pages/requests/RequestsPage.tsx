import {
  RequestWhere,
  SortDirection,
  useRequestsListLazyQuery,
} from "../../generated/graphql";
import { useState } from "react";
import {
  RequestsListColumns,
  SampleMetadataDetailsColumns,
  handleSearch,
} from "../../shared/helpers";
import RecordsList from "../../components/RecordsList";
import { useParams } from "react-router-dom";

function requestFilterWhereVariables(
  parsedSearchVals: string[]
): RequestWhere[] {
  if (parsedSearchVals.length > 1) {
    return [
      { igoProjectId_IN: parsedSearchVals },
      { igoRequestId_IN: parsedSearchVals },
      { projectManagerName_IN: parsedSearchVals },
      { investigatorName_IN: parsedSearchVals },
      { investigatorEmail_IN: parsedSearchVals },
      { piEmail_IN: parsedSearchVals },
      { dataAnalystName_IN: parsedSearchVals },
      { dataAnalystEmail_IN: parsedSearchVals },
      { genePanel_IN: parsedSearchVals },
      { labHeadName_IN: parsedSearchVals },
      { labHeadEmail_IN: parsedSearchVals },
      { qcAccessEmails_IN: parsedSearchVals },
      { dataAccessEmails_IN: parsedSearchVals },
      { otherContactEmails_IN: parsedSearchVals },
    ];
  }

  if (parsedSearchVals.length === 1) {
    return [
      { igoProjectId_CONTAINS: parsedSearchVals[0] },
      { igoRequestId_CONTAINS: parsedSearchVals[0] },
      { projectManagerName_CONTAINS: parsedSearchVals[0] },
      { investigatorName_CONTAINS: parsedSearchVals[0] },
      { investigatorEmail_CONTAINS: parsedSearchVals[0] },
      { piEmail_CONTAINS: parsedSearchVals[0] },
      { dataAnalystName_CONTAINS: parsedSearchVals[0] },
      { dataAnalystEmail_CONTAINS: parsedSearchVals[0] },
      { genePanel_CONTAINS: parsedSearchVals[0] },
      { labHeadName_CONTAINS: parsedSearchVals[0] },
      { labHeadEmail_CONTAINS: parsedSearchVals[0] },
      { qcAccessEmails_CONTAINS: parsedSearchVals[0] },
      { dataAccessEmails_CONTAINS: parsedSearchVals[0] },
      { otherContactEmails_CONTAINS: parsedSearchVals[0] },
    ];
  }

  return [];
}

export default function RequestsPage() {
  const params = useParams();
  const [userSearchVal, setUserSearchVal] = useState<string>("");
  const [parsedSearchVals, setParsedSearchVals] = useState<string[]>([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const dataName = "requests";
  const sampleQueryParamFieldName = "igoRequestId";
  const sampleQueryParamValue = params[sampleQueryParamFieldName];
  const defaultSort = [{ importDate: SortDirection.Desc }];

  return (
    <RecordsList
      colDefs={RequestsListColumns}
      dataName={dataName}
      lazyRecordsQuery={useRequestsListLazyQuery}
      queryFilterWhereVariables={requestFilterWhereVariables}
      defaultSort={defaultSort}
      userSearchVal={userSearchVal}
      setUserSearchVal={setUserSearchVal}
      parsedSearchVals={parsedSearchVals}
      setParsedSearchVals={setParsedSearchVals}
      handleSearch={() => handleSearch(userSearchVal, setParsedSearchVals)}
      showDownloadModal={showDownloadModal}
      setShowDownloadModal={setShowDownloadModal}
      handleDownload={() => setShowDownloadModal(true)}
      samplesColDefs={SampleMetadataDetailsColumns}
      sampleContext={
        sampleQueryParamValue
          ? {
              fieldName: sampleQueryParamFieldName,
              values: [sampleQueryParamValue],
            }
          : undefined
      }
    />
  );
}
