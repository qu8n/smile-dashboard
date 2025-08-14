import { AgGridReact } from "ag-grid-react";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { RefObject, ClipboardEvent } from "react";
import {
  CellEditRequestEvent,
  ColDef,
  ITooltipParams,
} from "ag-grid-community";
import { useNavigate } from "react-router-dom";
import { createCustomHeader, lockIcon } from "../configs/gridIcons";
import { SampleChange } from "../types";
import { CACHE_BLOCK_SIZE } from "../config";
import { allEditableFields } from "../pages/samples/config";

function getTooltipValue(params: ITooltipParams) {
  if (!params.colDef || !("field" in params.colDef)) return undefined;
  const field = params.colDef.field;
  if (
    (field === "cancerType" || field === "cancerTypeDetailed") &&
    params.value === "N/A"
  ) {
    return (
      "This code might have changed between different versions of the Oncotree API. " +
      "For more details, visit oncotree.mskcc.org/mapping"
    );
  }
  if (
    allEditableFields.has(field!) &&
    params.data?.sampleCategory === "clinical"
  ) {
    return "Clinical samples are not editable";
  }
  if (!allEditableFields.has(field!)) {
    return "This column is read-only";
  }
}

const defaultColDef: ColDef = {
  sortable: true,
  resizable: true,
  editable: false,
  headerComponentParams: createCustomHeader(lockIcon),
  valueFormatter: (params) => (params.value === "null" ? "" : params.value),
  tooltipValueGetter: (params: ITooltipParams) => getTooltipValue(params),
};

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

interface DataGridPropsBase {
  gridRef: RefObject<AgGridReactType<any>>;
  columnDefs: Array<ColDef<any>>;
  onGridColumnsChanged: () => void;
}

type DataGridProps = DataGridPropsBase &
  // Ensure that either all editing props are used or none are
  (EditableGridProps | NonEditableGridProps);

export function DataGrid({
  gridRef,
  columnDefs,
  onGridColumnsChanged,
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
        onGridColumnsChanged={onGridColumnsChanged}
        context={{
          getChanges: () => changes,
          navigateFunction: navigate,
        }}
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
