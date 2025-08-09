import { AgGridReact } from "ag-grid-react";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import AutoSizer from "react-virtualized-auto-sizer";
import styles from "./records.module.scss";
import { handleAgGridPaste } from "../utils/handleAgGridPaste";
import { RefObject, ClipboardEvent, useState } from "react";
import { CellEditRequestEvent, ColDef } from "ag-grid-community";
import {
  CACHE_BLOCK_SIZE,
  defaultColDef,
  isValidCostCenter,
  SampleChange,
} from "../shared/helpers";
import { getUserEmail } from "../utils/getUserEmail";
import { openLoginPopup } from "../utils/openLoginPopup";
import { useUserEmail } from "../contexts/UserEmailContext";
import { useWarningModal } from "../contexts/WarningContext";

const INVALID_COST_CENTER_WARNING =
  "Please update your Cost Center/Fund Number input as #####/##### " +
  "(5 digits, a forward slash, then 5 digits). For example: 12345/12345.";

interface DataGridProps {
  /**
   * Reference to the AgGridReact component. Used to access the grid API
   * and perform actions like updating the grid with new data.
   */
  gridRef: RefObject<AgGridReactType<any>>;
  /**
   * Indicates whether there is an active URL path. If so, adjust
   * the grid height to fit the popup view. For example, the Request Samples
   * view has the URL path `<requestId>` in the URL `/requests/<requestId>`
   */
  hasUrlPath?: boolean;
  /**
   * Column definitions for the grid. This is an array of column definitions
   * that define how the grid should display data.
   */
  columnDefs: Array<ColDef<any>>;
  handleGridColumnsChanged: () => void;
}

export function DataGrid({
  gridRef,
  hasUrlPath = false,
  columnDefs,
  handleGridColumnsChanged,
}: DataGridProps) {
  const { userEmail, setUserEmail } = useUserEmail();
  const { setWarningModalContent } = useWarningModal();
  const [changes, setChanges] = useState<SampleChange[]>([]);

  async function handleCellEditRequest(params: CellEditRequestEvent) {
    const primaryId = params.data.primaryId;
    const fieldName = params.colDef.field!;
    const { oldValue, newValue, node: rowNode } = params;

    // Prevent registering a change if no actual changes are made
    const noChangeInVal = rowNode.data[fieldName] === newValue;
    const noChangeInEmptyCell = !rowNode.data[fieldName] && !newValue;
    if (noChangeInVal || noChangeInEmptyCell) {
      setChanges((prevChanges) => {
        const updatedChanges = prevChanges.filter(
          (c) => !(c.primaryId === primaryId && c.fieldName === fieldName)
        );
        // TODO: test that this is ok
        //
        // if (updatedChanges.length === 0) setUnsavedChanges?.(false);
        return updatedChanges;
      });
      gridRef.current?.api?.redrawRows({ rowNodes: [rowNode] });
      return;
    }

    // Add/update the billedBy cell to/in the changes array
    if (fieldName === "billed" && setUserEmail) {
      let currUserEmail = userEmail;

      if (!currUserEmail) {
        currUserEmail = await new Promise<string | undefined>((resolve) => {
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
      setWarningModalContent(INVALID_COST_CENTER_WARNING);
    }

    // TODO: wherever setUnsavedChanges is used, change the logic to check changes array length
    //
    // setUnsavedChanges?.(true);
    gridRef.current?.api?.redrawRows({ rowNodes: [rowNode] });
  }

  async function handlePaste(e: ClipboardEvent<HTMLDivElement>) {
    try {
      await handleAgGridPaste({ e, gridRef, handleCellEditRequest });
    } catch (error) {
      if (error instanceof Error) {
        setWarningModalContent(error.message);
      } else {
        console.error("Unexpected error during paste:", error);
      }
    }
  }

  return (
    <AutoSizer>
      {({ width }) => {
        return (
          <div
            className={`ag-theme-alpine ${
              hasUrlPath ? styles.popupTableHeight : styles.tableHeight
            }`}
            style={{ width }}
            onPaste={handlePaste}
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
              // TODO: test that we can remove. Samples tabs change cols but we fetch all data at once
              // Why should we refresh data on column change?
              // Currently used for the initial data fetch when columns are set programmatically
              // and Samples page "tab" changes
              //
              onGridColumnsChanged={handleGridColumnsChanged}
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
  );
}
