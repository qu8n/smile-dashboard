import { Dispatch, ReactNode, SetStateAction, useRef, useState } from "react";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { useNavigate, useParams } from "react-router-dom";
import {
  POLLING_INTERVAL,
  SampleChange,
  sampleColDefs,
} from "../shared/helpers";
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
import { Heading } from "../shared/components/Heading";
import { Toolbarr } from "../shared/components/Toolbarr";
import { Button, Col, Modal } from "react-bootstrap";
import { SearchBar } from "../shared/components/SearchBar";
import { PhiModeSwitch } from "./PhiModeSwitch";
import { CellChangesConfirmation } from "./CellChangesConfirmation";
import { DownloadButton } from "../shared/components/DownloadButton";
import { DataGrid } from "./DataGrid";
import { DownloadModal2 } from "./DownloadModal2";
import styles from "./records.module.scss";

interface SamplesModalProps {
  queryName: string;
  initialSortFieldName: string;
  phiFields: Set<string>;
  contextFieldName: string;
  parentRecordName: string;
}

export function SamplesModal({
  queryName,
  initialSortFieldName,
  phiFields,
  contextFieldName,
  parentRecordName,
}: SamplesModalProps) {
  const [userSearchVal, setUserSearchVal] = useState<string>("");
  const [columnDefs, setColumnDefs] = useState(sampleColDefs);
  const params = useParams();

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
    contexts: [
      {
        fieldName: contextFieldName,
        values: [params[contextFieldName] || ""],
      },
    ],
    queryName,
    initialSortFieldName,
    gridRef,
    pollInterval: POLLING_INTERVAL,
    userSearchVal,
  });

  const {
    changes,
    setChanges,
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
    samples: data?.[queryName],
    refreshData,
  });

  const { isDownloading, handleDownload, getRenderedData } =
    useDownload<DashboardSample>({
      gridRef,
      downloadFileName: `request_${Object.values(params)[0]}_samples`,
      fetchMore,
      userSearchVal,
      recordCount,
      queryName,
    });

  const downloadOptions = buildDownloadOptions({
    getRenderedData,
    columnDefs,
  });

  const { showPhiColumnsOnInitialPhiSearch } = useTogglePhiColumnsVisibility({
    setColumnDefs,
    phiFields,
  });

  function handleSearch() {
    showPhiColumnsOnInitialPhiSearch();
    refreshData();
  }

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <ModalContainer
      changes={changes}
      setChanges={setChanges}
      parentRecordName={parentRecordName}
    >
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
        handlePaste={handlePaste}
      />

      <DownloadModal2 show={isDownloading} />
    </ModalContainer>
  );
}

interface ModalContainerProps {
  changes: Array<SampleChange>;
  setChanges: Dispatch<SetStateAction<Array<SampleChange>>>;
  parentRecordName: string;
  children: ReactNode;
}

function ModalContainer({
  changes,
  setChanges,
  parentRecordName,
  children,
}: ModalContainerProps) {
  const navigate = useNavigate();
  const params = useParams();
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
          <Heading>{`Viewing ${parentRecordName.slice(0, -1)} ${
            Object.values(params)[0]
          }'s samples`}</Heading>
        </Modal.Header>
        <Modal.Body>
          <div className={`${styles.popupHeight} d-flex flex-column`}>
            {children}
          </div>
        </Modal.Body>
      </Modal>

      {/* Show closing warning when there are unsaved changes */}
      {showClosingWarning && (
        <Modal
          show={true}
          centered
          onHide={handleClosingWarningCancel}
          className={styles.overlay}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Are you sure?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              You have unsaved changes. Are you sure you want to exit this view?
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
