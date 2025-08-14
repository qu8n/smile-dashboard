import { AgGridReact } from "ag-grid-react";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { RefObject, ClipboardEvent } from "react";
import { CellEditRequestEvent, ColDef } from "ag-grid-community";
import {
  CACHE_BLOCK_SIZE,
  defaultColDef,
  SampleChange,
} from "../shared/helpers";
import { useNavigate } from "react-router-dom";

interface EditableGridProps {
  changes: Array<SampleChange>;
  handleCellEditRequest: (params: CellEditRequestEvent) => Promise<void>;
  handlePaste: (e: ClipboardEvent<HTMLDivElement>) => void;
}

interface NonEditableGridProps {
  changes?: undefined;
  handleCellEditRequest?: undefined;
  handlePaste?: undefined;
}

type DataGridPropsBase = {
  gridRef: RefObject<AgGridReactType<any>>;
  columnDefs: Array<ColDef<any>>;
  handleGridColumnsChanged: () => void;
};

export type DataGridProps = DataGridPropsBase &
  // Ensure that either all editing props are used or none are
  (EditableGridProps | NonEditableGridProps);

export function DataGrid({
  gridRef,
  columnDefs,
  handleGridColumnsChanged,
  changes,
  handleCellEditRequest,
  handlePaste,
}: DataGridProps) {
  const navigate = useNavigate();
  return (
    <div className="ag-theme-alpine flex-grow-1" onPaste={handlePaste}>
      <AgGridReact
        ref={gridRef}
        rowModelType="serverSide"
        serverSideInfiniteScroll={true}
        cacheBlockSize={CACHE_BLOCK_SIZE}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        enableRangeSelection={true}
        onFirstDataRendered={(params) => params.columnApi.autoSizeAllColumns()}
        onGridColumnsChanged={handleGridColumnsChanged}
        context={{
          getChanges: () => changes,
          navigateFunction: navigate,
        }}
        // TODO: put this obj somewhere more appropriate
        rowClassRules={{
          unlocked: (params) => params.data?.revisable === true,
          locked: (params) => params.data?.revisable === false,
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
}
