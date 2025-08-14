import { ColDef, RowNode } from "ag-grid-community";

export interface SampleChange {
  primaryId: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  rowNode: RowNode;
}

export interface BuildDownloadOptionsParamsBase {
  getCurrentData: () => Promise<Array<any>>;
  currentColumnDefs: Array<ColDef<any>>;
}
