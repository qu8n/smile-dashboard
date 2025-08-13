import { useRef, useState } from "react";
import { DataGrid } from "../../components/DataGrid";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { useFetchData } from "../../hooks/useFetchData";
import {
  DashboardRequest,
  DashboardSample,
  useDashboardRequestsLazyQuery,
} from "../../generated/graphql";
import { Heading } from "../../shared/components/Heading";
import { Toolbarr } from "../../shared/components/Toolbarr";
import { SearchBar } from "../../shared/components/SearchBar";
import { buildDownloadOptions } from "./config";
import { Col } from "react-bootstrap";
import { ErrorMessage } from "../../components/ErrorMessage";
import { DownloadButton } from "../../shared/components/DownloadButton";
import { DownloadModal2 } from "../../components/DownloadModal2";
import { useDownload } from "../../hooks/useDownload";
import { requestColDefs } from "../../shared/helpers";

const QUERY_NAME = "dashboardRequests";
const INITIAL_SORT_FIELD_NAME = "importDate";
const DOWNLOAD_FILE_NAME = "requests";

export function RequestsPage() {
  const [userSearchVal, setUserSearchVal] = useState<string>("");

  const gridRef = useRef<AgGridReactType<DashboardSample>>(null);

  const { refreshData, recordCount, isLoading, error, fetchMore } =
    useFetchData({
      useRecordsLazyQuery: useDashboardRequestsLazyQuery,
      queryName: QUERY_NAME,
      initialSortFieldName: INITIAL_SORT_FIELD_NAME,
      gridRef,
      userSearchVal,
    });

  const { isDownloading, handleDownload, getRenderedData } =
    useDownload<DashboardRequest>({
      gridRef,
      downloadFileName: DOWNLOAD_FILE_NAME,
      fetchMore,
      userSearchVal,
      recordCount,
      queryName: QUERY_NAME,
    });

  const downloadOptions = buildDownloadOptions({
    getRenderedData,
    requestColDefs,
  });

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <Heading>Requests</Heading>

      <Toolbarr>
        <Col />

        <Col md="auto" className="d-flex gap-3 align-items-center">
          <SearchBar
            userSearchVal={userSearchVal}
            setUserSearchVal={setUserSearchVal}
            onSearch={refreshData}
            recordCount={recordCount}
            isLoading={isLoading}
          />
        </Col>

        <Col className="text-end">
          <DownloadButton
            downloadOptions={downloadOptions}
            handleDownload={handleDownload}
          />
        </Col>
      </Toolbarr>

      <DataGrid
        gridRef={gridRef}
        columnDefs={requestColDefs}
        handleGridColumnsChanged={refreshData}
      />

      <DownloadModal2 show={isDownloading} />
    </>
  );
}
