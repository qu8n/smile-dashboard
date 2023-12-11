import {
  CellClassParams,
  ColDef,
  ICellRendererParams,
  IHeaderParams,
  RowNode,
} from "ag-grid-community";
import { Button } from "react-bootstrap";
import "ag-grid-enterprise";
import { Sample, SampleMetadata } from "../generated/graphql";
import WarningIcon from "@material-ui/icons/Warning";
import { StatusTooltip } from "./components/StatusToolTip";
import { ITooltipParams } from "ag-grid-community";

export interface SampleMetadataExtended extends SampleMetadata {
  revisable: boolean;
}

export type SampleChange = {
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

export const RequestsListColumns: ColDef[] = [
  {
    headerName: "View",
    cellRenderer: (params: CellClassParams<any>) => {
      return (
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => {
            if (params.data.igoRequestId !== undefined) {
              params.context.navigateFunction(
                `/requests/${params.data.igoRequestId}`
              );
            }
          }}
        >
          View
        </Button>
      );
    },
    sortable: false,
  },
  {
    field: "igoRequestId",
    headerName: "IGO Request ID",
  },
  {
    field: "igoProjectId",
    headerName: "IGO Project ID",
  },
  {
    field: "hasSampleSamplesConnection",
    headerName: "# Samples",
    valueGetter: function ({ data }) {
      return data["hasSampleSamplesConnection"]?.totalCount;
    },
    cellClass: (params) => {
      if (params.data.revisable === false) {
        return "pendingCell";
      }
      return undefined;
    },
    sortable: false,
  },
  {
    field: "projectManagerName",
    headerName: "Project Manager Name",
  },
  {
    field: "investigatorName",
    headerName: "Investigator Name",
  },
  {
    field: "investigatorEmail",
    headerName: "Investigator Email",
  },
  {
    field: "piEmail",
    headerName: "PI Email",
  },
  {
    field: "dataAnalystName",
    headerName: "Data Analyst Name",
  },
  {
    field: "dataAnalystEmail",
    headerName: "Data Analyst Email",
  },
  {
    field: "genePanel",
    headerName: "Gene Panel",
  },
  {
    field: "labHeadName",
    headerName: "Lab Head Name",
  },
  {
    field: "labHeadEmail",
    headerName: "Lab Head Email",
  },
  {
    field: "qcAccessEmails",
    headerName: "QC Access Emails",
  },
  {
    field: "dataAccessEmails",
    headerName: "Data Access Emails",
  },
  {
    field: "bicAnalysis",
    headerName: "BIC Analysis",
  },
  {
    field: "isCmoRequest",
    headerName: "CMO Request?",
  },
  {
    field: "otherContactEmails",
    headerName: "Other Contact Emails",
  },
];

export const PatientsListColumns: ColDef[] = [
  {
    headerName: "View",
    cellRenderer: (params: CellClassParams<any>) => {
      return (
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => {
            if (params.data.value !== undefined) {
              params.context.navigateFunction(`/patients/${params.data.value}`);
            }
          }}
        >
          View
        </Button>
      );
    },
    sortable: false,
  },
  {
    field: "patientMrn",
    headerName: "Patient MRN",
    hide: true,
    cellStyle: { color: "crimson" },
    sortable: false,
  },
  {
    field: "cmoPatientId",
    headerName: "CMO Patient ID",
    valueGetter: function ({ data }) {
      return data["isAliasPatients"][0]["patientAliasesIsAlias"].find(
        (patientAlias: any) => patientAlias.namespace === "cmoId"
      )?.value;
    },
    sortable: false,
  },
  {
    field: "dmpPatientId",
    headerName: "DMP Patient ID",
    valueGetter: function ({ data }) {
      return data["isAliasPatients"][0]["patientAliasesIsAlias"].find(
        (patientAlias: any) => patientAlias.namespace === "dmpId"
      )?.value;
    },
    sortable: false,
  },
  {
    field: "hasSampleSamplesConnection",
    headerName: "# Samples",
    valueGetter: function ({ data }) {
      return data["isAliasPatients"][0].hasSampleSamplesConnection.totalCount;
    },
    sortable: false,
  },
  {
    field: "cmoSampleIds",
    headerName: "CMO Sample IDs",
    valueGetter: function ({ data }) {
      return data["isAliasPatients"][0].hasSampleSamples.map(
        (sample: Sample) =>
          sample.hasMetadataSampleMetadata[0].cmoSampleName ||
          sample.hasMetadataSampleMetadata[0].primaryId
      );
    },
    sortable: false,
  },
  {
    headerName: "12-245 Part A",
    valueGetter: function ({ data }) {
      return JSON.parse(
        data["isAliasPatients"][0].hasSampleSamples[0]
          ?.hasMetadataSampleMetadata[0]?.additionalProperties
      )["consent-parta"];
    },
    sortable: false,
  },
  {
    headerName: "12-245 Part C",
    valueGetter: function ({ data }) {
      return JSON.parse(
        data["isAliasPatients"][0].hasSampleSamples[0]
          ?.hasMetadataSampleMetadata[0]?.additionalProperties
      )["consent-partc"];
    },
    sortable: false,
  },
  {
    field: "smilePatientId",
    headerName: "SMILE Patient ID",
    valueGetter: function ({ data }) {
      return data["isAliasPatients"][0].smilePatientId;
    },
    hide: true,
  },
];

