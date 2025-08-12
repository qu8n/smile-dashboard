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
  SampleChange,
} from "../shared/helpers";
import { useWarningModal } from "../contexts/WarningContext";

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
  changes: Array<SampleChange>;
  handleCellEditRequest: (params: CellEditRequestEvent) => Promise<void>;
}

export function DataGrid({
  gridRef,
  hasUrlPath = false,
  columnDefs,
  handleGridColumnsChanged,
  changes,
  handleCellEditRequest,
}: DataGridProps) {
  const { setWarningModalContent } = useWarningModal();

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
