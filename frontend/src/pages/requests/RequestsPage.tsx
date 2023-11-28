import {
  RequestWhere,
  SampleWhere,
  useRequestsListLazyQuery,
} from "../../generated/graphql";
import React, { useState } from "react";
import { RequestsListColumns } from "../../shared/helpers";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import RecordsList from "../../components/RecordsList";
import { useParams } from "react-router-dom";
import PageHeader from "../../shared/components/PageHeader";
import { parseSearchQueries } from "../../lib/parseSearchQueries";

function requestFilterWhereVariables(uniqueQueries: string[]): RequestWhere[] {
  if (uniqueQueries.length > 1) {
    return [
      { igoProjectId_IN: uniqueQueries },
      { igoRequestId_IN: uniqueQueries },
      { projectManagerName_IN: uniqueQueries },
      { investigatorName_IN: uniqueQueries },
      { investigatorEmail_IN: uniqueQueries },
      { piEmail_IN: uniqueQueries },
      { dataAnalystName_IN: uniqueQueries },
      { dataAnalystEmail_IN: uniqueQueries },
      { genePanel_IN: uniqueQueries },
      { labHeadName_IN: uniqueQueries },
      { labHeadEmail_IN: uniqueQueries },
      { qcAccessEmails_IN: uniqueQueries },
      { dataAccessEmails_IN: uniqueQueries },
      { otherContactEmails_IN: uniqueQueries },
    ];
  } else {
    return [
      { igoProjectId_CONTAINS: uniqueQueries[0] },
      { igoRequestId_CONTAINS: uniqueQueries[0] },
      { projectManagerName_CONTAINS: uniqueQueries[0] },
      { investigatorName_CONTAINS: uniqueQueries[0] },
      { investigatorEmail_CONTAINS: uniqueQueries[0] },
      { piEmail_CONTAINS: uniqueQueries[0] },
      { dataAnalystName_CONTAINS: uniqueQueries[0] },
      { dataAnalystEmail_CONTAINS: uniqueQueries[0] },
      { genePanel_CONTAINS: uniqueQueries[0] },
      { labHeadName_CONTAINS: uniqueQueries[0] },
      { labHeadEmail_CONTAINS: uniqueQueries[0] },
      { qcAccessEmails_CONTAINS: uniqueQueries[0] },
      { dataAccessEmails_CONTAINS: uniqueQueries[0] },
      { otherContactEmails_CONTAINS: uniqueQueries[0] },
    ];
  }
}

export const RequestsPage: React.FunctionComponent = () => {
  const params = useParams();
  const [searchVal, setSearchVal] = useState<string[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const pageRoute = "/requests";
  const sampleQueryParamFieldName = "igoRequestId";

  const handleSearch = async () => {
    const uniqueQueries = parseSearchQueries(inputVal);
    setSearchVal(uniqueQueries);
  };

  return (
    <>
      <PageHeader pageTitle={"requests"} pageRoute={pageRoute} />

      <RecordsList
        lazyRecordsQuery={useRequestsListLazyQuery}
        nodeName="requests"
        totalCountNodeName="requestsConnection"
        pageRoute={pageRoute}
        searchTerm="requests"
        colDefs={RequestsListColumns}
        conditionBuilder={requestFilterWhereVariables}
        sampleQueryParamFieldName={sampleQueryParamFieldName}
        sampleQueryParamValue={params[sampleQueryParamFieldName]}
        searchVariables={
          {
            hasMetadataSampleMetadata_SOME: {
              [sampleQueryParamFieldName]: params[sampleQueryParamFieldName],
            },
          } as SampleWhere
        }
        handleSearch={handleSearch}
        searchVal={searchVal}
        setSearchVal={setSearchVal}
        inputVal={inputVal}
        setInputVal={setInputVal}
        showDownloadModal={showDownloadModal}
        setShowDownloadModal={setShowDownloadModal}
        handleDownload={() => setShowDownloadModal(true)}
      />
    </>
  );
};

export default RequestsPage;
