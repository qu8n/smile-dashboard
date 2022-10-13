import { Edit } from "@material-ui/icons";
import { Button } from "react-bootstrap";

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
    filterable: true,
    width: 200
  },
  {
    dataKey: "igoProjectId",
    label: "IGO Project ID",
    sortable: true,
    filterable: true,
    width: 175
  },
  {
    dataKey: "projectManagerName",
    label: "Project Manager Name",
    sortable: true,
    filterable: true,
    width: 175
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
    filterable: true,
    width: 200
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
            View
          </Button>
        );
      }
    },

    ...StaticTableColumns
  ];
}

export const SampleDetailsColumns: ColumnDefinition[] = [
  {
    dataKey: "cmoSampleName",
    label: "CMO Sample Label"
  },
  {
    dataKey: "investigatorSampleId",
    label: "Investigator Sample ID"
  },
  {
    dataKey: "cmoPatientId",
    label: "CMO Patient ID"
  },
  {
    dataKey: "primaryId",
    label: "Primary ID"
  },
  {
    dataKey: "cmoSampleName",
    label: "CMO Sample Name"
  },
  {
    dataKey: "preservation",
    label: "Preservation"
  },
  {
    dataKey: "tumorOrNormal",
    label: "Tumor Or Normal"
  },
  {
    dataKey: "sampleClass",
    label: "Sample Class"
  },
  {
    dataKey: "oncotreeCode",
    label: "Oncotree Code"
  },
  {
    dataKey: "collectionYear",
    label: "Collection Year"
  },
  {
    dataKey: "sampleOrigin",
    label: "Sample Origin"
  },
  {
    dataKey: "tissueLocation",
    label: "Tissue Location"
  },
  {
    dataKey: "sex",
    label: "Sex"
  }
];
