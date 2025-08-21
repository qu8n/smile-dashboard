import { Dispatch, ReactNode, SetStateAction, useRef, useState } from "react";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { useNavigate, useParams } from "react-router-dom";
import {
  DashboardSample,
  useDashboardSamplesLazyQuery,
} from "../generated/graphql";
import { useFetchData } from "../hooks/useFetchData";
import { useCellChanges } from "../hooks/useCellChanges";
import { useDownload } from "../hooks/useDownload";
import {
  buildDownloadOptions,
  phiModeSwitchTooltipContent,
} from "../pages/samples/config";
import { useTogglePhiColumnsVisibility } from "../hooks/useTogglePhiColumns";
import { ErrorMessage } from "./ErrorMessage";
import { Title } from "../components/Title";
import { Toolbar } from "../components/Toolbar";
import { Button, Col, Modal } from "react-bootstrap";
import { SearchBar } from "../components/SearchBar";
import { PhiModeSwitch } from "./PhiModeSwitch";
import { CellChangesContainer } from "./CellChangesConfirmation";
import { DownloadButton } from "../components/DownloadButton";
import { DataGrid } from "./DataGrid";
import { DownloadModal } from "./DownloadModal";
import { ColDef } from "ag-grid-community";
import { POLL_INTERVAL, ROUTE_PARAMS } from "../config";
import { SampleChange } from "../types";

const QUERY_NAME = "dashboardSamples";
const INTIAL_SORT_FIELD_NAME = "importDate";
const PHI_FIELDS = new Set(["sequencingDate"]);

interface SamplesModalProps {
  sampleColDefs: Array<ColDef>;
  contextFieldName: string;
  parentRecordName: keyof typeof ROUTE_PARAMS;
}

export function SamplesModal({
  sampleColDefs,
  contextFieldName,
  parentRecordName,
}: SamplesModalProps) {
  const [userSearchVal, setUserSearchVal] = useState("");
  const [colDefs, setColDefs] = useState(sampleColDefs);
  const parentRecordId = useParams()[ROUTE_PARAMS[parentRecordName]];
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
    queryName: QUERY_NAME,
    initialSortFieldName: INTIAL_SORT_FIELD_NAME,
    gridRef,
    userSearchVal,
    recordContexts: [
      {
        fieldName: contextFieldName,
        values: [parentRecordId!],
      },
    ],
    pollInterval: POLL_INTERVAL,
  });

  const {
    changes,
    setChanges,
    cellChangesHandlers,
    handleCellEditRequest,
    handlePaste,
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
      downloadFileName: `${parentRecordName.slice(
        0,
        -1
      )}_${parentRecordId}_samples`,
      fetchMore,
      userSearchVal,
      recordCount,
      queryName: QUERY_NAME,
    });

  const downloadOptions = buildDownloadOptions({
    getCurrentData,
    currentColDefs: colDefs,
  });

  const { handlePhiColumnsVisibilityBeforeSearch } =
    useTogglePhiColumnsVisibility({
      setColDefs,
      phiFields: PHI_FIELDS,
      userSearchVal,
    });

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <ModalContainerWithClosingWarning
      changes={changes}
      setChanges={setChanges}
      parentRecordName={parentRecordName}
    >
      <Toolbar>
        <Col />

        <Col md="auto" className="d-flex gap-3 align-items-center">
          <SearchBar
            userSearchVal={userSearchVal}
            setUserSearchVal={setUserSearchVal}
            onBeforeSearch={handlePhiColumnsVisibilityBeforeSearch}
            onSearch={refreshData}
            recordCount={recordCount}
            isLoading={isLoading}
          />

          <div className="vr" />

          <PhiModeSwitch>{phiModeSwitchTooltipContent}</PhiModeSwitch>

          {changes.length > 0 && (
            <CellChangesContainer
              changes={changes}
              cellChangesHandlers={cellChangesHandlers}
            />
          )}
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
        colDefs={colDefs}
        refreshData={refreshData}
        changes={changes}
        handleCellEditRequest={handleCellEditRequest}
        handlePaste={handlePaste}
      />

      {isDownloading && <DownloadModal />}
    </ModalContainerWithClosingWarning>
  );
}

interface ModalContainerProps {
  changes: Array<SampleChange>;
  setChanges: Dispatch<SetStateAction<Array<SampleChange>>>;
  parentRecordName: keyof typeof ROUTE_PARAMS;
  children: ReactNode;
}

function ModalContainerWithClosingWarning({
  changes,
  setChanges,
  parentRecordName,
  children,
}: ModalContainerProps) {
  const navigate = useNavigate();
  const parentRecordId = useParams()[ROUTE_PARAMS[parentRecordName]];
  const [showClosingWarning, setShowClosingWarning] = useState(false);

  function handleModalClose() {
    if (changes.length > 0) {
      setShowClosingWarning(true);
    } else {
      navigate(`/${parentRecordName}`);
    }
  }

  function handleClosingWarningCancel() {
    setShowClosingWarning(false);
  }

  function handleClosingWarningContinue() {
    setShowClosingWarning(false);
    setChanges([]);
    navigate(`/${parentRecordName}`);
  }

  return (
    <>
      {/* Modal for displaying the data grid */}
      <Modal show={true} dialogClassName="modal-90w" onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Title>{`Viewing ${parentRecordName.slice(
            0,
            -1
          )} ${parentRecordId}'s samples`}</Title>
        </Modal.Header>
        <Modal.Body>
          <div className="popupHeight d-flex flex-column">{children}</div>
        </Modal.Body>
      </Modal>

      {/* Show closing warning when there are unsaved changes */}
      {showClosingWarning && (
        <Modal
          show={true}
          centered
          onHide={handleClosingWarningCancel}
          className="overlay"
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Are you sure you want to exit?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              Exiting this view will discard all your unsubmitted changes. Click
              "Cancel" to remain in this samples view.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className={"btn btn-secondary"}
              onClick={handleClosingWarningCancel}
            >
              Cancel
            </Button>
            <Button
              className={"btn btn-danger"}
              onClick={handleClosingWarningContinue}
            >
              Continue Exiting
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
