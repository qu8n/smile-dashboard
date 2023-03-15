import { ColDef, RowNode } from "ag-grid-community";
import { Button } from "react-bootstrap";
import "ag-grid-enterprise";

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

export type CellChange = {
  primaryId: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  rowNode: RowNode<any>;
};

export type ChangeForSubmit = {
  [primaryId: string]: {
    [fieldName: string]: string;
  };
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
      },
    },
    ...RequestsListColumns,
  ];
}

export const RequestsListColumns: ColDef[] = [
  {
    field: "igoRequestId",
    headerName: "IGO Request ID",
    sortable: true,
  },
  {
    field: "igoProjectId",
    headerName: "IGO Project ID",
    sortable: true,
  },
  {
    field: "hasSampleSamplesConnection",
    headerName: "# Samples",
    valueGetter: function ({ data }) {
      return data["hasSampleSamplesConnection"]?.totalCount;
    },
  },
  {
    field: "projectManagerName",
    headerName: "Project Manager Name",
    sortable: true,
  },
  {
    field: "investigatorName",
    headerName: "Investigator Name",
    sortable: true,
  },
  {
    field: "investigatorEmail",
    headerName: "Investigator Email",
    sortable: true,
  },
  {
    field: "piEmail",
    headerName: "PI Email",
    sortable: true,
  },
  {
    field: "dataAnalystName",
    headerName: "Data Analyst Name",
    sortable: true,
  },
  {
    field: "dataAnalystEmail",
    headerName: "Data Analyst Email",
    sortable: true,
  },
  {
    field: "genePanel",
    headerName: "Gene Panel",
    sortable: true,
  },
  {
    field: "labHeadName",
    headerName: "Lab Head Name",
    sortable: true,
  },
  {
    field: "labHeadEmail",
    headerName: "Lab Head Email",
    sortable: true,
  },
  {
    field: "qcAccessEmails",
    headerName: "QC Access Emails",
    sortable: true,
  },
  {
    field: "dataAccessEmails",
    headerName: "Data Access Emails",
    sortable: true,
  },
  {
    field: "bicAnalysis",
    headerName: "BIC Analysis",
    sortable: true,
  },
  {
    field: "isCmoRequest",
    headerName: "CMO Request?",
    sortable: true,
  },
  {
    field: "otherContactEmails",
    headerName: "Other Contact Emails",
    sortable: true,
  },
];

export const SampleDetailsColumns: ColDef[] = [
  {
    field: "primaryId",
    headerName: "Primary ID",
    editable: (params) => !protectedFields.includes(params.colDef.field!),
  },
  {
    field: "cmoSampleName",
    headerName: "CMO Sample Name",
    editable: (params) => !protectedFields.includes(params.colDef.field!),
  },
  {
    field: "importDate",
    headerName: "Last Updated",
    editable: (params) => !protectedFields.includes(params.colDef.field!),
  },
  {
    field: "cmoPatientId",
    headerName: "CMO Patient ID",
    editable: (params) => !protectedFields.includes(params.colDef.field!),
  },
  {
    field: "investigatorSampleId",
    headerName: "Investigator Sample ID",
    editable: (params) => !protectedFields.includes(params.colDef.field!),
  },
  {
    field: "sampleType",
    headerName: "Sample Type",
    editable: (params) => !protectedFields.includes(params.colDef.field!),
    cellEditor: "agRichSelectCellEditor",
    cellEditorPopup: true,
    cellEditorParams: {
      values: [
        "Adjacent Normal",
        "Adjacent Tissue",
        "Cell free",
        "Local Recurrence",
        "Metastasis",
        "Normal",
        "Primary",
        "Recurrence",
        "Tumor",
        "Unknown Tumor",
        "Other",
      ],
    },
  },
  {
    field: "species",
    headerName: "Species",
    editable: (params) => !protectedFields.includes(params.colDef.field!),
  },
  {
    field: "genePanel",
    headerName: "Gene Panel",
    editable: (params) => !protectedFields.includes(params.colDef.field!),
  },
  {
    field: "preservation",
    headerName: "Preservation",
    editable: (params) => !protectedFields.includes(params.colDef.field!),
  },
  {
    field: "tumorOrNormal",
    headerName: "Tumor Or Normal",
    editable: (params) => !protectedFields.includes(params.colDef.field!),
    cellEditor: "agRichSelectCellEditor",
    cellEditorPopup: true,
    cellEditorParams: {
      values: ["Tumor", "Normal"],
    },
  },
  {
    field: "sampleClass",
    headerName: "Sample Class",
    editable: (params) => !protectedFields.includes(params.colDef.field!),
    cellEditor: "agRichSelectCellEditor",
    cellEditorPopup: true,
    cellEditorParams: {
      values: [
        "Biopsy",
        "Blood",
        "CellLine",
        "Exosome",
        "Fingernails",
        "Organoid",
        "PDX",
        "RapidAutopsy",
        "Resection",
        "Saliva",
        "Xenograft",
        "XenograftDerivedCellLine",
        "cfDNA",
        "other",
      ],
    },
  },
  {
    field: "oncotreeCode",
    headerName: "Oncotree Code",
    editable: (params) => !protectedFields.includes(params.colDef.field!),
  },
  {
    field: "collectionYear",
    headerName: "Collection Year",
    editable: (params) => !protectedFields.includes(params.colDef.field!),
  },
  {
    field: "sampleOrigin",
    headerName: "Sample Origin",
    editable: (params) => !protectedFields.includes(params.colDef.field!),
    cellEditor: "agRichSelectCellEditor",
    cellEditorPopup: true,
    cellEditorParams: {
      values: [
        "Block",
        "Bone Marrow Aspirate",
        "Buccal Swab",
        "Buffy Coat",
        "Cell Pellet",
        "Cells",
        "Cerebrospinal Fluid",
        "Core Biopsy",
        "Curls",
        "Cytospin",
        "Fine Needle Aspirate",
        "Fingernails",
        "Organoid",
        "Plasma",
        "Punch",
        "Rapid Autopsy Tissue",
        "Saliva",
        "Slides",
        "Sorted Cells",
        "Tissue",
        "Urine",
        "Viably Frozen Cells",
        "Whole Blood",
        "Other",
      ],
    },
  },
  {
    field: "tissueLocation",
    headerName: "Tissue Location",
    editable: (params) => !protectedFields.includes(params.colDef.field!),
  },
  {
    field: "sex",
    headerName: "Sex",
    editable: (params) => !protectedFields.includes(params.colDef.field!),
  },
];

export const defaultColDef: ColDef = {
  sortable: true,
  editable: true,
};

const protectedFields: string[] = [
  "cmoSampleName",
  "igoComplete",
  "importDate",
  "primaryId",
  "cmoSampleIdFields",
  "libraries",
  "genePanel",
  "species",
];
