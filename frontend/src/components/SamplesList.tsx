import {
  AgGridSortDirection,
  DashboardRecordSort,
  DashboardSamplesQueryVariables,
  QueryDashboardSamplesArgs,
  useDashboardSamplesLazyQuery,
} from "../generated/graphql";
import AutoSizer from "react-virtualized-auto-sizer";
import { Button, Col, Container } from "react-bootstrap";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { DownloadModal } from "./DownloadModal";
import { groupChangesByPrimaryId, UpdateModal } from "./UpdateModal";
import { AlertModal } from "./AlertModal";
import { buildTsvString } from "../utils/stringBuilders";
import {
  CACHE_BLOCK_SIZE,
  IExportDropdownItem,
  SampleChange,
  defaultColDef,
  formatDate,
  getColumnFilters,
  isValidCostCenter,
} from "../shared/helpers";
import { AgGridReact } from "ag-grid-react";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import {
  CellEditRequestEvent,
  ColDef,
  IServerSideGetRowsParams,
} from "ag-grid-community";
import { ErrorMessage, Toolbar } from "../shared/components/Toolbar";
import styles from "./records.module.scss";
import { getUserEmail } from "../utils/getUserEmail";
import { openLoginPopup } from "../utils/openLoginPopup";
import { Title } from "../shared/components/Title";
import { BreadCrumb } from "../shared/components/BreadCrumb";
import { useParams } from "react-router-dom";
import { DataName } from "../shared/types";
import { parseUserSearchVal } from "../utils/parseSearchQueries";
import { handleAgGridPaste } from "../utils/handleAgGridPaste";
import { Form } from "react-bootstrap";
import { Tooltip } from "@material-ui/core";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { PHI_WARNING } from "../pages/patients/PatientsPage";

const POLLING_INTERVAL = 5000; // 5s
const POLLING_PAUSE_AFTER_UPDATE = 12000; // 12s

const COST_CENTER_VALIDATION_ALERT =
  "Please update your Cost Center/Fund Number input as #####/##### (5 digits, a forward slash, then 5 digits). For example: 12345/12345.";

const DEFAULT_SORT: DashboardRecordSort = {
  colId: "importDate",
  sort: AgGridSortDirection.Desc,
};

const PHI_FIELDS = new Set(["sequencingDate"]);

interface ISampleListProps {
  columnDefs: ColDef[];
  setUnsavedChanges?: (unsavedChanges: boolean) => void;
  parentDataName?: DataName;
  sampleContexts?: DashboardSamplesQueryVariables["contexts"];
  userEmail: string | null;
  setUserEmail: Dispatch<SetStateAction<string | null>>;
  customToolbarUI?: JSX.Element;
  addlExportDropdownItems?: IExportDropdownItem[];
}

