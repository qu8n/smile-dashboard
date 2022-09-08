import jsdownload from "js-file-download";
import { StaticTableColumns } from "../pages/recentDeliveries/helpers";

export function CSVGenerate(requests) {
  const csvString = [
    StaticTableColumns.map(item => item.label),
    requests.map(req => StaticTableColumns.map(col => req[col.dataKey!]))
  ]

    .map(e => e.join("\t"))
    .join("\n");

  jsdownload(csvString, "report.csv");
}
