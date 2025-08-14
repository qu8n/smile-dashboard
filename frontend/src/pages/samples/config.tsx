import { FilterButtonOption } from "../../components/FilterButtons";
import {
  DashboardRecordContext,
  DashboardSample,
} from "../../generated/graphql";
import {
  CellClassParams,
  ColDef,
  ICellRendererParams,
  IHeaderParams,
} from "ag-grid-community";
import { RecordValidation } from "../../components/RecordValidation";
import { SAMPLE_STATUS_MAP } from "../../configs/recordValidationMaps";
import { Check, Launch } from "@material-ui/icons";
import {
  createCustomHeader,
  LoadingIcon,
  lockIcon,
  toolTipIcon,
} from "../../utils/gridFormatters";
import { getPhiColDefProps, multiLineColDef } from "../../config";
import {
  getAgGridBooleanColFilterConfigs,
  getAgGridBooleanValueFormatter,
  getAgGridDateColFilterConfigs,
  isInvalidCostCenter,
} from "../../utils/agGrid";
import _ from "lodash";
import { Link } from "react-router-dom";
import { formatDate } from "../../utils/dateFormatters";
import { BuildDownloadOptionsParamsBase, SampleChange } from "../../types";
import { DownloadOption } from "../../hooks/useDownload";

const WES_SAMPLE_CONTEXT: Array<DashboardRecordContext> = [
  {
    fieldName: "genePanel",
    values: [
      "Agilent_51MB",
      "Agilent_v4_51MB_Human",
      "CustomCapture",
      "IDT_Exome_v1_FP",
      "IDT_Exome_V1_IMPACT468",
      "WES_Human",
      "WholeExomeSequencing",
    ],
  },
];

const ACCESS_SAMPLE_CONTEXT: Array<DashboardRecordContext> = [
  {
    fieldName: "genePanel",
    values: [
      "ACCESS129",
      "ACCESS146",
      "ACCESS148",
      "ACCESS-Heme",
      "ACCESS-HEME-115",
      "HC_ACCESS",
      "HC_Custom",
      "MSK-ACCESS_v1",
      "MSK-ACCESS_v2",
      "HC_CMOCH",
      "CMO-CH",
    ],
  },
  {
    fieldName: "baitSet",
    values: [
      "MSK-ACCESS-v1_0-probesAllwFP",
      "MSK-ACCESS-v1_0-probesAllwFP_GRCh38",
      "MSK-ACCESS-v1_0-probesAllwFP_hg19_sort_BAITS",
      "MSK-ACCESS-v1_0-probesAllwFP_hg37_sort-BAITS",
      "MSK-ACCESS-v2_0-probesAllwFP",
      "ACCESS_HEME_MN1",
      "ACCESS129",
      "ACCESS146",
      "ACCESS148",
      "ACCESS-HEME-115",
      "CMO-CH",
      "MSK-CH",
    ],
  },
];

