import { useRef, useState } from "react";
import { DataGrid } from "../../components/DataGrid";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { useFetchData } from "../../hooks/useFetchData";
import {
  DashboardRequest,
  useDashboardRequestsLazyQuery,
} from "../../generated/graphql";
import { Title } from "../../components/Title";
import { Toolbar } from "../../components/Toolbar";
import { SearchBar } from "../../components/SearchBar";
import { buildDownloadOptions, requestColDefs } from "./config";
import { Col } from "react-bootstrap";
import { ErrorMessage } from "../../components/ErrorMessage";
import { DownloadButton } from "../../components/DownloadButton";
import { DownloadModal } from "../../components/DownloadModal";
import { useDownload } from "../../hooks/useDownload";
import { useParams } from "react-router-dom";
import { SamplesModal } from "../../components/SamplesModal";
import { DataGridLayout } from "../../components/DataGridLayout";
import { ROUTE_PARAMS } from "../../config";
import { sampleColDefs } from "../samples/config";

const QUERY_NAME = "dashboardRequests";
const INITIAL_SORT_FIELD_NAME = "importDate";
const RECORD_NAME = "requests";

export function RequestsPage() {
  const [userSearchVal, setUserSearchVal] = useState<string>("");

  const gridRef = useRef<AgGridReactType<DashboardRequest>>(null);
  const hasParams = Object.keys(useParams()).length > 0;

  const { refreshData, recordCount, isLoading, error, fetchMore } =
    useFetchData({
      useRecordsLazyQuery: useDashboardRequestsLazyQuery,
      queryName: QUERY_NAME,
      initialSortFieldName: INITIAL_SORT_FIELD_NAME,
      gridRef,
      userSearchVal,
    });

  const { isDownloading, handleDownload, getCurrentData } =
    useDownload<DashboardRequest>({
      gridRef,
      downloadFileName: RECORD_NAME,
      fetchMore,
      userSearchVal,
      recordCount,
      queryName: QUERY_NAME,
    });

  const downloadOptions = buildDownloadOptions({
    getCurrentData,
    currentColumnDefs: requestColDefs,
  });

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <DataGridLayout>
      <Title>{RECORD_NAME}</Title>

      <Toolbar>
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
      </Toolbar>

      <DataGrid
        gridRef={gridRef}
        columnDefs={requestColDefs}
        handleGridColumnsChanged={refreshData}
      />

      {hasParams && (
        <SamplesModal
          sampleColumnDefs={sampleColDefs}
          contextFieldName={ROUTE_PARAMS.requests}
          parentRecordName={RECORD_NAME}
        />
      )}

      {isDownloading && <DownloadModal />}
    </DataGridLayout>
  );
}
