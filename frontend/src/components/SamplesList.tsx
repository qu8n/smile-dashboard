import {
  SortDirection,
  Sample,
  useFindSamplesByInputValueQuery,
  SampleMetadataWhere,
} from "../generated/graphql";
import AutoSizer from "react-virtualized-auto-sizer";
import { Button, Col, Form, Row } from "react-bootstrap";
import classNames from "classnames";
import { FunctionComponent, useEffect, useRef } from "react";
import { DownloadModal } from "./DownloadModal";
import { UpdateModal } from "./UpdateModal";
import { AlertModal } from "./AlertModal";
import { CSVFormulate } from "../lib/CSVExport";
import {
  SampleDetailsColumns,
  defaultSamplesColDef,
  SampleChange,
  SampleMetadataExtended,
} from "../shared/helpers";
import Spinner from "react-spinkit";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { CellValueChangedEvent } from "ag-grid-community";
import { Tooltip } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { parseSearchQueries } from "../lib/parseSearchQueries";

const POLLING_INTERVAL = 2000;
const max_rows = 500;

interface ISampleListProps {
  height: number;
  setUnsavedChanges?: (val: boolean) => void;
  searchVariables?: SampleMetadataWhere;
  exportFileName?: string;
  sampleQueryParamFieldName?: string;
  sampleQueryParamValue?: string;
}

function sampleFilterWhereVariables(
  uniqueQueries: string[]
): SampleMetadataWhere[] {
  if (uniqueQueries.length > 1) {
    return [
      { cmoSampleName_IN: uniqueQueries },
      { importDate_IN: uniqueQueries },
      { investigatorSampleId_IN: uniqueQueries },
      { primaryId_IN: uniqueQueries },
      { sampleClass_IN: uniqueQueries },
      { cmoPatientId_IN: uniqueQueries },
      { cmoSampleIdFields_IN: uniqueQueries },
      { sampleName_IN: uniqueQueries },
      { preservation_IN: uniqueQueries },
      { tumorOrNormal_IN: uniqueQueries },
      { oncotreeCode_IN: uniqueQueries },
      { collectionYear_IN: uniqueQueries },
      { sampleOrigin_IN: uniqueQueries },
      { tissueLocation_IN: uniqueQueries },
      { sex_IN: uniqueQueries },
      { libraries_IN: uniqueQueries },
      { sampleType_IN: uniqueQueries },
      { species_IN: uniqueQueries },
      { genePanel_IN: uniqueQueries },
    ];
  } else {
    return [
      { cmoSampleName_CONTAINS: uniqueQueries[0] },
      { importDate_CONTAINS: uniqueQueries[0] },
      { investigatorSampleId_CONTAINS: uniqueQueries[0] },
      { primaryId_CONTAINS: uniqueQueries[0] },
      { sampleClass_CONTAINS: uniqueQueries[0] },
      { cmoPatientId_CONTAINS: uniqueQueries[0] },
      { cmoSampleIdFields_CONTAINS: uniqueQueries[0] },
      { sampleName_CONTAINS: uniqueQueries[0] },
      { preservation_CONTAINS: uniqueQueries[0] },
      { tumorOrNormal_CONTAINS: uniqueQueries[0] },
      { oncotreeCode_CONTAINS: uniqueQueries[0] },
      { collectionYear_CONTAINS: uniqueQueries[0] },
      { sampleOrigin_CONTAINS: uniqueQueries[0] },
      { tissueLocation_CONTAINS: uniqueQueries[0] },
      { sex_CONTAINS: uniqueQueries[0] },
      { libraries_CONTAINS: uniqueQueries[0] },
      { sampleType_CONTAINS: uniqueQueries[0] },
      { species_CONTAINS: uniqueQueries[0] },
      { genePanel_CONTAINS: uniqueQueries[0] },
    ];
  }
}

function getSampleMetadata(samples: Sample[]) {
  return samples.map((s: any) => {
    return {
      ...s.hasMetadataSampleMetadata[0],
      revisable: s.revisable,
    };
  });
}

