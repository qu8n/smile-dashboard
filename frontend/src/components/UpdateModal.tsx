import { useEffect, useMemo } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import styles from "./records.module.scss";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { SampleChange } from "../shared/helpers";
import {
  DashboardSampleInput,
  DashboardSamplesQuery,
  useUpdateDashboardSamplesMutation,
} from "../generated/graphql";

const columnDefs = [
  { field: "primaryId", rowGroup: true, hide: true },
  { field: "fieldName" },
  { field: "oldValue" },
  { field: "newValue" },
];

type ChangesByPrimaryId = {
  [primaryId: string]: {
    [fieldName: string]: string;
  };
};

interface UpdateModalProps {
  changes: SampleChange[];
  onSuccess: () => void;
  onHide: () => void;
  samples: DashboardSamplesQuery["dashboardSamples"];
  onOpen: () => void;
}

export function UpdateModal({
  changes,
  onHide,
  onSuccess,
  onOpen,
  samples,
}: UpdateModalProps) {
  useEffect(() => {
    onOpen && onOpen();
    // eslint-disable-next-line
  }, []);

  const [updateDashboardSamplesMutation] = useUpdateDashboardSamplesMutation();

  async function handleSubmitUpdates() {
    const changesByPrimaryId: ChangesByPrimaryId = {};
    for (const { primaryId, fieldName, newValue } of changes) {
      if (changesByPrimaryId[primaryId]) {
        changesByPrimaryId[primaryId][fieldName] = newValue;
      } else {
        changesByPrimaryId[primaryId] = { [fieldName]: newValue };
      }
    }

    let newDashboardSamples: DashboardSampleInput[] = [];
    samples.forEach((s) => {
      if (s.primaryId in changesByPrimaryId) {
        const newDashboardSample = {
          ...s,
          revisable: false,
          changedFieldNames: Object.keys(changesByPrimaryId[s.primaryId]),
        };
        for (const [fieldName, newValue] of Object.entries(
          changesByPrimaryId[s.primaryId]
        )) {
          if (fieldName in s) {
            (newDashboardSample as any)[fieldName] = newValue;
          }
        }
        delete newDashboardSample.__typename;
        newDashboardSamples.push(newDashboardSample);
      }
    });

    updateDashboardSamplesMutation({
      variables: { newDashboardSamples },
      optimisticResponse: {
        updateDashboardSamples: newDashboardSamples,
      },
    });

    onSuccess();
    onHide();
  }

  const autoGroupColumnDef = useMemo(() => {
    return {
      headerName: "Primary Id",
      field: "primaryId",
    };
  }, []);

  return (
    <Modal
      show={true}
      size={"lg"}
      centered
      onHide={onHide}
      className={styles.overlay}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Are you sure?
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Are you sure you want to submit the following changes?</p>
        <div className="ag-theme-alpine" style={{ height: 350 }}>
          <AgGridReact
            rowData={changes}
            columnDefs={columnDefs}
            groupRemoveSingleChildren={true}
            autoGroupColumnDef={autoGroupColumnDef}
            groupDefaultExpanded={1}
          ></AgGridReact>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button className={"btn btn-secondary"} onClick={onHide}>
          Cancel
        </Button>
        <Button className={"btn btn-success"} onClick={handleSubmitUpdates}>
          Submit Updates
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
