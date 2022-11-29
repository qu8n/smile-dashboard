import { ColumnDefinition } from "../pages/requests/helpers";
import { ColDef } from "ag-grid-community";

export function CSVFormulate(requests: any[], columnDefinitions: ColDef[]) {
  const csvString = [
    columnDefinitions.map(item => item.field).join("\t"),
    ...requests
      .map(req =>
        columnDefinitions.map(col => {
          if (col.valueGetter) {
            /* @ts-ignore */
            return col.valueGetter({
              data: req
            });
          } else if (col.field) {
            return req[col.field];
          } else {
            return "-";
          }
        })
      )
      .map(e => e.join("\t"))
  ].join("\n");
  return csvString;
}
