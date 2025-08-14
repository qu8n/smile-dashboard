import { useRef, useState } from "react";
import { DataGrid } from "../../components/DataGrid";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { useFetchData } from "../../hooks/useFetchData";
import {
  DashboardRecordContext,
  DashboardSample,
  useDashboardSamplesLazyQuery,
} from "../../generated/graphql";
import { Title } from "../../components/Title";
import { Toolbar } from "../../components/Toolbar";
import { SearchBar } from "../../components/SearchBar";
import {
  buildDownloadOptions,
  filterButtonOptions,
  filterButtonsTooltipContent,
  phiModeSwitchTooltipContent,
} from "./config";
import { Col } from "react-bootstrap";
import { FilterButtons } from "../../components/FilterButtons";
import { ErrorMessage } from "../../components/ErrorMessage";
import { DownloadButton } from "../../components/DownloadButton";
import { DownloadModal } from "../../components/DownloadModal";
import { useDownload } from "../../hooks/useDownload";
import { ColDef } from "ag-grid-community";
import { PhiModeSwitch } from "../../components/PhiModeSwitch";
import { useTogglePhiColumnsVisibility } from "../../hooks/useTogglePhiColumns";
import { useCellChanges } from "../../hooks/useCellChanges";
import { CellChangesConfirmation } from "../../components/CellChangesConfirmation";
import { DataGridLayout } from "../../components/DataGridLayout";
import { POLL_INTERVAL } from "../../config";

const QUERY_NAME = "dashboardSamples";
const INITIAL_SORT_FIELD_NAME = "importDate";
const RECORD_NAME = "samples";
const PHI_FIELDS = new Set(["sequencingDate"]);

export function SamplesPage() {
  const [userSearchVal, setUserSearchVal] = useState<string>("");
  const [columnDefs, setColumnDefs] = useState<Array<ColDef>>(
    filterButtonOptions[0].columnDefs
  );
  const [contexts, setContexts] = useState<
    Array<DashboardRecordContext> | undefined
  >(filterButtonOptions[0].contexts);

  const gridRef = useRef<AgGridReactType<DashboardSample>>(null);

  const {
    refreshData,
    recordCount,
    isLoading,
    error,
    data,
    fetchMore,
    startPolling,
    stopPolling,
  } = useFetchData({
    useRecordsLazyQuery: useDashboardSamplesLazyQuery,
    contexts,
    queryName: QUERY_NAME,
    initialSortFieldName: INITIAL_SORT_FIELD_NAME,
    gridRef,
    pollInterval: POLL_INTERVAL,
    userSearchVal,
  });

  const {
    changes,
    handleCellEditRequest,
    handlePaste,
    handleDiscardChanges,
    handleConfirmUpdates,
    showUpdateModal,
    setShowUpdateModal,
    handleSubmitUpdates,
  } = useCellChanges({
    gridRef,
    startPolling,
    stopPolling,
    samples: data?.[QUERY_NAME],
    refreshData,
  });

  const { isDownloading, handleDownload, getCurrentData } =
    useDownload<DashboardSample>({
      gridRef,
      downloadFileName: RECORD_NAME,
      fetchMore,
      userSearchVal,
      recordCount,
      queryName: QUERY_NAME,
    });

  const downloadOptions = buildDownloadOptions({
    getCurrentData,
    currentColumnDefs: columnDefs,
  });

  function handleFilterButtonClick(filterButtonLabel: string) {
    const selectedFilterButtonOption = filterButtonOptions.find(
      (option) => option.label === filterButtonLabel
    );
    setColumnDefs(selectedFilterButtonOption!.columnDefs);
    setContexts(selectedFilterButtonOption!.contexts);
    refreshData();
  }

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
    <DataGridLayout>
      <Title>{RECORD_NAME}</Title>

      <Toolbar>
        <Col>
          <FilterButtons
            options={filterButtonOptions}
            onClick={handleFilterButtonClick}
          >
            {filterButtonsTooltipContent}
          </FilterButtons>
        </Col>

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

          {changes.length > 0 && (
            <CellChangesConfirmation
              changes={changes}
              onDiscardChanges={handleDiscardChanges}
              onConfirmUpdates={handleConfirmUpdates}
              onSubmitUpdates={handleSubmitUpdates}
              onUpdateModalHide={() => setShowUpdateModal(false)}
              showUpdateModal={showUpdateModal}
            />
          )}
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
        columnDefs={columnDefs}
        handleGridColumnsChanged={refreshData}
        changes={changes}
        handleCellEditRequest={handleCellEditRequest}
        handlePaste={handlePaste}
      />

      {isDownloading && <DownloadModal />}
    </DataGridLayout>
  );
}
