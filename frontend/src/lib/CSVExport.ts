import { ColDef } from "ag-grid-community";

export function CSVFormulate(rows: any[], columnDefinitions: ColDef[]) {
  const csvString = [
    columnDefinitions.map((item) => item.field).join("\t"),
    ...rows
      .map((req) =>
        columnDefinitions.map((colDef) => {
          if (colDef.valueGetter) {
            /* @ts-ignore */
            return colDef.valueGetter({
              colDef,
              data: req,
            });
          } else if (colDef.field) {
            return req[colDef.field];
          } else {
            return "-";
          }
        })
      )
      .map((e) => e.join("\t")),
  ].join("\n");
  return csvString;
}
