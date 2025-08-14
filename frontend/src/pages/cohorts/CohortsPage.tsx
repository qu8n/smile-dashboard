import { useRef, useState } from "react";
import { DataGrid } from "../../components/DataGrid";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { useFetchData } from "../../hooks/useFetchData";
import {
  DashboardCohort,
  DashboardSample,
  useDashboardCohortsLazyQuery,
  useDashboardPatientsLazyQuery,
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
import { MainLayout } from "../../shared/components/MainLayout";
import { useParams } from "react-router-dom";
import { SamplesModal } from "../../components/SamplesModal";
import { cohortColDefs, wesSampleColDefs } from "../../shared/helpers";

const QUERY_NAME = "dashboardCohorts";
const INITIAL_SORT_FIELD_NAME = "initialCohortDeliveryDate";
const RECORD_NAME = "cohorts";
const MODAL_CONTEXT_FIELD_NAME = "cohortId";

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

  const { isDownloading, handleDownload, getRenderedData } =
    useDownload<DashboardCohort>({
      gridRef,
      downloadFileName: RECORD_NAME,
      fetchMore,
      userSearchVal,
      recordCount,
      queryName: QUERY_NAME,
    });

  const downloadOptions = buildDownloadOptions({
    getRenderedData,
    columnDefs: cohortColDefs,
  });

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <MainLayout>
      <Heading>{RECORD_NAME}</Heading>

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
        columnDefs={cohortColDefs}
        handleGridColumnsChanged={refreshData}
      />

      {hasParams && (
        <SamplesModal
          sampleColumnDefs={wesSampleColDefs}
          contextFieldName={MODAL_CONTEXT_FIELD_NAME}
          parentRecordName={RECORD_NAME}
        />
      )}

      <DownloadModal2 show={isDownloading} />
    </MainLayout>
  );
}