export const SampleDetailsColumns: ColDef<SampleMetadataExtended>[] = [
  {
    field: "primaryId",
    headerName: "Primary ID",
    editable: (params) => !protectedFields.includes(params.colDef.field!),
  },
  {
    field: "revisable",
    headerName: "Status",
    cellRenderer: (params: ICellRendererParams<SampleMetadataExtended>) => {
      if (params.data?.revisable) {
        return params.data?.hasStatusStatuses[0]?.validationStatus ? (
          <div>
            <strong>&#10003;</strong>
          </div>
        ) : (
          <div>
            <WarningIcon />
          </div>
        );
      } else {
        return (
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        );
      }
    },
    cellRendererParams: {
      colDef: {
        tooltipComponent: StatusTooltip,
        tooltipValueGetter: (params: ITooltipParams) =>
          params.data.hasStatusStatuses[0]?.validationReport ??
          params.data.hasStatusStatuses,
      },
    },
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

SampleDetailsColumns.forEach((def) => {
  def.cellClassRules = {
    unsubmittedChange: (params: any) => {
      const changes = params.context.getChanges();
      const changedValue = changes?.find((change: any) => {
        return (
          change.fieldName === params.colDef.field &&
          change.primaryId === params.data.primaryId
        );
      });
      return changedValue !== undefined;
    },
  };

  if (def.valueGetter === undefined) {
    def.valueGetter = (params) => {
      const changes = params.context?.getChanges();

      const changedValue = changes?.find((change: any) => {
        return (
          change.fieldName === params.colDef.field &&
          change.primaryId === params.data?.primaryId
        );
      });
      if (changedValue) {
        return changedValue.newValue;
      } else {
        if (params?.colDef?.field! in params.data!) {
          return params.data?.[
            params.colDef?.field! as keyof SampleMetadataExtended
          ];
        } else {
          return "N/A";
        }
      }
    };
  }

  def.editable = (params) => {
    return (
      !protectedFields.includes(params.colDef.field!) &&
      params.data?.revisable === true
    );
  };

  def.headerComponentParams = (params: IHeaderParams) => {
    if (protectedFields.includes(params.column.getColDef().field!)) {
      return {
        template: `
        <div class="ag-cell-label-container" role="presentation">
          <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button" aria-hidden="true"></span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" fill="none" viewBox="0 -4 30 30" stroke="gray"
            stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div ref="eLabel" class="ag-header-cell-label" role="presentation">
            <span ref="eText" class="ag-header-cell-text"></span>
            <span ref="eFilter" class="ag-header-icon ag-header-label-icon ag-filter-icon" aria-hidden="true"></span>
            <span ref="eSortOrder" class="ag-header-icon ag-header-label-icon ag-sort-order" aria-hidden="true"></span>
            <span ref="eSortAsc" class="ag-header-icon ag-header-label-icon ag-sort-ascending-icon" aria-hidden="true"></span>
            <span ref="eSortDesc" class="ag-header-icon ag-header-label-icon ag-sort-descending-icon" aria-hidden="true"></span>
            <span ref="eSortNone" class="ag-header-icon ag-header-label-icon ag-sort-none-icon" aria-hidden="true"></span>
          </div>
          </div>
        `,
      };
    }
  };
});

export const defaultSamplesColDef: ColDef = {
  sortable: true,
  editable: true,
  resizable: true,
};

export const defaultRecordsColDef: ColDef = {
  sortable: true,
  resizable: true,
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
  "validationStatus",
  "validationReport",
  "revisable",
];
