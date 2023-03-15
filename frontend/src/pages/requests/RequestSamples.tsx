import {
  useRequestWithSamplesQuery,
  SortDirection,
  RequestWithSamplesQuery,
} from "../../generated/graphql";
import AutoSizer from "react-virtualized-auto-sizer";
import { Button, Col, Form, Row } from "react-bootstrap";
import classNames from "classnames";
import { FunctionComponent, useRef } from "react";
import { DownloadModal } from "../../components/DownloadModal";
import { UpdateModal } from "../../components/UpdateModal";
import { CSVFormulate } from "../../lib/CSVExport";
import { SampleDetailsColumns, CellChange, defaultColDef } from "./helpers";
import { Params } from "react-router-dom";
import Spinner from "react-spinkit";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { CellClassParams, CellValueChangedEvent } from "ag-grid-community";

interface IRequestSummaryProps {
  params: Readonly<Params<string>>;
  height: number;
  setUnsavedChanges: (val: boolean) => void;
}

function sampleFilterWhereVariables(value: string) {
  return [
    { cmoSampleName_CONTAINS: value },
    { importDate_CONTAINS: value },
    { investigatorSampleId_CONTAINS: value },
    { primaryId_CONTAINS: value },
    { sampleClass_CONTAINS: value },
    { cmoPatientId_CONTAINS: value },
    { cmoSampleIdFields_CONTAINS: value },
    { sampleName_CONTAINS: value },
    { preservation_CONTAINS: value },
    { tumorOrNormal_CONTAINS: value },
    { oncotreeCode_CONTAINS: value },
    { collectionYear_CONTAINS: value },
    { sampleOrigin_CONTAINS: value },
    { tissueLocation_CONTAINS: value },
    { sex_CONTAINS: value },
    { libraries_CONTAINS: value },
    { sampleType_CONTAINS: value },
    { species_CONTAINS: value },
    { genePanel_CONTAINS: value },
  ];
}

function getSampleMetadata(data: RequestWithSamplesQuery) {
  return data!.requests[0].hasSampleSamples.map((s: any) => {
    return s.hasMetadataSampleMetadata[0];
  });
}

