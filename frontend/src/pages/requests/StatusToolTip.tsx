import { ITooltipParams } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";

export const StatusTooltip = (props: ITooltipParams) => {
  const data = props.api!.getDisplayedRowAtIndex(props.rowIndex!)!.data;

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
    },
  ];

  let validationReportMap = new Map();
  try {
    validationReportMap = new Map(
      Object.entries(JSON.parse(data?.hasStatusStatuses[0].validationReport))
    );
  } catch (e) {
    const cleanedReport = (data?.hasStatusStatuses[0].validationReport)
      .replace("{", "")
      .replace("}", "");
    const reportArray = cleanedReport.split(",");
    for (const r of reportArray) {
      const splitReport = r.split("=");
      validationReportMap.set(splitReport[0].trim(), splitReport[1]);
    }
  }

  type Report = {
    fieldName: string;
    report: string;
  };
  const validationReportList: Report[] = [];

  validationReportMap.forEach(function (value, key) {
    validationReportList.push({ fieldName: key, report: value });
  });

  if (!data?.hasStatusStatuses[0].validationStatus) {
    return (
      <div className="tooltip-styles">
        <p>
          <span>Validation report for {`${data?.primaryId}`}</span>
        </p>
        <div className="ag-theme-alpine" style={{ height: 300, width: 550 }}>
          <AgGridReact
            rowData={validationReportList}
            columnDefs={columnDefs}
          ></AgGridReact>
        </div>
      </div>
    );
  } else {
    return "";
  }
};
