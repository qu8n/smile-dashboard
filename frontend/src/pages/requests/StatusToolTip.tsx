import { ITooltipParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

export const StatusTooltip = (props: ITooltipParams) => {
  const data = props.api.getDisplayedRowAtIndex(props.rowIndex!)!.data;

  const columnDefs = [
    {
      field: "fieldName",
      headerName: "Field Name",
    },
    {
      field: "report",
      headerName: "Report",
      wrapText: true,
      autoHeight: true,
      flex: 2,
      cellStyle: { wordBreak: "break-word" },
    },
  ];

  let { validationStatus, validationReport } = data.hasStatusStatuses[0];

  let validationReportMap = new Map();
  try {
    validationReportMap = new Map(Object.entries(JSON.parse(validationReport)));
  } catch (e) {
    const cleanedReport = validationReport.replace(/[{}]/g, "");
    const reportArray = cleanedReport.split(",");
    for (const r of reportArray) {
      const [key, value] = r.split("=").map((str: String) => str.trim());
      validationReportMap.set(key, value);
    }
  }

  const validationReportList = Array.from(
    validationReportMap,
    ([fieldName, report]) => ({ fieldName, report })
  );

  validationReportList.map((reportObj) => {
    reportObj.fieldName = toSentenceCase(reportObj.fieldName);
    reportObj.report = toSentenceCase(reportObj.report);
    return reportObj;
  });

  if (!validationStatus) {
    return (
      <div className="tooltip-styles">
        <p>Error report for {`${data?.primaryId}`}</p>
        <div className="ag-theme-alpine" style={{ height: 300, width: 550 }}>
          <AgGridReact
            rowData={validationReportList}
            columnDefs={columnDefs}
            onFirstDataRendered={(params) => {
              params.columnApi.autoSizeColumn("fieldName");
            }}
          ></AgGridReact>
        </div>
      </div>
    );
  } else {
    return "";
  }
};

function toSentenceCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
