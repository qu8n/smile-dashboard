import {
  SortDirection,
  useSamplesQuery,
  Sample,
  SampleMetadata,
} from "../../generated/graphql";
import AutoSizer from "react-virtualized-auto-sizer";
import { Button, Col, Form, Row } from "react-bootstrap";
import _ from "lodash";
import classNames from "classnames";
import { FunctionComponent, useRef } from "react";
import { DownloadModal } from "../../components/DownloadModal";
import { UpdateModal } from "../../components/UpdateModal";
import { CSVFormulate } from "../../lib/CSVExport";
import {
  SampleDetailsColumns,
  defaultColDef,
  SampleChange,
  SampleMetadataExtended,
} from "./helpers";
import Spinner from "react-spinkit";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { CellValueChangedEvent } from "ag-grid-community";

const POLLING_INTERVAL = 2000;

interface IRequestSummaryProps {
  height: number;
  setUnsavedChanges: (val: boolean) => void;
  sampleIds: string[];
  exportFileName?: string;
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

function getSampleMetadata(samples: Sample[]) {
  return samples.map((s: any) => {
    return {
      ...s.hasMetadataSampleMetadata[0],
      revisable: s.revisable,
    };
  });
}

export const RequestSamples: FunctionComponent<IRequestSummaryProps> = ({
  sampleIds,
  height,
  setUnsavedChanges,
  exportFileName,
}) => {
  const { loading, error, data, startPolling, stopPolling, refetch } =
    useSamplesQuery({
      variables: {
        where: {
          smileSampleId_IN: sampleIds,
        },
        hasMetadataSampleMetadataOptions2: {
          sort: [{ importDate: SortDirection.Desc }],
          limit: 1,
        },
      },
      pollInterval: POLLING_INTERVAL,
    });

  const [val, setVal] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<any>(null);
  const [prom, setProm] = useState<any>(Promise.resolve());
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [changes, setChanges] = useState<SampleChange[]>([]);
  const [editMode, setEditMode] = useState(true);
  const gridRef = useRef<any>(null);

  if (loading)
    return (
      <div className={"centralSpinner"}>
        <Spinner fadeIn={"none"} color={"lightblue"} name="ball-grid-pulse" />
      </div>
    );

  if (error) return <Row>Error loading request details / request samples</Row>;

  const samples = data!.samples as Sample[];

  const remoteCount = samples.length;

  const onCellValueChanged = (
    params: CellValueChangedEvent<SampleMetadataExtended>
  ) => {
    if (editMode) {
      const { oldValue, newValue } = params;
      const rowNode = params.node;
      const fieldName = params.colDef.field!;
      const primaryId = params.data.primaryId;

      setChanges((changes) => {
        const change = changes.find(
          (c) => c.primaryId === primaryId && c.fieldName === fieldName
        );
        if (change) {
          change.newValue = newValue;
        } else {
          changes.push({ primaryId, fieldName, oldValue, newValue, rowNode });
        }
        // we always have produce a new array to trigger re-render
        return [...changes];
      });

      setUnsavedChanges(true);
    }
  };

  const handleDiscardChanges = () => {
    setEditMode(false);

    setTimeout(() => {
      startPolling(POLLING_INTERVAL);
    }, 10000);

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
              CSVFormulate(getSampleMetadata(samples), SampleDetailsColumns)
            );
          }}
          onComplete={() => {
            setShowDownloadModal(false);
          }}
          exportFileName={exportFileName || "samples.tsv"}
        />
      )}
      {showUpdateModal && (
        <UpdateModal
          changes={changes}
          samples={samples}
          onSuccess={handleDiscardChanges}
          onHide={() => setShowUpdateModal(false)}
          onOpen={() => stopPolling()}
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
                    where: {
                      smileSampleId_IN: sampleIds,
                      hasMetadataSampleMetadata_SOME: {
                        OR: sampleFilterWhereVariables(value),
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

        {changes.length > 0 && (
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
            <AgGridReact<SampleMetadataExtended>
              immutableData={true}
              getRowId={(d) => {
                return d.data.primaryId;
              }}
              rowClassRules={{
                unlocked: function (params) {
                  return params.data?.revisable === true;
                },

                locked: function (params) {
                  return params.data?.revisable === false;
                },
              }}
              columnDefs={SampleDetailsColumns}
              rowData={getSampleMetadata(samples)}
              //onCellValueChanged={onCellValueChanged}
              onCellEditRequest={onCellValueChanged}
              readOnlyEdit={true}
              defaultColDef={defaultColDef}
              ref={gridRef}
              context={{
                getChanges: () => changes,
              }}
              enableRangeSelection={true}
            />
          </div>
        )}
      </AutoSizer>
    </>
  );
};
