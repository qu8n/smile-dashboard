import {
  SortDirection,
  Sample,
  SampleWhere,
  useFindSamplesByInputValueQuery,
} from "../generated/graphql";
import AutoSizer from "react-virtualized-auto-sizer";
import { Button, Col } from "react-bootstrap";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { DownloadModal } from "./DownloadModal";
import { UpdateModal } from "./UpdateModal";
import { AlertModal } from "./AlertModal";
import { CSVFormulate } from "../utils/CSVExport";
import {
  SampleChange,
  SampleMetadataExtended,
  defaultColDef,
  handleSearch,
  isValidCostCenter,
} from "../shared/helpers";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { CellValueChangedEvent, ColDef } from "ag-grid-community";
import { ErrorMessage, LoadingSpinner, Toolbar } from "../shared/tableElements";
import styles from "./records.module.scss";
import { getUserEmail } from "../utils/getUserEmail";
import { openLoginPopup } from "../utils/openLoginPopup";
import _ from "lodash";

const POLLING_INTERVAL = 2000;
const max_rows = 500;
const defaultAlertContent =
  "You've reached the maximum number of samples that can be displayed. Please refine your search to see more samples.";
const costCenterAlertContent =
  "Please update your Cost Center/Fund Number input as #####/##### (5 digits, a forward slash, then 5 digits). For example: 12345/12345.";

interface ISampleListProps {
  columnDefs: ColDef[];
  prepareDataForAgGrid: (samples: Sample[]) => any[];
  setUnsavedChanges?: (unsavedChanges: boolean) => void;
  parentWhereVariables?: SampleWhere;
  refetchWhereVariables: (parsedSearchVals: string[]) => SampleWhere;
  exportFileName?: string;
  sampleKeyForUpdate?: keyof Sample;
  userEmail?: string | null;
  setUserEmail?: Dispatch<SetStateAction<string | null>>;
}

