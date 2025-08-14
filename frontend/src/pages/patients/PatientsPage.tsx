import { useRef, useState } from "react";
import { DataGrid } from "../../components/DataGrid";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { useFetchData } from "../../hooks/useFetchData";
import {
  DashboardPatient,
  useDashboardPatientsLazyQuery,
} from "../../generated/graphql";
import { Heading } from "../../shared/components/Heading";
import { Toolbarr } from "../../shared/components/Toolbarr";
import { SearchBar } from "../../shared/components/SearchBar";
import { buildDownloadOptions, phiModeSwitchTooltipContent } from "./config";
import { Col } from "react-bootstrap";
import { ErrorMessage } from "../../components/ErrorMessage";
import { DownloadButton } from "../../shared/components/DownloadButton";
import { DownloadModal2 } from "../../components/DownloadModal2";
import { useDownload } from "../../hooks/useDownload";
import { ColDef } from "ag-grid-community";
import { PhiModeSwitch } from "../../components/PhiModeSwitch";
import { useTogglePhiColumnsVisibility } from "../../hooks/useTogglePhiColumns";
import { MainLayout } from "../../shared/components/MainLayout";
import { useParams } from "react-router-dom";
import { SamplesModal } from "../../components/SamplesModal";
import { patientColDefs, sampleColDefs } from "../../shared/helpers";

const QUERY_NAME = "dashboardPatients";
const INITIAL_SORT_FIELD_NAME = "importDate";
const RECORD_NAME = "patients";
const PHI_FIELDS = new Set(["mrn", "anchorSequencingDate"]);
const MODAL_CONTEXT_FIELD_NAME = "patientId";

export function PatientsPage() {
  const [userSearchVal, setUserSearchVal] = useState<string>("");
  const [columnDefs, setColumnDefs] = useState<Array<ColDef>>(patientColDefs);

  const gridRef = useRef<AgGridReactType<DashboardPatient>>(null);
  const hasParams = Object.keys(useParams()).length > 0;

  const { refreshData, recordCount, isLoading, error, fetchMore } =
    useFetchData({
      useRecordsLazyQuery: useDashboardPatientsLazyQuery,
      queryName: QUERY_NAME,
      initialSortFieldName: INITIAL_SORT_FIELD_NAME,
      gridRef,
      userSearchVal,
    });

  const { isDownloading, handleDownload, getRenderedData } =
    useDownload<DashboardPatient>({
      gridRef,
      downloadFileName: RECORD_NAME,
      fetchMore,
      userSearchVal,
      recordCount,
      queryName: QUERY_NAME,
    });

  const downloadOptions = buildDownloadOptions({
    getRenderedData,
    columnDefs,
  });

  const { showPhiColumnsOnInitialPhiSearch } = useTogglePhiColumnsVisibility({
    setColumnDefs,
    phiFields: PHI_FIELDS,
  });

  function handleSearch() {
    showPhiColumnsOnInitialPhiSearch();
    refreshData();
  }

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
            onSearch={handleSearch}
            recordCount={recordCount}
            isLoading={isLoading}
          />

          <div className="vr" />

          <PhiModeSwitch>{phiModeSwitchTooltipContent}</PhiModeSwitch>
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
        columnDefs={columnDefs}
        handleGridColumnsChanged={refreshData}
      />

      {hasParams && (
        <SamplesModal
          sampleColumnDefs={sampleColDefs}
          contextFieldName={MODAL_CONTEXT_FIELD_NAME}
          parentRecordName={RECORD_NAME}
        />
      )}

      <DownloadModal2 show={isDownloading} />
    </MainLayout>
  );
}
