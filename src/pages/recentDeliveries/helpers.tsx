import { Edit } from "@material-ui/icons";
import { Button } from "react-bootstrap";
import React from "react";

type ColumnDefinition = {
  dataKey?: string;
  label?: string;
  sortable?: Boolean;
  filterable?: Boolean;
  width?: number;
  headerRender?: (arg: any) => any;
  cellRenderer?: (arg: any) => any;
};

export const StaticTableColumns: ColumnDefinition[] = [
  {
    dataKey: "igoRequestId",
    label: "IGO Request ID",
    sortable: true,
    filterable: true
  },
  {
    dataKey: "igoProjectId",
    label: "IGO Project ID",
    sortable: true,
    filterable: true
  },
  {
    dataKey: "projectManagerName",
    label: "Project Manager Name",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "investigatorName",
    label: "Investigator Name",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "investigatorEmail",
    label: "Investigator Email",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "dataAnalystName",
    label: "Data Analyst Name",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "dataAnalystEmail",
    label: "Data Analyst Email",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "genePanel",
    label: "Gene Panel",
    sortable: true,
    filterable: true
  }
];

export function buildRequestTableColumns(navigate: any): ColumnDefinition[] {
  return [
    {
      headerRender: () => {
        return <Edit />;
      },
      cellRenderer: arg => {
        return (
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              navigate("./" + arg.rowData.igoRequestId);
            }}
          >
            Edit
          </Button>
        );
      }
    },

    ...StaticTableColumns
  ];
}

export function buildRequestTableColumns2(navigate: any): ColumnDefinition[] {
  return [
    {
      headerRender: () => {
        return <Edit />;
      },
      cellRenderer: arg => {
        return (
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              navigate("./" + arg.rowData.igoRequestId);
            }}
          >
            Edit
          </Button>
        );
      }
    },

    ...StaticTableColumns
  ];
}
