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
    dataKey: "piEmail",
    label: "PI Email",
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
  },
  {
    dataKey: "labHeadName",
    label: "Lab Head Name",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "labHeadEmail",
    label: "Lab Head Email",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "qcAccessEmails",
    label: "QC Access Emails",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "dataAccessEmails",
    label: "Data Access Emails",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "bicAnalysis",
    label: "BIC Analysis",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "isCmoRequest",
    label: "CMO Request?",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "otherContactEmails",
    label: "Other Contact Emails",
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
    label: "CMO Sample Name",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "cmoPatientId",
    label: "CMO Patient ID",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "investigatorSampleId",
    label: "Investigator Sample ID",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "primaryId",
    label: "Primary ID",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "preservation",
    label: "Preservation",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "tumorOrNormal",
    label: "Tumor Or Normal",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "sampleClass",
    label: "Sample Class",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "oncotreeCode",
    label: "Oncotree Code",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "collectionYear",
    label: "Collection Year",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "sampleOrigin",
    label: "Sample Origin",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "tissueLocation",
    label: "Tissue Location",
    sortable: true,
    filterable: true,
    width: 200
  },
  {
    dataKey: "sex",
    label: "Sex",
    sortable: true,
    filterable: true,
    width: 200
  }
];