export default function SamplesList({
  columnDefs,
  parentDataName,
  sampleContexts,
  setUnsavedChanges,
  userEmail,
  setUserEmail,
  customToolbarUI,
  addlExportDropdownItems,
}: ISampleListProps) {
  const [userSearchVal, setUserSearchVal] = useState<string>("");
  const [changes, setChanges] = useState<SampleChange[]>([]);

  const [colDefs, setColDefs] = useState(columnDefs);
  const [phiEnabled, setPhiEnabled] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [alertContent, setAlertContent] = useState<string | null>(null);
  const [columnDefsForExport, setColumnDefsForExport] =
    useState<ColDef[]>(columnDefs);

  const gridRef = useRef<AgGridReactType>(null);
  const params = useParams();
  const hasParams = Object.keys(params).length > 0;

  useEffect(() => {
    async function handleLogin(event: MessageEvent) {
      if (event.data !== "success") return;
      setUserEmail(await getUserEmail());
      setAlertContent(PHI_WARNING.content);
    }
    if (phiEnabled) {
      window.addEventListener("message", handleLogin);
      if (!userEmail) openLoginPopup();
      return () => {
        window.removeEventListener("message", handleLogin);
      };
    }
  }, [phiEnabled, userEmail, setUserEmail]);

  const [, { error, data, fetchMore, refetch, startPolling, stopPolling }] =
    useDashboardSamplesLazyQuery({
      variables: {
        searchVals: [],
        contexts: sampleContexts,
        sort: DEFAULT_SORT,
        limit: CACHE_BLOCK_SIZE,
        offset: 0,
      },
      pollInterval: POLLING_INTERVAL,
    });

  const samples = data?.dashboardSamples;
  const sampleCount = data?.dashboardSamples[0]?._total || 0;

  const getServerSideDatasource = useCallback(
    ({ userSearchVal, sampleContexts }) => {
      return {
        getRows: async (params: IServerSideGetRowsParams) => {
          const fetchInput = {
            searchVals: parseUserSearchVal(userSearchVal),
            contexts: sampleContexts,
            sort: params.request.sortModel[0] || DEFAULT_SORT,
            columnFilters: getColumnFilters(params),
            offset: params.request.startRow ?? 0,
            limit: CACHE_BLOCK_SIZE,
          } as QueryDashboardSamplesArgs;

          const thisFetch =
            params.request.startRow === 0
              ? refetch(fetchInput)
              : fetchMore({
                  variables: fetchInput,
                });

          return thisFetch
            .then((result) => {
              params.success({
                rowData: result.data.dashboardSamples,
                rowCount: result.data.dashboardSamples[0]?._total || 0,
              });
            })
            .catch((error) => {
              console.error(error);
              params.fail();
            });
        },
      };
    },
    [refetch, fetchMore]
  );

  function refreshData(userSearchVal: string) {
    const newDatasource = getServerSideDatasource({
      userSearchVal,
      sampleContexts,
    });
    gridRef.current?.api.setServerSideDatasource(newDatasource); // triggers a refresh
  }

  if (error) return <ErrorMessage error={error} />;

  async function handleCellEditRequest(params: CellEditRequestEvent) {
    const primaryId = params.data.primaryId;
    const fieldName = params.colDef.field!;
    const { oldValue, newValue, node: rowNode } = params;

    // Prevent registering a change if no actual changes are made
    const noChangeInVal = rowNode.data[fieldName] === newValue;
    const noChangeInEmptyCell = !rowNode.data[fieldName] && !newValue;
    if (noChangeInVal || noChangeInEmptyCell) {
      setChanges((changes) => {
        const updatedChanges = changes.filter(
          (c) => !(c.primaryId === primaryId && c.fieldName === fieldName)
        );
        if (updatedChanges.length === 0) setUnsavedChanges?.(false);
        return updatedChanges;
      });
      gridRef.current?.api?.redrawRows({ rowNodes: [rowNode] });
      return;
    }

    // Add/update the billedBy cell to/in the changes array
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

    // Add/update the edited cell to/in the changes array
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

    // Validate Cost Center inputs
    if (fieldName === "costCenter" && !isValidCostCenter(newValue)) {
      setAlertContent(COST_CENTER_VALIDATION_ALERT);
    }

    setUnsavedChanges?.(true);
    gridRef.current?.api?.redrawRows({ rowNodes: [rowNode] });
  }

  async function handleDiscardChanges() {
    setChanges([]);
    setUnsavedChanges?.(false);
  }

  async function handleConfirmUpdates() {
    stopPolling();
    // Manually handle optimistic updates: refresh updated rows' UI to indicate them being updated
    // (We can't use GraphQL's optimistic response because it isn't a good fit for
    // AG Grid's Server-Side data model. e.g. GraphQL's optimistic response only returns
    // the updated data, while AG Grid expects the datasource == the entire dataset.)
    const changesByPrimaryId = groupChangesByPrimaryId(changes);
    const optimisticSamples = samples!.map((s) => {
      if (s.primaryId in changesByPrimaryId) {
        return {
          ...s,
          revisable: false,
          importDate: formatDate(new Date()) as string,
          ...changesByPrimaryId[s.primaryId],
        };
      }
      return s;
    });
    optimisticSamples.sort((a, b) => {
      return (
        new Date(b.importDate).getTime() - new Date(a.importDate).getTime()
      );
    });
    const optimisticDatasource = {
      getRows: (params: IServerSideGetRowsParams) => {
        params.success({
          rowData: optimisticSamples!,
          rowCount: optimisticSamples[0]?._total || 0,
        });
      },
    };
    gridRef.current?.api?.setServerSideDatasource(optimisticDatasource);

    setTimeout(async () => {
      refreshData(userSearchVal);
      startPolling(POLLING_INTERVAL);
    }, POLLING_PAUSE_AFTER_UPDATE);

    handleDiscardChanges();
  }

  const sampleColDefsWithPhiCols = columnDefs.map((col) => {
    if (col.field && PHI_FIELDS.has(col.field)) {
      return { ...col, hide: false };
    }
    return col;
  });

  return (
    <>
      <Container fluid>
        {!hasParams && <BreadCrumb currPageTitle="samples" />}
        <Title
          text={
            hasParams
              ? `Viewing ${parentDataName?.slice(0, -1)} ${
                  Object.values(params)?.[0]
                }'s samples`
              : "Samples"
          }
        />
      </Container>

      {showDownloadModal && (
        <DownloadModal
          loader={async () => {
            // Using fetchMore instead of refetch to avoid overriding the cached variables
            const { data } = await fetchMore({
              variables: { offset: 0, limit: sampleCount },
            });
            return buildTsvString(
              data.dashboardSamples,
              columnDefsForExport,
              gridRef.current?.columnApi?.getAllGridColumns()
            );
          }}
          onComplete={() => {
            setShowDownloadModal(false);
            setColumnDefsForExport(colDefs);
          }}
          exportFileName={[
            parentDataName?.slice(0, -1),
            Object.values(params)?.[0],
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
          onSuccess={handleConfirmUpdates}
          onHide={() => setShowUpdateModal(false)}
          onOpen={() => stopPolling()}
        />
      )}

      <AlertModal
        show={!!alertContent}
        onHide={() => setAlertContent(null)}
        title={"Warning"}
        content={alertContent}
      />

      <Toolbar
        dataName={"samples"}
        userSearchVal={userSearchVal}
        setUserSearchVal={setUserSearchVal}
        onSearch={(userSearchVal) => refreshData(userSearchVal)}
        matchingResultsCount={`${
          sampleCount !== undefined ? sampleCount?.toLocaleString() : "Loading"
        } matching samples`}
        onDownload={() => setShowDownloadModal(true)}
        customUILeft={customToolbarUI}
        customUIRight={
          <>
            <Col md="auto" className="mt-1">
              <div className="vr"></div>
            </Col>

            <Col md="auto" className="mt-1">
              <Form>
                <Form.Check
                  type="switch"
                  id="custom-switch"
                  label="PHI-enabled"
                  checked={phiEnabled}
                  onChange={(e) => {
                    const isPhiEnabled = e.target.checked;
                    setPhiEnabled(isPhiEnabled);
                    if (isPhiEnabled) {
                      setColDefs(sampleColDefsWithPhiCols);
                    } else {
                      setColDefs(columnDefs);
                    }
                  }}
                />
              </Form>
            </Col>

            <Col md="auto" style={{ marginLeft: -15 }}>
              <Tooltip
                title={
                  <span style={{ fontSize: 12 }}>
                    Turn on this switch to return each patient's MRN and anchor
                    sequencing date in the results. Note that this mode only
                    returns the PHI matching specific MRN, CMO, or DMP Patient
                    IDs entered in the search bar. When turning on this switch
                    for the first time, you will be prompted to log in.
                  </span>
                }
              >
                <InfoIcon style={{ fontSize: 18, color: "grey" }} />
              </Tooltip>
            </Col>
            {changes.length > 0 ? (
              <>
                <Col md="auto">
                  <Button
                    className={"btn btn-secondary"}
                    onClick={() => {
                      // Remove cell styles associated with having been edited
                      gridRef.current?.api?.redrawRows({
                        rowNodes: changes.map((c) => c.rowNode),
                      });
                      handleDiscardChanges();
                    }}
                    size={"sm"}
                  >
                    Discard Changes
                  </Button>{" "}
                  <Button
                    className={"btn btn-success"}
                    onClick={() => {
                      const hasInvalidCostCenter = changes.some(
                        (c) =>
                          c.fieldName === "costCenter" &&
                          !isValidCostCenter(c.newValue)
                      );
                      if (hasInvalidCostCenter) {
                        setAlertContent(COST_CENTER_VALIDATION_ALERT);
                      } else {
                        setShowUpdateModal(true);
                      }
                    }}
                    size={"sm"}
                  >
                    Confirm Updates
                  </Button>
                </Col>
              </>
            ) : undefined}
          </>
        }
        addlExportDropdownItems={addlExportDropdownItems}
        setColumnDefsForExport={setColumnDefsForExport}
      />

      <AutoSizer>
        {({ width }) => {
          return (
            <div
              className={`ag-theme-alpine ${
                hasParams ? styles.popupTableHeight : styles.tableHeight
              }`}
              style={{ width: width }}
              onPaste={async (e) => {
                try {
                  await handleAgGridPaste({
                    e,
                    gridRef,
                    handleCellEditRequest,
                  });
                } catch (error) {
                  if (error instanceof Error) {
                    setAlertContent(error.message);
                  } else {
                    console.error("Unexpected error during paste:", error);
                  }
                }
              }}
            >
              <AgGridReact
                ref={gridRef}
                rowModelType="serverSide"
                serverSideInfiniteScroll={true}
                cacheBlockSize={CACHE_BLOCK_SIZE}
                columnDefs={colDefs}
                defaultColDef={defaultColDef}
                enableRangeSelection={true}
                onGridReady={(params) => params.api.sizeColumnsToFit()}
                onFirstDataRendered={(params) =>
                  params.columnApi.autoSizeAllColumns()
                }
                onGridColumnsChanged={() => refreshData(userSearchVal)}
                context={{
                  getChanges: () => changes,
                }}
                rowClassRules={{
                  unlocked: function (params) {
                    return params.data?.revisable === true;
                  },
                  locked: function (params) {
                    return params.data?.revisable === false;
                  },
                }}
                onCellEditRequest={handleCellEditRequest}
                readOnlyEdit={true}
                tooltipShowDelay={0}
                tooltipHideDelay={60000}
                tooltipMouseTrack={true}
                suppressClipboardPaste={true}
              />
            </div>
          );
        }}
      </AutoSizer>
    </>
  );
}