export const sampleColDefs: Array<ColDef<DashboardSample>> = [
  {
    field: "primaryId",
    headerName: "Primary ID",
  },
  {
    field: "altId",
    headerName: "Alt ID",
  },
  {
    headerName: "Status",
    cellRenderer: (params: ICellRendererParams<DashboardSample>) => {
      if (!params.data) return null;
      const {
        revisable,
        validationStatus,
        validationReport,
        sampleCategory,
        primaryId,
      } = params.data;

      if (revisable === true) {
        return validationStatus === false ||
          (validationStatus === null && sampleCategory !== "clinical") ? (
          <RecordValidation
            validationStatus={validationStatus}
            validationReport={validationReport}
            modalTitle={`Error report for sample ${primaryId}`}
            recordStatusMap={SAMPLE_STATUS_MAP}
          />
        ) : (
          <Check />
        );
      } else {
        return <LoadingIcon />;
      }
    },
    sortable: false,
  },
  {
    field: "cmoSampleName",
    headerName: "CMO Sample Name",
  },
  {
    field: "historicalCmoSampleNames",
    headerName: "Historical CMO Sample Names",
    maxWidth: 300,
    ...multiLineColDef,
  },
  {
    field: "importDate",
    headerName: "Last Updated",
    ...getAgGridDateColFilterConfigs(),
  },
  {
    field: "sequencingDate",
    headerName: "Sequencing Date",
    ...getPhiColDefProps({ widthSize: 260 }),
  },
  {
    field: "cmoPatientId",
    headerName: "CMO Patient ID",
    cellRenderer: (params: any) => {
      if (params.value) {
        return (
          <>
            {params.value}
            {"   "}
            <Link
              to={`/patients/${params.value}`}
              style={{ color: "black", textDecoration: "none" }}
              target="_blank"
            >
              <Launch style={{ height: "16px", width: "16px" }} />
            </Link>
          </>
        );
      } else {
        return <></>;
      }
    },
  },
  {
    field: "investigatorSampleId",
    headerName: "Investigator Sample ID",
  },
  {
    field: "sampleType",
    headerName: "Sample Type",
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
        "",
      ],
    },
  },
  {
    field: "species",
    headerName: "Species",
  },
  {
    field: "genePanel",
    headerName: "Gene Panel",
  },
  {
    field: "baitSet",
    headerName: "Bait Set",
  },
  {
    field: "preservation",
    headerName: "Preservation",
  },
  {
    field: "tumorOrNormal",
    headerName: "Tumor Or Normal",
    cellEditor: "agRichSelectCellEditor",
    cellEditorPopup: true,
    cellEditorParams: {
      values: ["Tumor", "Normal"],
    },
  },
  {
    field: "sampleClass",
    headerName: "Sample Class",
    cellEditor: "agRichSelectCellEditor",
    cellEditorPopup: true,
    cellEditorParams: {
      values: [
        "Biopsy",
        "Blood",
        "CellLine",
        "Exosome",
        "Fingernails",
        "Non-PDX",
        "Organoid",
        "PDX",
        "RapidAutopsy",
        "Resection",
        "Saliva",
        "Xenograft",
        "XenograftDerivedCellLine",
        "cfDNA",
        "other",
        "",
      ],
    },
  },
  {
    field: "oncotreeCode",
    headerName: "Oncotree Code",
  },
  {
    field: "cancerType",
    headerName: "Cancer Type",
    cellRenderer: (params: ICellRendererParams) => (
      <>
        {params.value}{" "}
        {params.value === "N/A" && (
          <span dangerouslySetInnerHTML={{ __html: toolTipIcon }} />
        )}
      </>
    ),
    sortable: false,
  },
  {
    field: "cancerTypeDetailed",
    headerName: "Cancer Type Detailed",
    cellRenderer: (params: ICellRendererParams) => (
      <>
        {params.value}{" "}
        {params.value === "N/A" && (
          <span dangerouslySetInnerHTML={{ __html: toolTipIcon }} />
        )}
      </>
    ),
    sortable: false,
  },
  {
    field: "collectionYear",
    headerName: "Collection Year",
  },
  {
    field: "sampleOrigin",
    headerName: "Sample Origin",
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
        "FFPE",
        "Fine Needle Aspirate",
        "Fingernails",
        "Fresh or Frozen",
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
        "",
      ],
    },
  },
  {
    field: "tissueLocation",
    headerName: "Tissue Location",
  },
  {
    field: "sex",
    headerName: "Sex",
  },
  {
    field: "recipe",
    headerName: "Recipe",
  },
  {
    field: "sampleCategory",
    headerName: "SMILE Sample Category",
  },
  {
    field: "dbGapStudy",
    headerName: "dbGaP Study ID",
  },
  {
    field: "sampleCohortIds",
    headerName: "Sample Cohort IDs",
  },
];

const dbGapPhenotypeColumns: Array<ColDef<DashboardSample>> = [
  {
    field: "cmoPatientId",
    headerName: "SUBJECT_ID",
  },
  {
    field: "cmoSampleName",
    headerName: "SAMPLE_ID",
  },
  {
    field: "sex",
    headerName: "SEX",
  },
  {
    // To be left empty for now as we don't have this data yet
    headerName: "RACE",
  },
  {
    field: "cancerType",
    headerName: "CANCER_TYPE",
  },
  {
    field: "tissueLocation",
    headerName: "BODY_SITE",
  },
  {
    field: "analyteType",
    headerName: "ANALYTE_TYPE",
  },
  {
    field: "tumorOrNormal",
    headerName: "IS_TUMOR",
  },
  {
    field: "sampleType",
    headerName: "SAMPLE_TYPE",
  },
  {
    field: "cancerType",
    headerName: "HISTOLOGICAL_TYPE",
  },
  {
    field: "cancerTypeDetailed",
    headerName: "HISTOLOGICAL_SUBTYPE",
  },
  {
    field: "genePanel",
    headerName: "SEQUENCING_PANEL",
  },
  {
    field: "platform",
    headerName: "PLATFORM",
  },
  {
    field: "instrumentModel",
    headerName: "INSTRUMENT_MODEL",
  },
];

