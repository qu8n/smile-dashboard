import {
  AgGridSortDirection,
  useDashboardRequestsLazyQuery,
} from "../../generated/graphql";
import { useState } from "react";
import {
  MAX_ROWS_EXPORT,
  MAX_ROWS_EXPORT_WARNING,
  RequestsListColumns,
  SampleMetadataDetailsColumns,
} from "../../shared/helpers";
import { useParams } from "react-router-dom";
import NewRecordsList from "../../components/NewRecordsList";
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
      <NewRecordsList
        columnDefs={RequestsListColumns}
        dataName={dataName}
        defaultSort={defaultSort}
        lazyRecordsQuery={useDashboardRequestsLazyQuery}
        userSearchVal={userSearchVal}
        setUserSearchVal={setUserSearchVal}
        showDownloadModal={showDownloadModal}
        setShowDownloadModal={setShowDownloadModal}
        handleDownload={(recordCount: number) => {
          if (recordCount && recordCount > MAX_ROWS_EXPORT) {
            setAlertModal({
              show: true,
              ...MAX_ROWS_EXPORT_WARNING,
            });
          } else {
            setShowDownloadModal(true);
          }
        }}
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