export const SamplesList: FunctionComponent<ISampleListProps> = ({
  searchVariables,
  height,
  setUnsavedChanges,
  exportFileName,
  sampleQueryParamFieldName,
  sampleQueryParamValue,
}) => {
  const { loading, error, data, startPolling, stopPolling, refetch } =
    useFindSamplesByInputValueQuery({
      variables: {
        ...(searchVariables
          ? {
              where: {
                ...searchVariables,
              },
            }
          : {
              first: max_rows,
            }),
        options: {
          sort: [{ importDate: SortDirection.Desc }],
          limit: 1,
        },
      },
      pollInterval: POLLING_INTERVAL,
    });

  const [val, setVal] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [changes, setChanges] = useState<SampleChange[]>([]);
  const [editMode, setEditMode] = useState(true);
  const gridRef = useRef<any>(null);

  useEffect(() => {
    gridRef.current?.api?.showLoadingOverlay();
    async function refetchSearchVal() {
      await refetch({
        where: {
          hasMetadataSampleMetadata_SOME: {
            OR: sampleFilterWhereVariables(parseSearchQueries(searchVal)),
            ...(sampleQueryParamFieldName && sampleQueryParamValue
              ? {
                  [sampleQueryParamFieldName]: sampleQueryParamValue,
                }
              : {}),
          },
        },
      });
    }
    refetchSearchVal().then(() => {
      gridRef.current?.api?.hideOverlay();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVal]);

  if (loading)
    return (
      <div className={"centralSpinner"}>
        <Spinner fadeIn={"none"} color={"lightblue"} name="ball-grid-pulse" />
      </div>
    );

  if (error) return <Row>Error loading request details / request samples</Row>;

  const samples = data!.samplesConnection.edges.map((e) => e.node) as Sample[];

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

      setUnsavedChanges?.(true);
    }
  };

  const handleDiscardChanges = () => {
    setEditMode(false);

    setTimeout(() => {
      startPolling(POLLING_INTERVAL);
    }, 10000);

    setUnsavedChanges?.(false);
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

      <AlertModal
        show={showAlertModal}
        onHide={() => {
          setShowAlertModal(false);
        }}
        title={"Limit reached"}
        content={
          "You've reached the maximum number of samples that can be displayed. Please refine your search to see more samples."
        }
      />

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
            placeholder="Search samples"
            aria-label="Search"
            value={val}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setSearchVal(val);
              }
            }}
            onInput={(event) => {
              const newVal = event.currentTarget.value;
              if (newVal === "") {
                setSearchVal("");
              }
              setVal(newVal);
            }}
          />
        </Col>

        <Col md="auto" style={{ marginLeft: -15 }}>
          <Tooltip
            title={
              <span style={{ fontSize: 12 }}>
                After inputting your search query, click on &quot;Search&quot;
                or press &quot;Enter&quot; to get your results. To bulk search,
                input a list of values separated by spaces or commas (e.g.
                &quot;value1 value2 value3&quot;)
              </span>
            }
          >
            <InfoIcon style={{ fontSize: 18, color: "grey" }} />
          </Tooltip>
        </Col>

        <Col md="auto" style={{ marginLeft: -15 }}>
          <Button
            onClick={() => {
              setSearchVal(val);
            }}
            className={"btn btn-secondary"}
            size={"sm"}
          >
            Search
          </Button>
        </Col>

        <Col className={"text-start"}>
          {remoteCount === max_rows
            ? `${max_rows}+ matching samples`
            : `${remoteCount} matching samples`}
        </Col>

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
            Generate Report
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
                "validation-error": function (params) {
                  const validationStatus =
                    params.data?.hasStatusStatuses[0]?.validationStatus;
                  return (
                    params.data?.revisable === true &&
                    (validationStatus === false ||
                      validationStatus === undefined)
                  );
                },
              }}
              columnDefs={SampleDetailsColumns}
              rowData={getSampleMetadata(samples)}
              onCellEditRequest={onCellValueChanged}
              readOnlyEdit={true}
              defaultColDef={defaultSamplesColDef}
              ref={gridRef}
              context={{
                getChanges: () => changes,
              }}
              enableRangeSelection={true}
              onGridReady={(params) => {
                params.api.sizeColumnsToFit();
              }}
              onFirstDataRendered={(params) => {
                params.columnApi.autoSizeAllColumns();
              }}
              tooltipShowDelay={0}
              tooltipHideDelay={60000}
              onBodyScrollEnd={(params) => {
                if (params.api.getLastDisplayedRow() + 1 === max_rows) {
                  setShowAlertModal(true);
                }
              }}
            />
          </div>
        )}
      </AutoSizer>
    </>
  );
};
