import { RefObject, useState } from "react";
import { DownloadOption } from "../shared/components/DownloadButton";
import { buildTsvString } from "../utils/stringBuilders";
import jsdownload from "js-file-download";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";

interface UseDownloadProps {
  /**
   * A reference to the AgGridReact component.
   * Used to set the server-side datasource for the grid.
   */
  gridRef: RefObject<AgGridReactType>;
  /**
   * Used to name the downloaded file.
   */
  recordName: string;
}

export function useDownload({ gridRef, recordName }: UseDownloadProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  async function handleDownload(downloadOption: DownloadOption) {
    setIsDownloading(true);
    const data = await downloadOption.dataGetter();
    const tsvString = buildTsvString(
      data,
      downloadOption.columnDefs,
      gridRef.current?.columnApi.getAllGridColumns()
    );
    jsdownload(tsvString, `${recordName}.tsv`);
    setIsDownloading(false);
  }

  return {
    isDownloading,
    handleDownload,
  };
}
