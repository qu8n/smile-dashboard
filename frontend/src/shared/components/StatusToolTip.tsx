import { ITooltipParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
import { SamplesListQuery } from "../../generated/graphql";

export const StatusTooltip = (props: ITooltipParams) => {
  console.log("HELLO");
  let { primaryId, validationReport, validationStatus } =
    props.api.getDisplayedRowAtIndex(props.rowIndex!)!
      .data as SamplesListQuery["samples"][number];

  console.log(primaryId, validationReport, validationStatus);

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

  let validationReportList;

  if (validationReport !== null && validationReport !== undefined) {
    let validationReportMap = new Map();

    try {
      validationReportMap = new Map(
        Object.entries(JSON.parse(validationReport))
      );
    } catch (e) {
      const cleanedReport = validationReport.replace(/[{}]/g, "");
      const reportArray = cleanedReport.split(",");
      for (const r of reportArray) {
        const [key, value] = r.split("=").map((str: String) => str.trim());
        validationReportMap.set(key, value);
      }
    }

    validationReportList = Array.from(
      validationReportMap,
      ([fieldName, report]) => ({ fieldName, report })
    );

    validationReportList.map((reportObj) => {
      reportObj.fieldName = toSentenceCase(reportObj.fieldName);
      reportObj.report = toSentenceCase(reportObj.report);
      return reportObj;
    });
  } else {
    validationStatus = false;
    validationReportList = [
      {
        fieldName: "Data error",
        report: "Validation status is missing from this sample",
      },
    ];
  }

  if (!validationStatus) {
    return (
      <div className="tooltip-styles">
        <p>Error report for {`${primaryId}`}</p>
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
