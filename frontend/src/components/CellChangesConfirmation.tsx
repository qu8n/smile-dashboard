import { Button, Modal } from "react-bootstrap";
import { AgGridReact } from "ag-grid-react/lib/agGridReact";
import styles from "./records.module.scss";
import { SampleChange } from "../types";

const updateModalColumnDefs = [
  { field: "primaryId", rowGroup: true, hide: true },
  { field: "fieldName" },
  { field: "oldValue" },
  { field: "newValue" },
];

const autoGroupColumnDef = {
  headerName: "Primary Id",
  field: "primaryId",
};

interface CellChangesConfirmationProps {
  changes: Array<SampleChange>;
  onDiscardChanges: () => void;
  onConfirmUpdates: () => void;
  onSubmitUpdates: () => void;
  onUpdateModalHide: () => void;
  showUpdateModal: boolean;
}

export function CellChangesConfirmation({
  changes,
  onDiscardChanges,
  onConfirmUpdates,
  onSubmitUpdates,
  onUpdateModalHide,
  showUpdateModal,
}: CellChangesConfirmationProps) {
  return (
    <>
      <div className="d-flex align-items-center gap-1">
        <Button
          className="btn btn-secondary"
          onClick={onDiscardChanges}
          size="sm"
        >
          Discard Changes
        </Button>{" "}
        <Button
          className="btn btn-success"
          onClick={onConfirmUpdates}
          size="sm"
        >
          Confirm Updates
        </Button>
      </div>

      {showUpdateModal && (
        <Modal
          show={true}
          size="lg"
          centered
          onHide={onUpdateModalHide}
          className={styles.overlay}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Confirm your changes
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <div className="ag-theme-alpine" style={{ height: 350 }}>
              <AgGridReact
                rowData={changes}
                columnDefs={updateModalColumnDefs}
                groupRemoveSingleChildren={true}
                autoGroupColumnDef={autoGroupColumnDef}
                groupDefaultExpanded={1}
              />
            </div>
          </Modal.Body>

          <Modal.Footer>
            <Button className="btn btn-secondary" onClick={onUpdateModalHide}>
              Cancel
            </Button>
            <Button className="btn btn-success" onClick={onSubmitUpdates}>
              Submit Updates
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
}
