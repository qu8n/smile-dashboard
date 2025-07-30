import {
  AgGridSortDirection,
  useDashboardRequestsLazyQuery,
} from "../../generated/graphql";
import { useState } from "react";
import { requestColDefs, sampleColDefs } from "../../shared/helpers";
import { useParams } from "react-router-dom";
import RecordsList from "../../components/RecordsList";
import { AlertModal } from "../../components/AlertModal";

export default function RequestsPage() {
  const params = useParams();
  const [userSearchVal, setUserSearchVal] = useState<string>("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [alertModal, setAlertModal] = useState<{
    show: boolean;
    title: string;
    content: string;
  }>({ show: false, title: "", content: "" });

  const dataName = "requests";
  const sampleQueryParamFieldName = "igoRequestId";
  const sampleQueryParamValue = params[sampleQueryParamFieldName];
  const defaultSort = {
    colId: "importDate",
    sort: AgGridSortDirection.Desc,
  };

  return (
    <>
      <RecordsList
        columnDefs={requestColDefs}
        dataName={dataName}
        defaultSort={defaultSort}
        useRecordsLazyQuery={useDashboardRequestsLazyQuery}
        userSearchVal={userSearchVal}
        setUserSearchVal={setUserSearchVal}
        showDownloadModal={showDownloadModal}
        setShowDownloadModal={setShowDownloadModal}
        handleDownload={() => setShowDownloadModal(true)}
        samplesColDefs={sampleColDefs}
        sampleContexts={
          sampleQueryParamValue
            ? [
                {
                  fieldName: sampleQueryParamFieldName,
                  values: [sampleQueryParamValue],
                },
              ]
            : undefined
        }
      />

      <AlertModal
        show={alertModal.show}
        onHide={() => {
          setAlertModal({ ...alertModal, show: false });
        }}
        title={alertModal.title}
        content={alertModal.content}
      />
    </>
  );
}