export default function SamplesList({
  columnDefs,
  prepareDataForAgGrid,
  parentWhereVariables,
  refetchWhereVariables,
  setUnsavedChanges,
  exportFileName,
  sampleKeyForUpdate = "hasMetadataSampleMetadata",
  userEmail,
  setUserEmail,
}: ISampleListProps) {
  const { loading, error, data, startPolling, stopPolling, refetch } =
    useFindSamplesByInputValueQuery({
      variables: {
        ...(parentWhereVariables
          ? {
              where: {
                ...parentWhereVariables,
              },
            }
          : {
              first: max_rows,
            }),
        sampleMetadataOptions: {
          sort: [{ importDate: SortDirection.Desc }],
          limit: 1,
        },
        bamCompletesOptions: {
          sort: [{ date: SortDirection.Desc }],
          limit: 1,
        },
        mafCompletesOptions: {
          sort: [{ date: SortDirection.Desc }],
          limit: 1,
        },
        qcCompletesOptions: {
          sort: [{ date: SortDirection.Desc }],
          limit: 1,
        },
      },
      pollInterval: POLLING_INTERVAL,
    });

  const [userSearchVal, setUserSearchVal] = useState<string>("");
  const [parsedSearchVals, setParsedSearchVals] = useState<string[]>([]);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [changes, setChanges] = useState<SampleChange[]>([]);
  const [editMode, setEditMode] = useState(true);
  const [alertContent, setAlertContent] = useState(defaultAlertContent);

  const gridRef = useRef<any>(null);

  useEffect(() => {
    gridRef.current?.api?.showLoadingOverlay();
    async function refetchSearchVal() {
      await refetch({
        where: refetchWhereVariables(parsedSearchVals),
      });
    }
    refetchSearchVal().then(() => {
      gridRef.current?.api?.hideOverlay();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedSearchVals]);

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorMessage error={error} />;

  const samples = data!.samplesConnection.edges.map((e) => e.node) as Sample[];

  const remoteCount = samples.length;

  async function onCellValueChanged(params: CellValueChangedEvent) {
    if (!editMode) return;

    const primaryId = params.data.primaryId;
    const fieldName = params.colDef.field!;
    const { oldValue, newValue, node: rowNode } = params;

    function resetAlertIfCostCentersAreAllValid(changes: SampleChange[]) {
      const allRowsHaveValidCostCenter = changes.every(
        (c) => c.fieldName !== "costCenter" || isValidCostCenter(c.newValue)
      );
      if (allRowsHaveValidCostCenter) setAlertContent(defaultAlertContent);
    }

    // prevent registering a change if no actual changes are made
    const noChangeInVal = rowNode.data[fieldName] === newValue;
    const noChangeInEmptyCell =
      _.isEmpty(rowNode.data[fieldName]) && _.isEmpty(newValue);
    if (noChangeInVal || noChangeInEmptyCell) {
      const updatedChanges = changes.filter(
        (c) => !(c.primaryId === primaryId && c.fieldName === fieldName)
      );
      setChanges(updatedChanges);
      if (updatedChanges.length === 0) setUnsavedChanges?.(false);
      resetAlertIfCostCentersAreAllValid(updatedChanges);
      return;
    }

    // add/update the billedBy cell to/in the changes array
    if (fieldName === "billed" && setUserEmail) {
      let currUserEmail = userEmail;

      if (!currUserEmail) {
        currUserEmail = await new Promise<string | null>((resolve) => {
          window.addEventListener("message", handleLogin);

          function handleLogin(event: MessageEvent) {
            if (event.data === "success") {
              getUserEmail().then((email) => {
                window.removeEventListener("message", handleLogin);
                resolve(email);
              });
            }
          }

          openLoginPopup();
        });

        if (!currUserEmail) return;
        setUserEmail(currUserEmail);
      }

      const currUsername = currUserEmail.split("@")[0];

      setChanges((changes) => {
        const billedBy = changes.find(
          (c) => c.primaryId === primaryId && c.fieldName === "billedBy"
        );
        if (billedBy) {
          billedBy.newValue = currUsername;
        } else {
          changes.push({
            primaryId,
            fieldName: "billedBy",
            oldValue: "",
            newValue: currUsername,
            rowNode,
          });
        }
        return [...changes];
      });
    }

    // add/update the edited cell to/in the changes array
    setChanges((changes) => {
      const change = changes.find(
        (c) => c.primaryId === primaryId && c.fieldName === fieldName
      );
      if (change) {
        change.newValue = newValue;
      } else {
        changes.push({ primaryId, fieldName, oldValue, newValue, rowNode });
      }
      return [...changes];
    });

    // validate Cost Center inputs
    if (fieldName === "costCenter") {
      if (!isValidCostCenter(newValue)) {
        setAlertContent(costCenterAlertContent);
        setShowAlertModal(true);
      } else {
        resetAlertIfCostCentersAreAllValid(changes);
      }
    }

    setUnsavedChanges?.(true);
  }

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
              CSVFormulate(prepareDataForAgGrid(samples), columnDefs)
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
          sampleKeyForUpdate={sampleKeyForUpdate}
        />
      )}

      <AlertModal
        show={showAlertModal}
        onHide={() => {
          setShowAlertModal(false);
        }}
        title={"Warning"}
        content={alertContent}
      />

      <Toolbar
        dataName={"samples"}
        userSearchVal={userSearchVal}
        setUserSearchVal={setUserSearchVal}
        handleSearch={() => handleSearch(userSearchVal, setParsedSearchVals)}
        clearUserSearchVal={() => {
          setUserSearchVal("");
          setParsedSearchVals([]);
        }}
        matchingResultsCount={
          remoteCount === max_rows
            ? `${max_rows}+ matching samples`
            : `${remoteCount} matching samples`
        }
        handleDownload={() => setShowDownloadModal(true)}
        customUI={
          changes.length > 0 ? (
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
                  disabled={alertContent === costCenterAlertContent}
                  onClick={() => {
                    setShowUpdateModal(true);
                  }}
                  size={"sm"}
                >
                  Submit Updates
                </Button>
              </Col>
            </>
          ) : undefined
        }
      />

      <AutoSizer>
        {({ width }) => (
          <div
            className={`ag-theme-alpine ${styles.tableHeight}`}
            style={{ width: width }}
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
              columnDefs={columnDefs}
              rowData={prepareDataForAgGrid(samples)}
              onCellEditRequest={onCellValueChanged}
              readOnlyEdit={true}
              defaultColDef={defaultColDef}
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
}
