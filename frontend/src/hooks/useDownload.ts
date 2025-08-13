import { RefObject, useState } from "react";
import { DownloadOption } from "../shared/components/DownloadButton";
import { buildTsvString } from "../utils/stringBuilders";
import jsdownload from "js-file-download";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { QueryResult } from "@apollo/client";
import { parseUserSearchVal } from "../utils/parseSearchQueries";

interface UseDownloadProps {
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
}: UseDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload(downloadOption: DownloadOption) {
    setIsDownloading(true);
    const data = await downloadOption.dataGetter();
    const tsvString = buildTsvString(
      data,
      downloadOption.columnDefs,
      gridRef.current?.columnApi.getAllGridColumns()
    );
    jsdownload(tsvString, `${downloadFileName}.tsv`);
    setIsDownloading(false);
  }

  /**
   * Used by DownloadOption.dataGetter to fetch all data for the
   * current search value.
   */
  async function getRenderedData(): Promise<Array<T>> {
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
    getRenderedData,
  };
}
