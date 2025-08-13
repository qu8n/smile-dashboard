import {
  ColDef,
  ICellRendererParams,
  IHeaderParams,
  RowNode,
  ITooltipParams,
  CellClassParams,
  IFilterDef,
  IServerSideGetRowsParams,
} from "ag-grid-community";
import { Button } from "react-bootstrap";
import "ag-grid-enterprise";
import { Check as CheckIcon, Launch as LaunchIcon } from "@material-ui/icons";
import moment from "moment";
import _ from "lodash";
import { RecordValidation } from "../components/RecordValidation";
import {
  AnchorSeqDateData,
  DashboardCohort,
  DashboardPatient,
  DashboardRecordColumnFilter,
  DashboardRequest,
  DashboardSample,
} from "../generated/graphql";
import {
  REQUEST_STATUS_MAP,
  SAMPLE_STATUS_MAP,
} from "../configs/recordValidationMaps";
import { Link } from "react-router-dom";

export type SampleChange = {
  primaryId: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  rowNode: RowNode;
};

function getAgGridDateColFilterConfigs({
  maxValidYear = new Date().getFullYear(),
}: { maxValidYear?: number } = {}): IFilterDef {
  return {
    filter: "agDateColumnFilter",
    filterParams: {
      buttons: ["apply", "reset"],
      filterOptions: ["inRange"],
      inRangeInclusive: true,
      minValidYear: 2016,
      maxValidYear: maxValidYear,
      suppressAndOrCondition: true,
    },
  };
}

function getAgGridBooleanColFilterConfigs({
  showBlanksFilterOption = false,
}: { showBlanksFilterOption?: Boolean } = {}): IFilterDef {
  return {
    filter: true,
    filterParams: {
      values: !showBlanksFilterOption ? ["Yes", "No"] : ["Yes", "No", ""],
      suppressMiniFilter: true,
    },
  };
}

function getAgGridBooleanValueFormatter({
  trueVal,
  falseVal,
}: {
  // The true/false values that appear in the database for the given field
  trueVal: String | Boolean;
  falseVal: String | Boolean;
}): ColDef {
  return {
    valueFormatter: (params) => {
      switch (params.value) {
        case trueVal:
          return "Yes";
        case falseVal:
          return "No";
        default:
          return "";
      }
    },
  };
}

export const multiLineColDef: ColDef = {
  wrapText: true,
  autoHeight: true,
  cellStyle: {
    wordBreak: "break-word",
    lineHeight: "1.25",
    padding: "6px 18px",
  },
};

