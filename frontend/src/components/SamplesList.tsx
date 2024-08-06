import {
  SortDirection,
  Sample,
  SampleWhere,
  useSamplesListQuery,
  SamplesListQuery,
} from "../generated/graphql";
import AutoSizer from "react-virtualized-auto-sizer";
import { Button, Col, Container } from "react-bootstrap";
import { Dispatch, SetStateAction, useEffect, useMemo, useRef } from "react";
import { DownloadModal } from "./DownloadModal";
import { UpdateModal } from "./UpdateModal";
import { AlertModal } from "./AlertModal";
import { buildTsvString } from "../utils/stringBuilders";
import {
  SampleChange,
  defaultColDef,
  getSamplePopupParamId,
  handleSearch,
  isValidCostCenter,
} from "../shared/helpers";
import { AgGridReact } from "ag-grid-react";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { CellValueChangedEvent, ColDef } from "ag-grid-community";
import { ErrorMessage, LoadingSpinner, Toolbar } from "../shared/tableElements";
import styles from "./records.module.scss";
import { getUserEmail } from "../utils/getUserEmail";
import { openLoginPopup } from "../utils/openLoginPopup";
import { Title } from "../shared/components/Title";
import { BreadCrumb } from "../shared/components/BreadCrumb";
import { useParams } from "react-router-dom";
import { DataName } from "../shared/types";

const POLLING_INTERVAL = 2000;
const MAX_ROWS = 500;
const ROW_LIMIT_ALERT_CONTENT =
  "You've reached the maximum number of samples that can be displayed. Please refine your search to see more samples.";
const COST_CENTER_ALERT_CONTENT =
  "Please update your Cost Center/Fund Number input as #####/##### (5 digits, a forward slash, then 5 digits). For example: 12345/12345.";
const TEMPO_EVENT_OPTIONS = {
  sort: [{ date: SortDirection.Desc }],
  limit: 1,
};

interface ISampleListProps {
  columnDefs: ColDef[];
  prepareDataForAgGrid?: (samples: SamplesListQuery["samples"]) => any[];
  setUnsavedChanges?: (unsavedChanges: boolean) => void;
  parentDataName?: DataName;
  parentWhereVariables?: SampleWhere;
  refetchWhereVariables: (parsedSearchVals: string[]) => SampleWhere;
  sampleKeyForUpdate?: keyof Sample;
  userEmail?: string | null;
  setUserEmail?: Dispatch<SetStateAction<string | null>>;
  customToolbarUI?: JSX.Element;
}

export default function SamplesList({
  columnDefs,
  prepareDataForAgGrid,
  parentDataName,
  parentWhereVariables,
  refetchWhereVariables,
  setUnsavedChanges,
  sampleKeyForUpdate = "hasMetadataSampleMetadata",
  userEmail,
  setUserEmail,
  customToolbarUI,
}: ISampleListProps) {
  const { loading, error, data, startPolling, stopPolling, refetch } =
    useSamplesListQuery({
      variables: {
        where: parentWhereVariables || {},
        options: {
          limit: MAX_ROWS,
        },
        sampleMetadataOptions: {
          sort: [{ importDate: SortDirection.Desc }],
          limit: 1,
        },
        bamCompletesOptions: TEMPO_EVENT_OPTIONS,
        mafCompletesOptions: TEMPO_EVENT_OPTIONS,
        qcCompletesOptions: TEMPO_EVENT_OPTIONS,
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
  const [alertContent, setAlertContent] = useState(ROW_LIMIT_ALERT_CONTENT);
  const [rowCount, setRowCount] = useState(0);

  const gridRef = useRef<AgGridReactType>(null);
  const params = useParams();

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

  useEffect(() => {
    setRowCount(data?.samplesConnection.totalCount || 0);
  }, [data]);

  const samples = data?.samples;
  console.log(samples);

  const popupParamId = useMemo(() => {
    if (parentWhereVariables && samples && params) {
      return getSamplePopupParamId(
        parentWhereVariables,
        samples,
        Object.values(params)?.[0]!
      );
    }
    return undefined;
  }, [parentWhereVariables, params, samples]);

  if (loading) return <LoadingSpinner />;

  if (error) return <ErrorMessage error={error} />;

  async function onCellValueChanged(params: CellValueChangedEvent) {
    if (!editMode) return;

    const primaryId = params.data.primaryId;
    const fieldName = params.colDef.field!;
    const { oldValue, newValue, node: rowNode } = params;

    function resetAlertIfCostCentersAreAllValid(changes: SampleChange[]) {
      const allRowsHaveValidCostCenter = changes.every(
        (c) => c.fieldName !== "costCenter" || isValidCostCenter(c.newValue)
      );
      if (allRowsHaveValidCostCenter) setAlertContent(ROW_LIMIT_ALERT_CONTENT);
    }

    // prevent registering a change if no actual changes are made
    const noChangeInVal = rowNode.data[fieldName] === newValue;
    const noChangeInEmptyCell = !rowNode.data[fieldName] && !newValue;
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
        setAlertContent(COST_CENTER_ALERT_CONTENT);
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
      <Container fluid>
        {!parentWhereVariables && <BreadCrumb currPageTitle="samples" />}
        <Title
          text={
            popupParamId
              ? `Viewing ${parentDataName?.slice(
                  0,
                  -1
                )} ${popupParamId}'s samples`
              : "samples"
          }
        />
      </Container>

      {showDownloadModal && (
        <DownloadModal
          loader={() => {
            return Promise.resolve(
              buildTsvString(
                prepareDataForAgGrid
                  ? prepareDataForAgGrid(samples!)
                  : samples!,
                columnDefs
              )
            );
          }}
          onComplete={() => {
            setShowDownloadModal(false);
          }}
          exportFileName={[
            parentDataName?.slice(0, -1),
            popupParamId,
            "samples.tsv",
          ]
            .filter(Boolean)
            .join("_")}
        />
      )}

      {showUpdateModal && (
        <UpdateModal
          changes={changes}
          samples={samples!}
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
        matchingResultsCount={`${rowCount.toLocaleString()} matching samples`}
        handleDownload={() => setShowDownloadModal(true)}
        customUILeft={customToolbarUI}
        customUIRight={
          changes.length > 0 ? (
            <>
              <Col md="auto">
                <Button
                  className={"btn btn-secondary"}
                  onClick={handleDiscardChanges}
                  size={"sm"}
                >
                  Discard Changes
                </Button>{" "}
                <Button
                  className={"btn btn-success"}
                  disabled={alertContent === COST_CENTER_ALERT_CONTENT}
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
            className={`ag-theme-alpine ${
              parentWhereVariables
                ? styles.popupTableHeight
                : styles.tableHeight
            }`}
            style={{ width: width }}
          >
            <AgGridReact
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
                  return (
                    params.data?.revisable === true &&
                    (params.data?.validationStatus === false ||
                      params.data?.validationStatus === undefined)
                  );
                },
              }}
              columnDefs={columnDefs}
              rowData={
                prepareDataForAgGrid ? prepareDataForAgGrid(samples!) : samples!
              }
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
                if (params.api.getLastDisplayedRow() + 1 === MAX_ROWS) {
                  setShowAlertModal(true);
                }
              }}
              onFilterChanged={(params) => {
                setRowCount(params.api.getDisplayedRowCount());
              }}
            />
          </div>
        )}
      </AutoSizer>
    </>
  );
}