export const RequestSamples: FunctionComponent<IRequestSummaryProps> = ({
  params,
  height,
  setUnsavedChanges,
}) => {
  const { loading, error, data, refetch } = useRequestWithSamplesQuery({
    variables: {
      where: {
        igoRequestId: params.requestId,
      },
      options: {
        offset: 0,
        limit: undefined,
      },
      hasMetadataSampleMetadataOptions2: {
        sort: [{ importDate: SortDirection.Desc }],
        limit: 1,
      },
    },
    fetchPolicy: "no-cache",
  });

  const [val, setVal] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<any>(null);
  const [prom, setProm] = useState<any>(Promise.resolve());
  const [showEditButtons, setShowEditButtons] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [changes, setChanges] = useState<CellChange[]>([]);
  const [editMode, setEditMode] = useState(true);
  const gridRef = useRef<any>(null);

  if (loading)
    return (
      <div className={"centralSpinner"}>
        <Spinner fadeIn={"none"} color={"lightblue"} name="ball-grid-pulse" />
      </div>
    );

  if (error) return <Row>Error loading request details / request samples</Row>;

  const remoteCount = data!.requests[0].hasSampleSamples.length;

  const onCellValueChanged = (params: CellValueChangedEvent) => {
    if (editMode) {
      setUnsavedChanges(true);
      setShowEditButtons(true);

      const { oldValue, newValue } = params;
      const rowNode = params.node;
      const fieldName = params.colDef.field!;
      const primaryId = params.data.primaryId;

      if (oldValue !== newValue) {
        params.colDef.cellStyle = (p: CellClassParams<any>) =>
          p.colDef.field === fieldName && p.rowIndex === rowNode.rowIndex
            ? { backgroundColor: "lemonchiffon" }
            : null;
        params.api.refreshCells({
          columns: [fieldName],
          rowNodes: [rowNode],
          force: true,
        });
      }

      setChanges((changes) => {
        const change = changes.find(
          (c) => c.primaryId === primaryId && c.fieldName === fieldName
        );
        if (change) {
          change.newValue = newValue;
        } else {
          changes.push({ primaryId, fieldName, oldValue, newValue, rowNode });
        }
        return changes;
      });
    }
  };

  const handleDiscardChanges = () => {
    setEditMode(false);
    let columns: any[] = [];
    let rowNodes: any[] = [];

    changes.forEach((c) => {
      c.rowNode.setDataValue(c.fieldName, c.oldValue);
      const colDef = gridRef.current.api.getColumnDef(c.fieldName);
      colDef.cellStyle = (p: CellClassParams<any>) =>
        p.rowIndex.toString() === c.rowNode.rowIndex!.toString()
          ? { backgroundColor: "transparent" }
          : null;
      columns.push(c.fieldName);
      rowNodes.push(c.rowNode);
    });

    gridRef.current.api.refreshCells({
      columns: [...columns],
      rowNodes: [...rowNodes],
      force: true,
    });

    setShowEditButtons(false);
    setUnsavedChanges(false);
    setChanges([]);
    setTimeout(() => {
      setEditMode(true);
    }, 0);
  };

  return (
    <>
      {showDownloadModal && (
        <DownloadModal
          loader={() => {
            return Promise.resolve(
              CSVFormulate(getSampleMetadata(data!), SampleDetailsColumns)
            );
          }}
          onComplete={() => {
            setShowDownloadModal(false);
          }}
          exportFilename={"request_" + data?.requests[0].igoRequestId + ".tsv"}
        />
      )}
      {showUpdateModal && (
        <UpdateModal
          changes={changes}
          onSuccess={handleDiscardChanges}
          onHide={() => setShowUpdateModal(false)}
        />
      )}
      <Row
        className={classNames(
          "d-flex justify-content-between align-items-center tableControlsRow"
        )}
      >
        <Col></Col>
        <Col className={"text-end"}>
          <Form.Control
            className={"d-inline-block"}
            style={{ width: "300px" }}
            type="search"
            placeholder="Search Samples"
            aria-label="Search"
            value={val}
            onInput={(event) => {
              const value = event.currentTarget.value;

              if (value !== null) {
                setVal(value);
              }

              if (typingTimeout) {
                clearTimeout(typingTimeout);
              }

              prom.then(() => {
                const to = setTimeout(() => {
                  const rf = refetch({
                    hasSampleSamplesWhere2: {
                      hasMetadataSampleMetadata_SOME: {
                        OR: sampleFilterWhereVariables(value),
                      },
                    },
                    hasSampleSamplesConnectionWhere2: {
                      node: {
                        hasMetadataSampleMetadata_SOME: {
                          OR: sampleFilterWhereVariables(value),
                        },
                      },
                    },
                  });
                  setProm(rf);
                }, 500);
                setTypingTimeout(to);
              });
            }}
          />
        </Col>

        <Col className={"text-start"}>{remoteCount} matching samples</Col>

        {showEditButtons && (
          <>
            <Col className={"text-end"}>
              <Button
                className={"btn btn-secondary"}
                onClick={handleDiscardChanges}
                size={"sm"}
              >
                Discard Changes
              </Button>
            </Col>
            <Col className={"text-start"}>
              <Button
                className={"btn btn-success"}
                onClick={() => {
                  setShowUpdateModal(true);
                }}
                size={"sm"}
              >
                Submit Updates
              </Button>
            </Col>
          </>
        )}

        <Col className={"text-end"}>
          <Button
            onClick={() => {
              setShowDownloadModal(true);
            }}
            size={"sm"}
          >
            Generate Sample Report
          </Button>
        </Col>
      </Row>
      <AutoSizer>
        {({ width }) => (
          <div
            className="ag-theme-alpine"
            style={{ height: height, width: width }}
          >
            <AgGridReact
              columnDefs={SampleDetailsColumns}
              rowData={getSampleMetadata(data!)}
              onCellValueChanged={onCellValueChanged}
              defaultColDef={defaultColDef}
              ref={gridRef}
              gridOptions={{
                suppressColumnVirtualisation: true,
                rowBuffer: 9999,
              }}
              enableRangeSelection={true}
            />
          </div>
        )}
      </AutoSizer>
    </>
  );
};