export const wesSampleColDefs: Array<ColDef<DashboardSample>> = [
  {
    field: "primaryId",
    headerName: "Primary ID",
  },
  {
    field: "altId",
    headerName: "Alt ID",
  },
  {
    field: "cmoSampleName",
    headerName: "CMO Sample Name",
  },
  {
    field: "cmoPatientId",
    headerName: "CMO Patient ID",
    cellRenderer: (params: ICellRendererParams) => {
      if (params.value) {
        return (
          <>
            {params.value}
            {"   "}
            <Link
              to={`/patients/${params.value}`}
              style={{ color: "black", textDecoration: "none" }}
              target="_blank"
            >
              <Launch style={{ height: "16px", width: "16px" }} />
            </Link>
          </>
        );
      } else {
        return <></>;
      }
    },
  },
  {
    field: "historicalCmoSampleNames",
    headerName: "Historical CMO Sample Names",
    maxWidth: 300,
    ...multiLineColDef,
  },
  {
    field: "investigatorSampleId",
    headerName: "Investigator Sample ID",
  },
  {
    field: "dbGapStudy",
    headerName: "dbGaP Study ID",
  },
  {
    field: "sampleCohortIds",
    headerName: "Sample Cohort IDs",
  },
  {
    field: "initialPipelineRunDate",
    headerName: "Initial Pipeline Run Date",
    valueFormatter: (params) => formatDate(params.value) ?? "",
    ...getAgGridDateColFilterConfigs(),
  },
  {
    field: "embargoDate",
    headerName: "Embargo Date",
    valueFormatter: (params) => formatDate(params.value) ?? "",
    ...getAgGridDateColFilterConfigs({
      // embargoDate is 18 months ahead of initialPipelineRunDate
      maxValidYear: new Date().getFullYear() + 2,
    }),
  },
  {
    field: "billed",
    headerName: "Billed",
    editable: true,
    cellEditor: "agRichSelectCellEditor",
    cellEditorPopup: true,
    cellEditorParams: {
      values: [true, false],
    },
    ...getAgGridBooleanColFilterConfigs(),
    ...getAgGridBooleanValueFormatter({
      trueVal: true,
      falseVal: false,
    }),
  },
  {
    field: "costCenter",
    headerName: "Cost Center/Fund Number",
    cellClassRules: {
      "costCenter-validation-error": (params: CellClassParams) => {
        return isInvalidCostCenter(params.colDef.field!, params.value);
      },
    },
  },
  {
    field: "billedBy",
    headerName: "Edited By",
    headerTooltip: 'User who last updated the "Billed" status',
    headerComponentParams: createCustomHeader(lockIcon + toolTipIcon),
  },
  {
    field: "custodianInformation",
    headerName: "Data Custodian",
  },
  {
    field: "accessLevel",
    headerName: "Access Level",
  },
  {
    field: "sampleType",
    headerName: "Sample Type",
  },
  {
    field: "tumorOrNormal",
    headerName: "Tumor Or Normal",
  },
  {
    field: "bamCompleteDate",
    headerName: "Latest BAM Complete Date",
    valueFormatter: (params) => formatDate(params.value) ?? "",
    ...getAgGridDateColFilterConfigs(),
  },
  {
    field: "bamCompleteStatus",
    headerName: "BAM Complete Status",
  },
  {
    field: "mafCompleteDate",
    headerName: "Latest MAF Complete Date",
    valueFormatter: (params) => formatDate(params.value) ?? "",
    ...getAgGridDateColFilterConfigs(),
  },
  {
    field: "mafCompleteNormalPrimaryId",
    headerName: "MAF Complete Normal Primary ID",
  },
  {
    field: "mafCompleteStatus",
    headerName: "MAF Complete Status",
  },
  {
    field: "qcCompleteDate",
    headerName: "Latest QC Complete Date",
    valueFormatter: (params) => formatDate(params.value) ?? "",
    ...getAgGridDateColFilterConfigs(),
  },
  {
    field: "qcCompleteResult",
    headerName: "QC Complete Result",
  },
  {
    field: "qcCompleteReason",
    headerName: "QC Complete Reason",
  },
  {
    field: "qcCompleteStatus",
    headerName: "QC Complete Status",
  },
  {
    field: "genePanel",
    headerName: "Gene Panel",
  },
  {
    field: "baitSet",
    headerName: "Bait Set",
  },
  {
    field: "oncotreeCode",
    headerName: "Oncotree Code",
  },
  {
    field: "cancerType",
    headerName: "Cancer Type",
  },
  {
    field: "cancerTypeDetailed",
    headerName: "Cancer Type Detailed",
  },
  {
    field: "tissueLocation",
    headerName: "Tissue Location",
  },
  {
    field: "sampleCategory",
    headerName: "SMILE Sample Category",
  },
  {
    field: "platform",
    headerName: "PLATFORM",
  },
  {
    field: "instrumentModel",
    headerName: "INSTRUMENT_MODEL",
  },
];