export const requestColDefs: ColDef<DashboardRequest>[] = [
  {
    headerName: "View Samples",
    cellRenderer: (params: ICellRendererParams) => {
      return (
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
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
        </div>
      );
    },
    sortable: false,
  },
  {
    headerName: "Status",
    cellRenderer: (params: ICellRendererParams<DashboardRequest>) => {
      if (!params.data) return null;
      const {
        igoRequestId,
        validationStatus,
        validationReport,
        toleratedSampleErrors,
      } = params.data;
      // add check for toleratedSampleErrors if ultimately deciding to displaying tolerated errors always
      // even on the request validation error popup
      return validationReport !== null && validationReport !== "{}" ? (
        <RecordValidation
          validationStatus={validationStatus}
          validationReport={validationReport}
          toleratedSampleErrors={toleratedSampleErrors}
          modalTitle={`Error report for request ${igoRequestId}`}
          recordStatusMap={REQUEST_STATUS_MAP}
        />
      ) : (
        <CheckIcon className="check-icon" />
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
    field: "importDate",
    headerName: "Import Date",
    ...getAgGridDateColFilterConfigs(),
  },
  {
    field: "totalSampleCount",
    headerName: "# Samples",
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
    ...getAgGridBooleanColFilterConfigs(),
    ...getAgGridBooleanValueFormatter({
      trueVal: true,
      falseVal: false,
    }),
  },
  {
    field: "isCmoRequest",
    headerName: "CMO Request?",
    ...getAgGridBooleanColFilterConfigs(),
    ...getAgGridBooleanValueFormatter({
      trueVal: true,
      falseVal: false,
    }),
  },
  {
    field: "otherContactEmails",
    headerName: "Other Contact Emails",
  },
];

const phiColDefProps = {
  hide: true,
  cellStyle: { color: "crimson" },
  sortable: false,
};

export const patientColDefs: ColDef<DashboardPatient>[] = [
  {
    headerName: "View Samples",
    cellRenderer: (params: ICellRendererParams) => {
      return (
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => {
            const patientId =
              params.data.cmoPatientId || params.data.dmpPatientId;
            params.context.navigateFunction(`/patients/${patientId}`);
          }}
        >
          View
        </Button>
      );
    },
    sortable: false,
  },
  {
    field: "mrn",
    headerName: "Patient MRN",
    width: 175, // prevent truncation when being un-hidden
    ...phiColDefProps,
  },
  {
    field: "anchorSequencingDate",
    headerName: "Anchor Sequencing Date",
    width: 260, // prevent truncation when being un-hidden
    ...phiColDefProps,
  },
  {
    field: "anchorOncotreeCode",
    headerName: "Anchor OncoTree Code",
    width: 260, // prevent truncation when being un-hidden
    ...phiColDefProps,
  },
  {
    field: "cmoPatientId",
    headerName: "CMO Patient ID",
  },
  {
    field: "dmpPatientId",
    headerName: "DMP Patient ID",
  },
  {
    field: "consentPartA",
    headerName: "12-245 Part A",
    ...getAgGridBooleanColFilterConfigs({
      showBlanksFilterOption: true,
    }),
    ...getAgGridBooleanValueFormatter({
      trueVal: "YES",
      falseVal: "NO",
    }),
  },
  {
    field: "consentPartC",
    headerName: "12-245 Part C",
    ...getAgGridBooleanColFilterConfigs({
      showBlanksFilterOption: true,
    }),
    ...getAgGridBooleanValueFormatter({
      trueVal: "YES",
      falseVal: "NO",
    }),
  },
  {
    field: "inDbGap",
    headerName: "dbGaP",
    ...getAgGridBooleanColFilterConfigs({
      showBlanksFilterOption: false,
    }),
    ...getAgGridBooleanValueFormatter({
      trueVal: true,
      falseVal: false,
    }),
  },
  {
    field: "totalSampleCount",
    headerName: "# Samples",
  },
  {
    field: "cmoSampleIds",
    headerName: "Sample IDs",
    maxWidth: 300,
  },
  {
    field: "smilePatientId",
    headerName: "SMILE Patient ID",
    hide: true,
  },
];

export const allAnchorSeqDateColDefs: ColDef<AnchorSeqDateData>[] = [
  {
    field: "MRN",
    headerName: "Patient MRN",
  },
  {
    field: "DMP_PATIENT_ID",
    headerName: "DMP Patient ID",
  },
  {
    field: "ANCHOR_SEQUENCING_DATE",
    headerName: "Anchor Sequencing Date",
  },
  {
    field: "ANCHOR_ONCOTREE_CODE",
    headerName: "Anchor OncoTree Code",
  },
];

function LoadingIcon() {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

export const sampleColDefs: ColDef<DashboardSample>[] = [
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
          <CheckIcon />
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
    width: 260, // prevent truncation when being un-hidden
    ...phiColDefProps,
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
              <LaunchIcon style={{ height: "16px", width: "16px" }} />
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

export const DbGapPhenotypeColumns: ColDef<DashboardSample>[] = [
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

function createCustomHeader(icons: string) {
  return {
    template: `
    <div class="ag-cell-label-container" role="presentation">
      <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button" aria-hidden="true"></span>
      ${icons}
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

const lockIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" fill="none" viewBox="0 -4 30 30" stroke="gray" ' +
  'stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" ' +
  'd="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>';

const toolTipIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" viewBox="0 -1 25 25"> <path fill="#9c9c9c" ' +
  'd="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9m0 13q-2.075 ' +
  "0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 " +
  "8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 " +
  '6.325T4 12t2.325 5.675T12 20m0-8" /></svg>';

function setupEditableSampleFields(
  samplesColDefs: ColDef[],
  editableFieldsList: Set<string>
) {
  samplesColDefs.forEach((colDef) => {
    const newClassRule = {
      unsubmittedChange: (params: CellClassParams) => {
        const changes: SampleChange[] = params.context?.getChanges();
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
          const changes: SampleChange[] = params.context?.getChanges();
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

export const cohortColDefs: ColDef<DashboardCohort>[] = [
  {
    headerName: "View Samples",
    cellRenderer: (params: ICellRendererParams) => {
      return (
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => {
            if (params.data.cohortId !== undefined) {
              params.context.navigateFunction(
                `/cohorts/${params.data.cohortId}`
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
    field: "cohortId",
    headerName: "Cohort ID",
  },
  {
    field: "totalSampleCount",
    headerName: "# Samples",
  },
  {
    field: "billed",
    headerName: "Billed",
    ...getAgGridBooleanColFilterConfigs(),
  },
  {
    field: "initialCohortDeliveryDate",
    headerName: "Initial Cohort Delivery Date",
    valueFormatter: (params) => formatDate(params.value) ?? "",
    ...getAgGridDateColFilterConfigs(),
  },
  {
    field: "endUsers",
    headerName: "End Users",
  },
  {
    field: "pmUsers",
    headerName: "PM Users",
  },
  {
    field: "projectTitle",
    headerName: "Project Title",
  },
  {
    field: "projectSubtitle",
    headerName: "Project Subtitle",
  },
  {
    field: "status",
    headerName: "Status",
  },
  {
    field: "type",
    headerName: "Type",
  },
];

export const wesSampleColDefs: ColDef<DashboardSample>[] = [
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
              <LaunchIcon style={{ height: "16px", width: "16px" }} />
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
        if (params.colDef.field === "costCenter") {
          return !isValidCostCenter(params.value);
        }
        return false;
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

export const accessSampleColDefs: ColDef<DashboardSample>[] = [
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
          <CheckIcon />
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

export const readOnlyWesSampleColDefs = _.cloneDeep(wesSampleColDefs);
export const readOnlyAccessSampleColDefs = _.cloneDeep(accessSampleColDefs);

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

const allEditableFields = new Set(
  Array.from(editableSampleFields).concat(Array.from(editableWesSampleFields))
);

setupEditableSampleFields(sampleColDefs, editableSampleFields);
setupEditableSampleFields(wesSampleColDefs, editableWesSampleFields);

export const combinedSampleColDefs = _.uniqBy(
  [
    ...sampleColDefs,
    ...readOnlyWesSampleColDefs,
    ...readOnlyAccessSampleColDefs,
  ],
  "field"
);

function getTooltipValue(params: ITooltipParams) {
  if (!params.colDef || !("field" in params.colDef)) return undefined;
  const field = params.colDef.field;
  if (
    (field === "cancerType" || field === "cancerTypeDetailed") &&
    params.value === "N/A"
  ) {
    return (
      "This code might have changed between different versions of the Oncotree API. " +
      "For more details, visit oncotree.mskcc.org/mapping"
    );
  }
  if (
    allEditableFields.has(field!) &&
    params.data?.sampleCategory === "clinical"
  ) {
    return "Clinical samples are not editable";
  }
  if (!allEditableFields.has(field!)) {
    return "This column is read-only";
  }
}

export const defaultColDef: ColDef = {
  sortable: true,
  resizable: true,
  editable: false,
  headerComponentParams: createCustomHeader(lockIcon),
  valueFormatter: (params) => (params.value === "null" ? "" : params.value),
  tooltipValueGetter: (params: ITooltipParams) => getTooltipValue(params),
};

export function formatDate(date: moment.MomentInput) {
  return date ? moment(date).format("YYYY-MM-DD") : null;
}

export function isValidCostCenter(costCenter: string): boolean {
  if (!costCenter) return true;
  if (costCenter.length !== 11) return false;
  const validCostCenter = new RegExp("^\\d{5}/\\d{5}$");
  return validCostCenter.test(costCenter);
}

export function getColumnFilters(
  params: IServerSideGetRowsParams
): DashboardRecordColumnFilter[] | undefined {
  const filterModel = params.request.filterModel;
  if (!filterModel || Object.keys(filterModel).length === 0) {
    // All filter values are selected
    return undefined;
  }

  return Object.entries(filterModel).map(([field, value]) => ({
    field,
    // Flexibly handle AG Grid's `any` type for filter settings by JSON.parse() this string value,
    // then check the field name before consuming it at the GraphQL server (see https://stackoverflow.com/a/45601881)
    filter: JSON.stringify(value),
  }));
}

export const CACHE_BLOCK_SIZE = 500; // number of rows to fetch at a time

export interface IExportDropdownItem {
  label: string;
  columnDefs: ColDef[];
  customLoader?: () => Promise<any>;
  disabled?: boolean;
  tooltip?: string;
}
