import { useRef, useState } from "react";
import { DataGrid } from "../../components/DataGrid";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { useFetchData } from "../../hooks/useFetchData";
import {
  DashboardRecordContext,
  DashboardSample,
  useDashboardSamplesLazyQuery,
} from "../../generated/graphql";
import { Heading } from "../../shared/components/Heading";
import { Toolbarr } from "../../shared/components/Toolbarr";
import { SearchBar } from "../../shared/components/SearchBar";
import {
  buildDownloadOptions,
  filterButtonOptions,
  filterButtonsTooltipContent,
  phiModeSwitchTooltipContent,
} from "./config";
import { Col } from "react-bootstrap";
// TODO: use react bootsrap components instead of Material UI
// OverlayTrigger
import { FilterButtons } from "../../components/FilterButtons";
import { ErrorMessage } from "../../components/ErrorMessage";
import { DownloadButton } from "../../shared/components/DownloadButton";
import { DownloadModal2 } from "../../components/DownloadModal2";
import { useDownload } from "../../hooks/useDownload";
import { ColDef } from "ag-grid-community";
import { PhiModeSwitch } from "../../components/PhiModeSwitch";
import { useTogglePhiColumns } from "../../hooks/useTogglePhiColumns";
import { POLLING_INTERVAL } from "../../shared/helpers";
import { useCellChanges } from "../../hooks/useCellChanges";
import { CellChangesConfirmation } from "../../components/CellChangesConfirmation";

const RECORD_NAME = "samples";
const QUERY_NAME = "dashboardSamples";
const INITIAL_SORT_FIELD_NAME = "importDate";
const PHI_FIELDS = new Set(["sequencingDate"]);

// TODO: re-create the samples page, then modify it to fit the requests page
export function SamplesPage2() {
  const [userSearchVal, setUserSearchVal] = useState<string>("");
  const [columnDefs, setColumnDefs] = useState<Array<ColDef>>(
    filterButtonOptions[0].columnDefs
  );
  const [contexts, setContexts] = useState<
    Array<DashboardRecordContext> | undefined
  >(filterButtonOptions[0].contexts);

  const gridRef = useRef<AgGridReactType<DashboardSample>>(null);
  const { handleTogglingPhiColumns } = useTogglePhiColumns({
    setColumnDefs,
    phiFields: PHI_FIELDS,
  });
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
    pollInterval: POLLING_INTERVAL,
    userSearchVal,
  });

  const {
    changes,
    handleCellEditRequest,
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

  const { isDownloading, handleDownload, getRenderedData } =
    useDownload<DashboardSample>({
      gridRef,
      recordName: RECORD_NAME,
      fetchMore,
      userSearchVal,
      recordCount,
      queryName: QUERY_NAME,
    });

  const downloadOptions = buildDownloadOptions({
    getRenderedData,
    columnDefs,
  });

  function handleFilterButtonClick(filterButtonLabel: string) {
    const selectedFilterButtonOption = filterButtonOptions.find(
      (option) => option.label === filterButtonLabel
    );
    setColumnDefs(selectedFilterButtonOption!.columnDefs);
    setContexts(selectedFilterButtonOption!.contexts);
    refreshData();
  }

  function handleSearch() {
    handleTogglingPhiColumns();
    refreshData();
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <Heading>Samples</Heading>
      <Toolbarr>
        <Col>
          <FilterButtons
            buttonOptions={filterButtonOptions}
            onButtonClick={handleFilterButtonClick}
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
      </Toolbarr>

      <DataGrid
        gridRef={gridRef}
        columnDefs={columnDefs}
        handleGridColumnsChanged={refreshData}
        changes={changes}
        handleCellEditRequest={handleCellEditRequest}
      />

      <DownloadModal2 show={isDownloading} />
    </>
  );
}
