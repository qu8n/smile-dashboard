import { useRef, useState } from "react";
import { DataGrid } from "../../components/DataGrid";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { useFetchData } from "../../hooks/useFetchData";
import {
  DashboardCohort,
  DashboardSample,
  useDashboardCohortsLazyQuery,
} from "../../generated/graphql";
import { Title } from "../../components/Title";
import { Toolbar } from "../../components/Toolbar";
import { SearchBar } from "../../components/SearchBar";
import { buildDownloadOptions, cohortColDefs } from "./config";
import { Col } from "react-bootstrap";
import { ErrorMessage } from "../../components/ErrorMessage";
import { DownloadButton } from "../../components/DownloadButton";
import { DownloadModal } from "../../components/DownloadModal";
import { useDownload } from "../../hooks/useDownload";
import { DataGridLayout } from "../../components/DataGridLayout";
import { useParams } from "react-router-dom";
import { SamplesModal } from "../../components/SamplesModal";
import { ROUTE_PARAMS } from "../../config";
import { wesSampleColDefs } from "../samples/config";

const QUERY_NAME = "dashboardCohorts";
const INITIAL_SORT_FIELD_NAME = "initialCohortDeliveryDate";
const RECORD_NAME = "cohorts";

export function CohortsPage() {
  const [userSearchVal, setUserSearchVal] = useState<string>("");

  const gridRef = useRef<AgGridReactType<DashboardSample>>(null);
  const hasParams = Object.keys(useParams()).length > 0;

  const { refreshData, recordCount, isLoading, error, fetchMore } =
    useFetchData({
      useRecordsLazyQuery: useDashboardCohortsLazyQuery,
      queryName: QUERY_NAME,
      initialSortFieldName: INITIAL_SORT_FIELD_NAME,
      gridRef,
      userSearchVal,
    });

  const { isDownloading, handleDownload, getCurrentData } =
    useDownload<DashboardCohort>({
      gridRef,
      downloadFileName: RECORD_NAME,
      fetchMore,
      userSearchVal,
      recordCount,
      queryName: QUERY_NAME,
    });

  const downloadOptions = buildDownloadOptions({
    getCurrentData,
    currentColumnDefs: cohortColDefs,
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
            onDownload={handleDownload}
          />
        </Col>
      </Toolbar>

      <DataGrid
        gridRef={gridRef}
        columnDefs={cohortColDefs}
        onGridColumnsChanged={refreshData}
      />

      {hasParams && (
        <SamplesModal
          sampleColumnDefs={wesSampleColDefs}
          contextFieldName={ROUTE_PARAMS.cohorts}
          parentRecordName={RECORD_NAME}
        />
      )}

      {isDownloading && <DownloadModal />}
    </DataGridLayout>
  );
}