const accessSampleColDefs: Array<ColDef<DashboardSample>> = [
  {
    field: "primaryId",
    headerName: "Primary ID",
  },
  {
    field: "altId",
    headerName: "Alt ID",
  },
  {
    headerName: "Status",
    cellRenderer: (params: ICellRendererParams<DashboardSample>) => {
      if (!params.data) return null;
      const {
        revisable,
        validationStatus,
        validationReport,
        sampleCategory,
        primaryId,
      } = params.data;

      if (revisable === true) {
        return validationStatus === false ||
          (validationStatus === null && sampleCategory !== "clinical") ? (
          <RecordValidation
            validationStatus={validationStatus}
            validationReport={validationReport}
            modalTitle={`Error report for sample ${primaryId}`}
            recordStatusMap={SAMPLE_STATUS_MAP}
          />
        ) : (
          <Check />
        );
      } else {
        return <LoadingIcon />;
      }
    },
    sortable: false,
  },
  {
    field: "cmoSampleName",
    headerName: "CMO Sample Name",
  },
  {
    field: "historicalCmoSampleNames",
    headerName: "Historical CMO Sample Names",
    maxWidth: 300,
    ...multiLineColDef,
  },
  {
    field: "importDate",
    headerName: "Last Updated",
    ...getAgGridDateColFilterConfigs(),
  },
  {
    field: "cmoPatientId",
    headerName: "CMO Patient ID",
  },
  {
    field: "investigatorSampleId",
    headerName: "Investigator Sample ID",
  },
  {
    field: "sampleType",
    headerName: "Sample Type",
  },
  {
    field: "species",
    headerName: "Species",
  },
  {
    field: "genePanel",
    headerName: "Gene Panel",
  },
  {
    field: "baitSet",
    headerName: "Bait Set",
  },
  {
    field: "preservation",
    headerName: "Preservation",
  },
  {
    field: "tumorOrNormal",
    headerName: "Tumor Or Normal",
  },
  {
    field: "sampleClass",
    headerName: "Sample Class",
  },
  {
    field: "oncotreeCode",
    headerName: "Oncotree Code",
  },
  {
    field: "cancerType",
    headerName: "Cancer Type",
  },
  {
    field: "cancerTypeDetailed",
    headerName: "Cancer Type Detailed",
  },
  {
    field: "collectionYear",
    headerName: "Collection Year",
  },
  {
    field: "sampleOrigin",
    headerName: "Sample Origin",
  },
  {
    field: "tissueLocation",
    headerName: "Tissue Location",
  },
  {
    field: "sex",
    headerName: "Sex",
  },
  {
    field: "recipe",
    headerName: "Recipe",
  },
  {
    field: "sampleCategory",
    headerName: "SMILE Sample Category",
  },
  {
    field: "cfDNA2dBarcode",
    headerName: "2D Barcode",
  },
  {
    field: "dmpPatientAlias",
    headerName: "DMP Patient Alias",
  },
];

const editableSampleFields = new Set([
  "cmoPatientId",
  "investigatorSampleId",
  "sampleType",
  "preservation",
  "tumorOrNormal",
  "sampleClass",
  "oncotreeCode",
  "collectionYear",
  "sampleOrigin",
  "tissueLocation",
  "sex",
  "billed",
  "costCenter",
  "custodianInformation",
  "accessLevel",
  "dbGapStudy",
]);

const editableWesSampleFields = new Set([
  "billed",
  "costCenter",
  "custodianInformation",
  "accessLevel",
]);

