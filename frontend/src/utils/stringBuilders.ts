import { ColDef, Column } from "ag-grid-community";

// TODO: make args an obj
// TODO: if not used elsewhere, move inside useDownload hook
export function buildTsvString(
  rows: any[],
  colDefs: ColDef[],
  cols?: Column[]
) {
  const fieldsHiddenByUser =
    cols?.filter((col) => !col.isVisible()).map((col) => col.getColId()) ?? [];

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

export function buildSentenceCaseString(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
