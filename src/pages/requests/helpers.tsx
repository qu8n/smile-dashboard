import { ColDef } from "ag-grid-community";
import { Button } from "react-bootstrap";

export type ColumnDefinition = {
  dataKey?: string;
  label?: string;
  sortable?: Boolean;
  filterable?: Boolean;
  width?: number;
  headerRender?: (arg: any) => any;
  cellRenderer?: (arg: any) => any;
  cellDataGetter?: (arg: any) => any;
};

export function buildRequestTableColumns(navigate: any): ColDef[] {
  return [
    {
      headerName: "View",
      cellRenderer: (data: any) => {
        return (
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              if (data.data.igoRequestId !== undefined) {
                navigate(`/${data.data.igoRequestId}`);
              }
            }}
          >
            View
          </Button>
        );
      }
    },
    ...RequestsListColumns
  ];
}

export const RequestsListColumns: ColDef[] = [
  {
    field: "igoRequestId",
    headerName: "IGO Request ID",
    sortable: true,
    width: 200
  },
  {
    field: "igoProjectId",
    headerName: "IGO Project ID",
    sortable: true,
    width: 175
  },
  {
    field: "hasSampleSamplesConnection",
    headerName: "# Samples",
    sortable: true,
    valueGetter: function({ data }) {
      return data["hasSampleSamplesConnection"]?.totalCount;
    }
  },
  {
    field: "projectManagerName",
    headerName: "Project Manager Name",
    sortable: true,
    width: 175
  },
  {
    field: "investigatorName",
    headerName: "Investigator Name",
    sortable: true,
    width: 200
  },
  {
    field: "investigatorEmail",
    headerName: "Investigator Email",
    sortable: true,
    width: 200
  },
  {
    field: "piEmail",
    headerName: "PI Email",
    sortable: true,
    width: 200
  },
  {
    field: "dataAnalystName",
    headerName: "Data Analyst Name",
    sortable: true,
    width: 200
  },
  {
    field: "dataAnalystEmail",
    headerName: "Data Analyst Email",
    sortable: true,
    width: 200
  },
  {
    field: "genePanel",
    headerName: "Gene Panel",
    sortable: true,
    width: 200
  },
  {
    field: "labHeadName",
    headerName: "Lab Head Name",
    sortable: true,
    width: 200
  },
  {
    field: "labHeadEmail",
    headerName: "Lab Head Email",
    sortable: true,
    width: 200
  },
  {
    field: "qcAccessEmails",
    headerName: "QC Access Emails",
    sortable: true,
    width: 200
  },
  {
    field: "dataAccessEmails",
    headerName: "Data Access Emails",
    sortable: true,
    width: 200
  },
  {
    field: "bicAnalysis",
    headerName: "BIC Analysis",
    sortable: true,
    width: 200
  },
  {
    field: "isCmoRequest",
    headerName: "CMO Request?",
    sortable: true,
    width: 200
  },
  {
    field: "otherContactEmails",
    headerName: "Other Contact Emails",
    sortable: true,
    width: 200
  }
];

export const SampleDetailsColumns: ColDef[] = [
  {
    field: "primaryId",
    headerName: "Primary ID",
    sortable: true,
    width: 200
  },
  {
    field: "cmoSampleName",
    headerName: "CMO Sample Name",
    sortable: true,
    width: 200
  },
  {
    field: "importDate",
    headerName: "Last Updated",
    sortable: true,
    width: 200
  },
  {
    field: "cmoPatientId",
    headerName: "CMO Patient ID",
    sortable: true,
    width: 200
  },
  {
    field: "investigatorSampleId",
    headerName: "Investigator Sample ID",
    sortable: true,
    width: 200
  },

  {
    field: "preservation",
    headerName: "Preservation",
    sortable: true,
    width: 200
  },
  {
    field: "tumorOrNormal",
    headerName: "Tumor Or Normal",
    sortable: true,
    width: 200
  },
  {
    field: "sampleClass",
    headerName: "Sample Class",
    sortable: true,
    width: 200
  },
  {
    field: "oncotreeCode",
    headerName: "Oncotree Code",
    sortable: true,
    width: 200
  },
  {
    field: "collectionYear",
    headerName: "Collection Year",
    sortable: true,
    width: 200
  },
  {
    field: "sampleOrigin",
    headerName: "Sample Origin",
    sortable: true,
    width: 200
  },
  {
    field: "tissueLocation",
    headerName: "Tissue Location",
    sortable: true,
    width: 200
  },
  {
    field: "sex",
    headerName: "Sex",
    sortable: true,
    width: 200
  }
];
