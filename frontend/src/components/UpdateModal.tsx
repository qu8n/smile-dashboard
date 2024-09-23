import { useEffect, useMemo } from "react";
import { Button } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-enterprise";
import styles from "./records.module.scss";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ChangesByPrimaryId, SampleChange } from "../shared/helpers";
import {
  Sample,
  Sample2,
  SamplesListQuery,
  SampleUpdateInput,
  SampleWhere,
  useUpdateSamplesMutation,
} from "../generated/graphql";
import _ from "lodash";

interface UpdateModalProps {
  changes: SampleChange[];
  onSuccess: () => void;
  onHide: () => void;
  samples: SamplesListQuery["samples"];
  onOpen?: () => void;
  sampleKeyForUpdate: keyof Sample2;
}

export function UpdateModal({
  changes,
  onHide,
  onSuccess,
  onOpen,
  samples,
  sampleKeyForUpdate,
}: UpdateModalProps) {
  const columnDefs = [
    { field: "primaryId", rowGroup: true, hide: true },
    { field: "fieldName" },
    { field: "oldValue" },
    { field: "newValue" },
  ];

  useEffect(() => {
    onOpen && onOpen();
    // eslint-disable-next-line
  }, []);

  const [updateSamplesMutation] = useUpdateSamplesMutation();

  async function handleSubmitUpdates() {
    const changesByPrimaryId: ChangesByPrimaryId = {};
    for (const { primaryId, fieldName, newValue } of changes) {
      if (changesByPrimaryId[primaryId]) {
        changesByPrimaryId[primaryId][fieldName] = newValue;
      } else {
        changesByPrimaryId[primaryId] = { [fieldName]: newValue };
      }
    }

    const updatedSamples = _.cloneDeep(samples);
    updatedSamples?.forEach((s) => {
      const primaryId = s.primaryId as string;
      if (primaryId in changesByPrimaryId) {
        s.revisable = false;

        _.forEach(changesByPrimaryId[primaryId], (v, k) => {
          /* @ts-ignore */
          s[sampleKeyForUpdate][0][k] = v;
        });
      }
    });

    for (const [primaryId, changedFields] of Object.entries(
      changesByPrimaryId
    )) {
      updateSamplesMutation({
        variables: {
          where: {
            hasMetadataSampleMetadata_SOME: {
              primaryId: primaryId,
            },
          } as SampleWhere,
          update: {
            [sampleKeyForUpdate]: [
              {
                update: {
                  node: changedFields!,
                },
              },
            ],
          } as SampleUpdateInput,
        },
        optimisticResponse: {
          updateSamples: {
            samples: updatedSamples,
          },
        },
      });
    }

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
