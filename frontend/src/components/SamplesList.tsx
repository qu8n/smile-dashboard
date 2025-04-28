import {
  AgGridSortDirection,
  DashboardRecordContext,
  DashboardRecordFilter,
  DashboardRecordSort,
  QueryDashboardSamplesArgs,
  useDashboardSamplesLazyQuery,
} from "../generated/graphql";
import AutoSizer from "react-virtualized-auto-sizer";
import { Button, Col, Container } from "react-bootstrap";
import { Dispatch, SetStateAction, useCallback, useRef } from "react";
import { DownloadModal } from "./DownloadModal";
import { groupChangesByPrimaryId, UpdateModal } from "./UpdateModal";
import { AlertModal } from "./AlertModal";
import { buildTsvString } from "../utils/stringBuilders";
import {
  CACHE_BLOCK_SIZE,
  MAX_ROWS_EXPORT,
  MAX_ROWS_EXPORT_WARNING,
  SampleChange,
  defaultColDef,
  formatDate,
  isValidCostCenter,
} from "../shared/helpers";
import { AgGridReact } from "ag-grid-react";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import {
  CellValueChangedEvent,
  ColDef,
  IServerSideGetRowsParams,
} from "ag-grid-community";
import { ErrorMessage, Toolbar } from "../shared/tableElements";
import styles from "./records.module.scss";
import { getUserEmail } from "../utils/getUserEmail";
import { openLoginPopup } from "../utils/openLoginPopup";
import { Title } from "../shared/components/Title";
import { BreadCrumb } from "../shared/components/BreadCrumb";
import { useParams } from "react-router-dom";
import { DataName } from "../shared/types";
import { parseUserSearchVal } from "../utils/parseSearchQueries";

const POLLING_INTERVAL = 5000; // 5s
const POLLING_PAUSE_AFTER_UPDATE = 12000; // 12s

const COST_CENTER_VALIDATION_ALERT =
  "Please update your Cost Center/Fund Number input as #####/##### (5 digits, a forward slash, then 5 digits). For example: 12345/12345.";

const DEFAULT_SORT: DashboardRecordSort = {
  colId: "importDate",
  sort: AgGridSortDirection.Desc,
};

interface ISampleListProps {
  columnDefs: ColDef[];
  setUnsavedChanges?: (unsavedChanges: boolean) => void;
  parentDataName?: DataName;
  sampleContext?: DashboardRecordContext;
  userEmail?: string | null;
  setUserEmail?: Dispatch<SetStateAction<string | null>>;
  customToolbarUI?: JSX.Element;
  exportDropdownItems?: Array<{
    label: string;
    columnDefs: ColDef[];
  }>;
}

export default function SamplesList({
  columnDefs,
  parentDataName,
  sampleContext,
  setUnsavedChanges,
  userEmail,
  setUserEmail,
  customToolbarUI,
  exportDropdownItems,
}: ISampleListProps) {
  const [userSearchVal, setUserSearchVal] = useState<string>("");
  const [changes, setChanges] = useState<SampleChange[]>([]);

  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [alertContent, setAlertContent] = useState<string | null>(null);
  const [columnDefsForExport, setColumnDefsForExport] =
    useState<ColDef[]>(columnDefs);

  const gridRef = useRef<AgGridReactType>(null);
  const params = useParams();
  const hasParams = Object.keys(params).length > 0;

  const [, { error, data, fetchMore, refetch, startPolling, stopPolling }] =
    useDashboardSamplesLazyQuery({
      variables: {
        searchVals: [],
        context: sampleContext,
        sort: DEFAULT_SORT,
        limit: CACHE_BLOCK_SIZE,
        offset: 0,
      },
      pollInterval: POLLING_INTERVAL,
    });

  const samples = data?.dashboardSamples;
  const sampleCount = data?.dashboardSamples[0]?._total || 0;

  const getServerSideDatasource = useCallback(
    ({ userSearchVal, sampleContext }) => {
      return {
        getRows: async (params: IServerSideGetRowsParams) => {
          let filters: DashboardRecordFilter[] | undefined;
          const filterModel = params.request.filterModel;
          if (filterModel && Object.keys(filterModel).length > 0) {
            filters = Object.entries(filterModel).map(([key, value]) => ({
              field: key,
              // Flexibly handle AG Grid's `any` type for filter settings by JSON.parse() this string value,
              // then check the field name before consuming it at the GraphQL server (see https://stackoverflow.com/a/45601881)
              filter: JSON.stringify(value),
            }));
          } else {
            filters = undefined; // all filter values are selected
          }

          const fetchInput = {
            searchVals: parseUserSearchVal(userSearchVal),
            sampleContext,
            sort: params.request.sortModel[0] || DEFAULT_SORT,
            filters,
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
      sampleContext,
    });
    gridRef.current?.api.setServerSideDatasource(newDatasource); // triggers a refresh
  }

  if (error) return <ErrorMessage error={error} />;

  async function onCellValueChanged(params: CellValueChangedEvent) {
    const primaryId = params.data.primaryId;
    const fieldName = params.colDef.field!;
    const { oldValue, newValue, node: rowNode } = params;

    // Prevent registering a change if no actual changes are made
    const noChangeInVal = rowNode.data[fieldName] === newValue;
    const noChangeInEmptyCell = !rowNode.data[fieldName] && !newValue;
    if (noChangeInVal || noChangeInEmptyCell) {
      const updatedChanges = changes.filter(
        (c) => !(c.primaryId === primaryId && c.fieldName === fieldName)
      );
      setChanges(updatedChanges);
      if (updatedChanges.length === 0) setUnsavedChanges?.(false);
      gridRef.current?.api?.refreshCells({ rowNodes: [rowNode] });
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
    gridRef.current?.api?.refreshCells({ rowNodes: [rowNode] });
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
              variables: {
                offset: 0,
                limit: MAX_ROWS_EXPORT,
              },
            });
            return buildTsvString(
              data.dashboardSamples,
              columnDefsForExport,
              gridRef.current?.columnApi?.getAllGridColumns()
            );
          }}
          onComplete={() => {
            setShowDownloadModal(false);
            setColumnDefsForExport(columnDefs);
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
        onDownload={() => {
          if (sampleCount && sampleCount > MAX_ROWS_EXPORT) {
            setAlertContent(MAX_ROWS_EXPORT_WARNING.content);
            setColumnDefsForExport(columnDefs);
          } else {
            setShowDownloadModal(true);
          }
        }}
        customUILeft={customToolbarUI}
        customUIRight={
          changes.length > 0 ? (
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
          ) : undefined
        }
        exportDropdownItems={exportDropdownItems}
        setColumnDefsForExport={setColumnDefsForExport}
      />

      <AutoSizer>
        {({ width }) => (
          <div
            className={`ag-theme-alpine ${
              hasParams ? styles.popupTableHeight : styles.tableHeight
            }`}
            style={{ width: width }}
          >
            <AgGridReact
              ref={gridRef}
              rowModelType="serverSide"
              serverSideInfiniteScroll={true}
              cacheBlockSize={CACHE_BLOCK_SIZE}
              columnDefs={columnDefs}
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
                "validation-error": function (params) {
                  return (
                    params.data?.revisable === true &&
                    (params.data?.validationStatus === false ||
                      params.data?.validationStatus === null)
                  );
                },
              }}
              onCellEditRequest={onCellValueChanged}
              readOnlyEdit={true}
              tooltipShowDelay={0}
              tooltipHideDelay={60000}
            />
          </div>
        )}
      </AutoSizer>
    </>
  );
}
