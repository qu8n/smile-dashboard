import { StaticTableColumns } from "../pages/recentDeliveries/helpers";

export function CSVFormulate(requests) {
  const csvString = [
    StaticTableColumns.map(item => item.label).join("\t"),
    ...requests
      .map(req => StaticTableColumns.map(col => req[col.dataKey!]))
      .map(e => e.join("\t"))
  ].join("\n");

  console.log(csvString);

  return csvString;
}