export const allEditableFields = new Set(
  Array.from(editableSampleFields).concat(Array.from(editableWesSampleFields))
);

const readOnlyWesSampleColDefs = _.cloneDeep(wesSampleColDefs);
const readOnlyAccessSampleColDefs = _.cloneDeep(accessSampleColDefs);

export function setupEditableSampleFields(
  samplesColDefs: Array<ColDef>,
  editableFieldsList: Set<string>
) {
  samplesColDefs.forEach((colDef) => {
    const newClassRule = {
      unsubmittedChange: (params: CellClassParams) => {
        const changes: Array<SampleChange> = params.context?.getChanges();
        const changedValue = changes?.find((change) => {
          return (
            change.fieldName === params.colDef.field &&
            change.primaryId === params.data.primaryId
          );
        });
        return changedValue !== undefined;
      },
      cursorNotAllowed: (params: CellClassParams) => {
        return (
          params.data?.sampleCategory === "clinical" ||
          !editableFieldsList.has(params.colDef.field!)
        );
      },
    };

    if (colDef.cellClassRules) {
      colDef.cellClassRules = {
        ...colDef.cellClassRules,
        ...newClassRule,
      };
    } else {
      colDef.cellClassRules = newClassRule;
    }

    if (colDef.valueGetter === undefined) {
      colDef.valueGetter = (params) => {
        if (params.data && params.colDef.field) {
          const changes: Array<SampleChange> = params.context?.getChanges();
          const changedValue = changes?.find((change) => {
            return (
              change.fieldName === params.colDef.field &&
              change.primaryId === params.data.primaryId
            );
          });
          if (changedValue) {
            return changedValue.newValue;
          } else {
            if (params.colDef.field in params.data) {
              return params.data[params.colDef.field];
            } else {
              return "";
            }
          }
        }
      };
    }

    colDef.editable = (params) => {
      return (
        params.data?.sampleCategory !== "clinical" &&
        editableFieldsList.has(params.colDef.field!) &&
        params.data?.revisable === true
      );
    };

    if (!("headerComponentParams" in colDef)) {
      colDef.headerComponentParams = (params: IHeaderParams) => {
        if (!editableFieldsList.has(params.column.getColDef().field!))
          return createCustomHeader(lockIcon);
      };
    }
  });
}

setupEditableSampleFields(sampleColDefs, editableSampleFields);
setupEditableSampleFields(wesSampleColDefs, editableWesSampleFields);

const combinedSampleColDefs = _.uniqBy(
  [
    ...sampleColDefs,
    ...readOnlyWesSampleColDefs,
    ...readOnlyAccessSampleColDefs,
  ],
  "field"
);

export const filterButtonOptions: Array<FilterButtonOption> = [
  {
    label: "All",
    columnDefs: combinedSampleColDefs,
    contexts: undefined,
  },
  {
    label: "WES",
    columnDefs: readOnlyWesSampleColDefs,
    contexts: WES_SAMPLE_CONTEXT,
  },
  {
    label: "ACCESS/CMO-CH",
    columnDefs: readOnlyAccessSampleColDefs,
    contexts: ACCESS_SAMPLE_CONTEXT,
  },
];

export const filterButtonsTooltipContent =
  "These tabs filter the data and relevant columns displayed in the table." +
  '"All" shows all samples, whereas "WES" and "ACCESS/CMO-CH" show only' +
  "whole exome and MSK-ACCESS/CMO-CH samples, respectively.";

type BuildDownloadOptionsParams = BuildDownloadOptionsParamsBase & {
  // Put additional parameters here if needed
};

export function buildDownloadOptions({
  getCurrentData,
  currentColumnDefs,
}: BuildDownloadOptionsParams): Array<DownloadOption> {
  return [
    {
      buttonLabel: "Download as TSV",
      columnDefsForDownload: currentColumnDefs,
      dataGetter: getCurrentData,
    },
    {
      buttonLabel: "Download in Phenotype format for dbGaP",
      columnDefsForDownload: dbGapPhenotypeColumns,
      dataGetter: getCurrentData,
    },
  ];
}

export const phiModeSwitchTooltipContent =
  "Turn on this switch to return samples' sequencing dates in the results." +
  " The table will display sequencing dates only after you (1) have logged" +
  " in and (2) just performed a search with specific DMP Sample IDs. Turning" +
  " on this switch for the first time will prompt you to log in if you have" +
  " not already.";
