import {
  CellClassParams,
  ColDef,
  ICellRendererParams,
  RowNode,
} from "ag-grid-community";
import { Button } from "react-bootstrap";
import "ag-grid-enterprise";
import { SampleMetadata } from "../../generated/graphql";
import WarningIcon from "@material-ui/icons/Warning";
import { StatusTooltip } from "./StatusToolTip";
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
  },
  {
    field: "cmoPatientId",
    headerName: "CMO Patient ID",
    valueGetter: function ({ data }) {
      for (let i of data["isAliasPatients"][0]["patientAliasesIsAlias"]) {
        if (i.namespace === "cmoId") {
          return i.value;
        }
      }
    },
  },
  {
    field: "dmpPatientId",
    headerName: "DMP Patient ID",
    valueGetter: function ({ data }) {
      for (let i of data["isAliasPatients"][0]?.patientAliasesIsAlias) {
        if (i.namespace === "dmpId") {
          return i.value;
        }
      }
    },
  },
  {
    field: "hasSampleSamplesConnection",
    headerName: "# Samples",
    valueGetter: function ({ data }) {
      return data["isAliasPatients"][0].hasSampleSamplesConnection.totalCount;
    },
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
        return params.data?.hasStatusStatuses[0].validationStatus ? (
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
          params.data.hasStatusStatuses[0].validationReport,
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
