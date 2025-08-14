import { RefObject, useState } from "react";
import jsdownload from "js-file-download";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { QueryResult } from "@apollo/client";
import { parseUserSearchVal } from "../utils/parseSearchQueries";
import { ColDef, Column } from "ag-grid-community";

export interface DownloadOption {
  buttonLabel: string;
  columnDefsForDownload: Array<ColDef>;
  /**
   * Async function that fetches the data to be downloaded.
   * Usage: pass in `getCurrentData` from the `useDownload` hook to fetch the
   * current search results on the page, or create your own function to fetch
   * data for other purposes.
   */
  dataGetter: () => Promise<Array<any>>;
  tooltipContent?: string;
  disabled?: boolean;
}

interface UseDownloadParams {
  gridRef: RefObject<AgGridReactType>;
  downloadFileName: string;
  fetchMore: QueryResult["fetchMore"];
  userSearchVal: string;
  recordCount: number;
  queryName: string;
}

export function useDownload<T>({
  gridRef,
  downloadFileName,
  fetchMore,
  userSearchVal,
  recordCount,
  queryName,
}: UseDownloadParams) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload(downloadOption: DownloadOption) {
    setIsDownloading(true);
    const data = await downloadOption.dataGetter();
    const tsvString = buildTsvString({
      rows: data,
      colDefs: downloadOption.columnDefsForDownload,
      columns: gridRef.current?.columnApi.getAllGridColumns() || [],
    });
    jsdownload(tsvString, `${downloadFileName}.tsv`);
    setIsDownloading(false);
  }

  /**
   * Used by DownloadOption.dataGetter to fetch all data for the
   * current search value.
   */
  async function getCurrentData(): Promise<Array<T>> {
    const { data } = await fetchMore<Record<string, Array<T>>>({
      variables: {
        searchVals: parseUserSearchVal(userSearchVal),
        offset: 0,
        limit: recordCount,
      },
    });
    return data[queryName];
  }

  return {
    isDownloading,
    handleDownload,
    getCurrentData,
  };
}

interface BuildTsvStringParams {
  rows: Array<any>;
  columns: Array<Column>;
  colDefs: Array<ColDef>;
}

function buildTsvString({
  rows,
  columns,
  colDefs,
}: BuildTsvStringParams): string {
  const fieldsHiddenByUser =
    columns?.filter((col) => !col.isVisible()).map((col) => col.getColId()) ??
    [];

  const colDefsToExport = colDefs.filter(
    ({ field, hide }) =>
      field && hide !== true && !fieldsHiddenByUser.includes(field)
  );

  const colHeadersAsTsvRow = colDefsToExport
    .map((item) => item.headerName)
    .join("\t");

  const rowsAsTsvRows = rows
    .map((row) =>
      colDefsToExport.map((colDef) => {
        if (colDef.valueGetter) {
          // @ts-ignore
          return colDef.valueGetter({
            colDef,
            data: row,
          });
        }
        if (colDef.field) {
          if (colDef.valueFormatter) {
            // @ts-ignore
            return colDef.valueFormatter({
              colDef,
              data: row,
              value: row[colDef.field],
            });
          }
          return row[colDef.field];
        }
        return " ";
      })
    )
    .map((value) => value.join("\t").replace(/(\r\n|\n|\r)/gm, ""));

  return [colHeadersAsTsvRow, ...rowsAsTsvRows].join("\n");
}
