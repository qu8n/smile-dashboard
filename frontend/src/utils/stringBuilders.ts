import { ColDef } from "ag-grid-community";

export function buildTsvString(rows: any[], colDefs: ColDef[]) {
  const colDefsToExport = colDefs.filter(
    (colDef) => colDef.headerName !== "View Samples"
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
          return row[colDef.field];
        }
        return " ";
      })
    )
    .map((value) => value.join("\t"));

  return [colHeadersAsTsvRow, ...rowsAsTsvRows].join("\n");
}

export function buildSentenceCaseString(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
