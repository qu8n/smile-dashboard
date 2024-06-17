import {
  ColDef,
  ICellRendererParams,
  IHeaderParams,
  RowNode,
  ITooltipParams,
  ValueFormatterParams,
  IServerSideGetRowsRequest,
  CellClassParams,
} from "ag-grid-community";
import { Button } from "react-bootstrap";
import "ag-grid-enterprise";
import {
  CohortsListQuery,
  PatientsListQuery,
  RequestsListQuery,
  Sample,
  SampleMetadata,
  SampleMetadataWhere,
  SampleWhere,
  TempoWhere,
} from "../generated/graphql";
import WarningIcon from "@material-ui/icons/Warning";
import CheckIcon from "@material-ui/icons/Check";
import { StatusTooltip } from "./components/StatusToolTip";
import { parseUserSearchVal } from "../utils/parseSearchQueries";
import { Dispatch, SetStateAction } from "react";
import moment from "moment";
import _ from "lodash";

export interface SampleMetadataExtended extends SampleMetadata {
  revisable: boolean;
}

export type SampleChange = {
  primaryId: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  rowNode: RowNode;
};

export type ChangesByPrimaryId = {
  [primaryId: string]: {
    [fieldName: string]: string;
  };
};

export const RequestsListColumns: ColDef[] = [
  {
    headerName: "View Samples",
    cellRenderer: (params: ICellRendererParams) => {
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
    field: "totalSamples",
    headerName: "# Samples",
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

export function prepareRequestDataForAgGrid(
  requestsListQueryResult: RequestsListQuery
) {
  const newRequests = requestsListQueryResult.requests.map((request) => {
    return {
      totalSamples: request.hasSampleSamplesConnection?.totalCount,
      ...request,
    };
  });

  return {
    requestsConnection: requestsListQueryResult.requestsConnection,
    requests: newRequests,
  };
}

export function preparePatientDataForAgGrid(
  patientsListQueryResult: PatientsListQuery
) {
  const newPatients = patientsListQueryResult.patients.map((patient) => {
    const samples = patient.hasSampleSamples;
    const patientAliases = patient.patientAliasesIsAlias;

    const cmoPatientId = patientAliases?.find(
      (pa) => pa.namespace === "cmoId"
    )?.value;
    const dmpPatientId = patientAliases?.find(
      (pa) => pa.namespace === "dmpId"
    )?.value;

    const cmoSampleIds = samples?.map((s) => {
      const sampleMetadata = s.hasMetadataSampleMetadata[0];
      return sampleMetadata?.cmoSampleName || sampleMetadata?.primaryId;
    });

    const additionalProperties =
      samples[0]?.hasMetadataSampleMetadata[0]?.additionalProperties;
    const additionalPropertiesJson = additionalProperties
      ? JSON.parse(additionalProperties)
      : {};

    return {
      cmoPatientId,
      dmpPatientId,
      cmoSampleIds,
      smilePatientId: patient.smilePatientId,
      totalSamples: patient.hasSampleSamplesConnection?.totalCount,
      consentPartA: additionalPropertiesJson["consent-parta"],
      consentPartC: additionalPropertiesJson["consent-partc"],
    };
  });

  return {
    patientsConnection: patientsListQueryResult.patientsConnection,
    patients: newPatients,
  };
}

export const PatientsListColumns: ColDef[] = [
  {
    headerName: "View Samples",
    cellRenderer: (params: ICellRendererParams) => {
      return (
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={() => {
            params.context.navigateFunction(
              `/patients/${params.data.smilePatientId}`
            );
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
    sortable: false,
  },
  {
    field: "dmpPatientId",
    headerName: "DMP Patient ID",
    sortable: false,
  },
  {
    field: "totalSamples",
    headerName: "# Samples",
    sortable: false,
  },
  {
    field: "cmoSampleIds",
    headerName: "Sample IDs",
    sortable: false,
  },
  {
    field: "consentPartA",
    headerName: "12-245 Part A",
    sortable: false,
  },
  {
    field: "consentPartC",
    headerName: "12-245 Part C",
    sortable: false,
  },
  {
    field: "smilePatientId",
    headerName: "SMILE Patient ID",
    hide: true,
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

export const SampleMetadataDetailsColumns: ColDef<SampleMetadataExtended>[] = [
  {
    field: "primaryId",
    headerName: "Primary ID",
  },
  {
    field: "revisable",
    headerName: "Status",
    cellRenderer: (params: ICellRendererParams) => {
      if (params.data?.revisable) {
        return params.data?.hasStatusStatuses[0]?.validationStatus ? (
          <CheckIcon />
        ) : (
          <WarningIcon />
        );
      } else {
        return <LoadingIcon />;
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
  },
  {
    field: "importDate",
    headerName: "Last Updated",
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
  },
  {
    field: "sex",
    headerName: "Sex",
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
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" fill="none" viewBox="0 -4 30 30" stroke="gray" stroke-width="2"> <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>';

const toolTipIcon =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" viewBox="0 -1 25 25"> <path fill="#9c9c9c" d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8t-.288-.712T12 7t-.712.288T11 8t.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m0-8" /></svg>';

function setupEditableSampleFields(samplesColDefs: ColDef[]) {
  samplesColDefs.forEach((colDef) => {
    const newClassRule = {
      unsubmittedChange: (params: CellClassParams) => {
        const changes: SampleChange[] = params.context.getChanges();
        const changedValue = changes?.find((change) => {
          return (
            change.fieldName === params.colDef.field &&
            change.primaryId === params.data.primaryId
          );
        });
        return changedValue !== undefined;
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
        const changes: SampleChange[] = params.context?.getChanges();
        const changedValue = changes?.find((change) => {
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

    colDef.editable = (params) => {
      return (
        editableSampleFields.includes(params.colDef.field!) &&
        params.data?.revisable === true
      );
    };

    if (!("headerComponentParams" in colDef)) {
      colDef.headerComponentParams = (params: IHeaderParams) => {
        if (!editableSampleFields.includes(params.column.getColDef().field!))
          return createCustomHeader(lockIcon);
      };
    }
  });
}

export function prepareCohortDataForAgGrid(
  cohortsListQueryResult: CohortsListQuery,
  filterModel: IServerSideGetRowsRequest["filterModel"]
) {
  let newCohorts = cohortsListQueryResult.cohorts.map((cohort) => {
    const samples = cohort.hasCohortSampleSamples;
    const cohortCompletes = cohort.hasCohortCompleteCohortCompletes;

    const allSamplesBilled =
      samples.length > 0 &&
      samples?.every((sample) => {
        return sample.hasTempoTempos?.[0].billed === true;
      });

    const latestCohortDeliveryDate = cohortCompletes?.[0];

    return {
      cohortId: cohort.cohortId,
      totalSamples: cohort.hasCohortSampleSamplesConnection.totalCount,
      smileSampleIds: samples.map((s) => s.smileSampleId),
      billed: allSamplesBilled === true ? "Yes" : "No",
      initialCohortDeliveryDate: formatDate(
        cohortCompletes?.slice(-1)[0]?.date
      ),
      completeDate: formatDate(latestCohortDeliveryDate?.date),
      endUsers: latestCohortDeliveryDate?.endUsers,
      pmUsers: latestCohortDeliveryDate?.pmUsers,
      projectTitle: latestCohortDeliveryDate?.projectTitle,
      projectSubtitle: latestCohortDeliveryDate?.projectSubtitle,
      status: latestCohortDeliveryDate?.status,
      type: latestCohortDeliveryDate?.type,
    };
  });

  let newCohortsConnection = { ...cohortsListQueryResult.cohortsConnection };

  if ("initialCohortDeliveryDate" in filterModel) {
    const { dateFrom, dateTo } = filterModel.initialCohortDeliveryDate;
    newCohorts = newCohorts.filter((cohort) => {
      const deliveryDate = cohort.initialCohortDeliveryDate;
      if (!deliveryDate) return false; // handles moment(undefined) returning today's date
      return (
        moment(deliveryDate).isSameOrAfter(dateFrom) &&
        moment(deliveryDate).isSameOrBefore(dateTo)
      );
    });
    newCohortsConnection.totalCount = newCohorts.length;
  }

  if ("billed" in filterModel) {
    const selectedValues = filterModel.billed.values;
    const selectedNone = selectedValues.length === 0;
    if (selectedNone) {
      newCohorts = [];
      newCohortsConnection.totalCount = 0;
    } else {
      newCohorts = newCohorts.filter((cohort) =>
        selectedValues.includes(cohort.billed)
      );
      newCohortsConnection.totalCount = newCohorts.length;
    }
  }

  const uniqueSmileSampleIds: Set<string> = new Set();
  newCohorts.forEach((cohort) => {
    cohort.smileSampleIds.forEach((id) => {
      uniqueSmileSampleIds.add(id);
    });
  });

  return {
    cohorts: newCohorts,
    cohortsConnection: newCohortsConnection,
    uniqueSampleCount: uniqueSmileSampleIds.size,
  };
}

export const CohortsListColumns: ColDef[] = [
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
    field: "totalSamples",
    headerName: "# Samples",
    sortable: false,
  },
  {
    field: "billed",
    headerName: "Billed",
    sortable: false,
    filter: true,
    filterParams: {
      values: ["Yes", "No"],
      suppressMiniFilter: true,
    },
  },
  {
    field: "initialCohortDeliveryDate",
    headerName: "Initial Cohort Delivery Date",
    sortable: false,
    filter: "agDateColumnFilter",
    filterParams: {
      buttons: ["apply", "reset"],
      filterOptions: ["inRange"],
      inRangeInclusive: true,
      minValidYear: 2016,
      maxValidYear: new Date().getFullYear(),
    },
  },
  {
    field: "completeDate",
    headerName: "Complete Date",
    sortable: false,
    hide: true,
  },
  {
    field: "endUsers",
    headerName: "End Users",
    sortable: false,
  },
  {
    field: "pmUsers",
    headerName: "PM Users",
    sortable: false,
  },
  {
    field: "projectTitle",
    headerName: "Project Title",
    sortable: false,
  },
  {
    field: "projectSubtitle",
    headerName: "Project Subtitle",
    sortable: false,
  },
  {
    field: "status",
    headerName: "Status",
    sortable: false,
  },
  {
    field: "type",
    headerName: "Type",
    sortable: false,
  },
];

export const CohortSampleDetailsColumns: ColDef[] = [
  {
    field: "primaryId",
    headerName: "Primary ID",
  },
  {
    field: "cmoSampleName",
    headerName: "CMO Sample Name",
  },
  {
    field: "initialPipelineRunDate",
    headerName: "Initial Pipeline Run Date",
  },
  {
    field: "embargoDate",
    headerName: "Embargo Date",
    editable: false,
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
    valueFormatter: (params) => (params.value === true ? "Yes" : "No"),
    filter: true,
    filterParams: {
      valueFormatter: (params: ValueFormatterParams) =>
        params.value === "true" ? "Yes" : "No",
      suppressMiniFilter: true,
    },
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
    field: "bamCompleteDate",
    headerName: "Latest BAM Complete Date",
  },
  {
    field: "bamCompleteStatus",
    headerName: "BAM Complete Status",
  },
  {
    field: "mafCompleteDate",
    headerName: "Latest MAF Complete Date",
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
];

export const ReadOnlyCohortSampleDetailsColumns = _.cloneDeep(
  CohortSampleDetailsColumns
);

setupEditableSampleFields(SampleMetadataDetailsColumns);
setupEditableSampleFields(CohortSampleDetailsColumns);

export const combinedSampleDetailsColumns = _.uniqBy(
  [...SampleMetadataDetailsColumns, ...ReadOnlyCohortSampleDetailsColumns],
  "field"
);

export const defaultColDef: ColDef = {
  sortable: true,
  resizable: true,
  editable: false,
  headerComponentParams: createCustomHeader(lockIcon),
};

const editableSampleFields = [
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
];

export function sampleFilterWhereVariables(
  parsedSearchVals: string[]
): SampleMetadataWhere[] {
  if (parsedSearchVals.length > 1) {
    return [
      { cmoSampleName_IN: parsedSearchVals },
      { importDate_IN: parsedSearchVals },
      { investigatorSampleId_IN: parsedSearchVals },
      { primaryId_IN: parsedSearchVals },
      { sampleClass_IN: parsedSearchVals },
      { cmoPatientId_IN: parsedSearchVals },
      { cmoSampleIdFields_IN: parsedSearchVals },
      { sampleName_IN: parsedSearchVals },
      { preservation_IN: parsedSearchVals },
      { tumorOrNormal_IN: parsedSearchVals },
      { oncotreeCode_IN: parsedSearchVals },
      { collectionYear_IN: parsedSearchVals },
      { sampleOrigin_IN: parsedSearchVals },
      { tissueLocation_IN: parsedSearchVals },
      { sex_IN: parsedSearchVals },
      { libraries_IN: parsedSearchVals },
      { sampleType_IN: parsedSearchVals },
      { species_IN: parsedSearchVals },
      { genePanel_IN: parsedSearchVals },
    ];
  }

  if (parsedSearchVals.length === 1) {
    return [
      { cmoSampleName_CONTAINS: parsedSearchVals[0] },
      { importDate_CONTAINS: parsedSearchVals[0] },
      { investigatorSampleId_CONTAINS: parsedSearchVals[0] },
      { primaryId_CONTAINS: parsedSearchVals[0] },
      { sampleClass_CONTAINS: parsedSearchVals[0] },
      { cmoPatientId_CONTAINS: parsedSearchVals[0] },
      { cmoSampleIdFields_CONTAINS: parsedSearchVals[0] },
      { sampleName_CONTAINS: parsedSearchVals[0] },
      { preservation_CONTAINS: parsedSearchVals[0] },
      { tumorOrNormal_CONTAINS: parsedSearchVals[0] },
      { oncotreeCode_CONTAINS: parsedSearchVals[0] },
      { collectionYear_CONTAINS: parsedSearchVals[0] },
      { sampleOrigin_CONTAINS: parsedSearchVals[0] },
      { tissueLocation_CONTAINS: parsedSearchVals[0] },
      { sex_CONTAINS: parsedSearchVals[0] },
      { libraries_CONTAINS: parsedSearchVals[0] },
      { sampleType_CONTAINS: parsedSearchVals[0] },
      { species_CONTAINS: parsedSearchVals[0] },
      { genePanel_CONTAINS: parsedSearchVals[0] },
    ];
  }

  return [];
}

export function cohortSampleFilterWhereVariables(
  parsedSearchVals: string[]
): SampleWhere[] {
  let tempoWhere: TempoWhere[] = [];
  if (parsedSearchVals.length > 1) {
    tempoWhere = [
      {
        billedBy_IN: parsedSearchVals,
      },
      {
        costCenter_IN: parsedSearchVals,
      },
      {
        custodianInformation_IN: parsedSearchVals,
      },
      {
        accessLevel_IN: parsedSearchVals,
      },
      {
        hasEventBamCompletes_SOME: {
          date_IN: parsedSearchVals,
        },
      },
      {
        hasEventBamCompletes_SOME: {
          status_IN: parsedSearchVals,
        },
      },
      {
        hasEventMafCompletes_SOME: {
          date_IN: parsedSearchVals,
        },
      },
      {
        hasEventMafCompletes_SOME: {
          normalPrimaryId_IN: parsedSearchVals,
        },
      },
      {
        hasEventMafCompletes_SOME: {
          status_IN: parsedSearchVals,
        },
      },
      {
        hasEventQcCompletes_SOME: {
          date_IN: parsedSearchVals,
        },
      },
      {
        hasEventQcCompletes_SOME: {
          result_IN: parsedSearchVals,
        },
      },
      {
        hasEventQcCompletes_SOME: {
          reason_IN: parsedSearchVals,
        },
      },
      {
        hasEventQcCompletes_SOME: {
          status_IN: parsedSearchVals,
        },
      },
    ];
  } else {
    tempoWhere = [
      {
        billedBy_CONTAINS: parsedSearchVals[0],
      },
      {
        costCenter_CONTAINS: parsedSearchVals[0],
      },
      {
        custodianInformation_CONTAINS: parsedSearchVals[0],
      },
      {
        accessLevel_CONTAINS: parsedSearchVals[0],
      },
      {
        hasEventBamCompletes_SOME: {
          date_CONTAINS: parsedSearchVals[0],
        },
      },
      {
        hasEventBamCompletes_SOME: {
          status_CONTAINS: parsedSearchVals[0],
        },
      },
      {
        hasEventMafCompletes_SOME: {
          date_CONTAINS: parsedSearchVals[0],
        },
      },
      {
        hasEventMafCompletes_SOME: {
          normalPrimaryId_CONTAINS: parsedSearchVals[0],
        },
      },
      {
        hasEventMafCompletes_SOME: {
          status_CONTAINS: parsedSearchVals[0],
        },
      },
      {
        hasEventQcCompletes_SOME: {
          date_CONTAINS: parsedSearchVals[0],
        },
      },
      {
        hasEventQcCompletes_SOME: {
          result_CONTAINS: parsedSearchVals[0],
        },
      },
      {
        hasEventQcCompletes_SOME: {
          reason_CONTAINS: parsedSearchVals[0],
        },
      },
      {
        hasEventQcCompletes_SOME: {
          status_CONTAINS: parsedSearchVals[0],
        },
      },
    ];
  }

  let sampleMetadataWhere: SampleMetadataWhere[] = [];
  if (parsedSearchVals.length > 1) {
    sampleMetadataWhere = [
      { primaryId_IN: parsedSearchVals },
      { cmoSampleName_IN: parsedSearchVals },
    ];
  } else {
    sampleMetadataWhere = [
      { primaryId_CONTAINS: parsedSearchVals[0] },
      { cmoSampleName_CONTAINS: parsedSearchVals[0] },
    ];
  }

  return [
    {
      hasTempoTempos_SOME: {
        OR: tempoWhere,
      },
    },
    {
      hasMetadataSampleMetadata_SOME: {
        OR: sampleMetadataWhere,
      },
    },
  ];
}

export function prepareSampleMetadataForAgGrid(samples: Sample[]) {
  return samples.map((s) => {
    return {
      ...s.hasMetadataSampleMetadata[0],
      revisable: s.revisable,
    };
  });
}

export function prepareSampleCohortDataForAgGrid(samples: Sample[]) {
  return samples.map((s) => {
    const sampleMetadata = s.hasMetadataSampleMetadata[0];
    const tempoData = extractTempoFromSample(s);

    return {
      primaryId: sampleMetadata.primaryId,
      cmoSampleName: sampleMetadata.cmoSampleName,
      hasStatusStatuses: sampleMetadata.hasStatusStatuses,
      revisable: s.revisable,
      ...tempoData,
    };
  });
}

export function prepareCombinedSampleDataForAgGrid(samples: Sample[]) {
  return samples.map((s) => {
    const sampleMetadata = s.hasMetadataSampleMetadata[0];
    const tempoData = extractTempoFromSample(s);

    return {
      revisable: s.revisable,
      ...sampleMetadata,
      ...tempoData,
    };
  });
}

function extractTempoFromSample(s: Sample) {
  const cohorts = s.cohortsHasCohortSampleConnection?.edges;
  const cohortDates = cohorts?.flatMap((c) => {
    return c.node.hasCohortCompleteCohortCompletes.map((cc) => {
      return cc.date;
    });
  });
  const initialPipelineRunDate = cohortDates?.sort()[0];

  let embargoDate;
  if (initialPipelineRunDate) {
    embargoDate = new Date(initialPipelineRunDate);
    embargoDate.setMonth(embargoDate.getMonth() + 18);
  }

  const tempo = s.hasTempoTempos?.[0];
  const bamComplete = tempo?.hasEventBamCompletes?.[0];
  const mafComplete = tempo?.hasEventMafCompletes?.[0];
  const qcComplete = tempo?.hasEventQcCompletes?.[0];

  return {
    initialPipelineRunDate: formatDate(initialPipelineRunDate),
    embargoDate: formatDate(embargoDate),
    billed: tempo?.billed ?? false,
    billedBy: tempo?.billedBy,
    costCenter: tempo?.costCenter,
    custodianInformation: tempo?.custodianInformation,
    accessLevel: tempo?.accessLevel,
    bamCompleteDate: formatDate(bamComplete?.date),
    bamCompleteStatus: bamComplete?.status,
    mafCompleteDate: formatDate(mafComplete?.date),
    mafCompleteStatus: mafComplete?.status,
    mafCompleteNormalPrimaryId: mafComplete?.normalPrimaryId,
    qcCompleteDate: formatDate(qcComplete?.date),
    qcCompleteResult: qcComplete?.result,
    qcCompleteReason: qcComplete?.reason,
    qcCompleteStatus: qcComplete?.status,
  };
}

export function handleSearch(
  userSearchVal: string,
  setParsedSearchVals: Dispatch<SetStateAction<string[]>>
) {
  const parsedSearchVals = parseUserSearchVal(userSearchVal);
  setParsedSearchVals(parsedSearchVals);
}

function formatDate(date: moment.MomentInput) {
  return date ? moment(date).format("YYYY-MM-DD") : null;
}

export function isValidCostCenter(costCenter: string): boolean {
  if (!costCenter) return true;
  if (costCenter.length !== 11) return false;
  const validCostCenter = new RegExp("^\\d{5}/\\d{5}$");
  return validCostCenter.test(costCenter);
}
