import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import {
  CellEditRequestEvent,
  EditableCallbackParams,
  GridApi,
} from "ag-grid-community";

/**
 * Custom handler for paste events in AG Grid.
 *
 * Native paste behavior is incompatible with our use of AG Grid's Server-Side Row Model combined with
 * Read-Only Edits. It attempts to update the grid data directly, which differs from our approach of tracking
 * changes in a separate state, allowing users to review and confirm edits before sending them to the server.
 *
 * This paste handler can handle two scenarios: (confirmed with project managers)
 * - Pasting a single value into >= 1 cell in the same column
 * - Pasting multiple values into a selection of cells of the same size
 *  - This ensures intentionality and prevents accidental data edits
 */
export async function handleAgGridPaste({
  e,
  gridRef,
  handleCellEditRequest,
}: {
  e: React.ClipboardEvent<HTMLDivElement>;
  gridRef: React.RefObject<AgGridReactType>;
  handleCellEditRequest: (params: CellEditRequestEvent) => Promise<void>;
}) {
  e.preventDefault();
  if (!gridRef.current || !gridRef.current.api) return;

  const clipboardData = parseClipboardData(e);
  const gridApi = gridRef.current.api;
  let pasteArea = getPasteArea(gridApi);

  const clipboardRows = clipboardData.length;
  const clipboardCols = clipboardData[0]?.length || 0;
  const selectionRows = pasteArea.rowIndices.length;
  const selectionCols = pasteArea.colIds.length;

  const isValidSingleValuePaste =
    clipboardRows === 1 &&
    clipboardCols === 1 &&
    selectionCols === 1 &&
    selectionRows >= 1;
  const isSameSizePaste =
    clipboardRows === selectionRows && clipboardCols === selectionCols;
  if (
    clipboardRows === 0 ||
    clipboardCols === 0 ||
    selectionRows === 0 ||
    selectionCols === 0 ||
    (!isSameSizePaste && !isValidSingleValuePaste)
  ) {
    throw new Error(
      `When copying multiple values at once and pasting them into the dashboard, the copied area must match the paste area. ` +
        `Your paste action failed because your copied area has ${clipboardRows} rows and ${clipboardCols} columns, ` +
        `but your paste area has ${selectionRows} rows and ${selectionCols} columns.`
    );
  }

  if (isValidSingleValuePaste) {
    const colId = pasteArea.colIds[0];
    const clipboardValue = clipboardData[0][0];
    for (let r = 0; r < selectionRows; r++) {
      await updateCell({
        gridApi,
        handleCellEditRequest,
        rowIndex: pasteArea.rowIndices[r],
        colId,
        newValue: clipboardValue,
      });
    }
  } else {
    for (let r = 0; r < clipboardRows; r++) {
      for (let c = 0; c < clipboardCols; c++) {
        await updateCell({
          gridApi,
          handleCellEditRequest,
          rowIndex: pasteArea.rowIndices[r],
          colId: pasteArea.colIds[c],
          newValue: clipboardData[r][c],
        });
      }
    }
  }
}

function parseClipboardData(
  e: React.ClipboardEvent<HTMLDivElement>
): string[][] {
  const clipboardDataAsString = e.clipboardData.getData("text/plain");
  return clipboardDataAsString
    .split(/\r?\n/)
    .filter((row) => row.length > 0)
    .map((row) => row.split("\t"));
}

function getPasteArea(gridApi: GridApi): {
  colIds: Array<string>; // equivalent to ColDef.field's
  rowIndices: Array<number>; // 0-based row indices in the grid
} {
  let colIds: string[] = [];
  let rowIndices: number[] = [];
  // Get the first cell range only. We don't support pasting into multiple ranges
  const cellRange = gridApi.getCellRanges()?.[0];
  if (cellRange) {
    const startRow = cellRange.startRow?.rowIndex ?? 0;
    const endRow = cellRange.endRow?.rowIndex ?? 0;
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    for (let rowIndex = minRow; rowIndex <= maxRow; rowIndex++) {
      rowIndices.push(rowIndex);
    }
    colIds = cellRange.columns.map((col) => col.getColId());
  } else {
    const focusedCell = gridApi.getFocusedCell();
    if (focusedCell) {
      colIds = [focusedCell.column.getColId()];
      rowIndices = [focusedCell.rowIndex];
    }
  }
  return { colIds, rowIndices };
}

export async function updateCell({
  gridApi,
  handleCellEditRequest,
  rowIndex,
  colId,
  newValue,
}: {
  gridApi: GridApi;
  handleCellEditRequest: (params: CellEditRequestEvent) => Promise<void>;
  rowIndex: number;
  colId: string;
  newValue: any;
}) {
  const node = gridApi.getDisplayedRowAtIndex(rowIndex);
  const data = node?.data;
  const colDef = gridApi.getColumnDef(colId);
  if (
    !data ||
    !colDef ||
    !cellIsEditable({ colDef, data, node } as EditableCallbackParams)
  ) {
    return;
  }
  await handleCellEditRequest({
    node,
    data,
    colDef,
    oldValue: data[colId],
    newValue,
  } as CellEditRequestEvent);
}

function cellIsEditable(editableFuncParams: EditableCallbackParams): boolean {
  let isEditable = false;
  if (typeof editableFuncParams.colDef.editable === "function") {
    isEditable = editableFuncParams.colDef.editable(editableFuncParams);
  } else {
    isEditable = !!editableFuncParams.colDef.editable;
  }
  return isEditable;
}
