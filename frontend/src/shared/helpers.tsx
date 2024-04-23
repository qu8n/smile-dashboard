import {
  ColDef,
  ICellRendererParams,
  IHeaderParams,
  RowNode,
  ITooltipParams,
} from "ag-grid-community";
import { Button } from "react-bootstrap";
import "ag-grid-enterprise";
import {
  PatientsListQuery,
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

export function preparePatientDataForAgGrid(
  patientsListQueryResult: PatientsListQuery
) {
  const { patientsConnection, patients } = patientsListQueryResult;

  const newPatients = patients.map((p) => {
    const {
      smilePatientId,
      patientAliasesIsAlias: patientAliases,
      hasSampleSamplesConnection: samplesConnection,
      hasSampleSamples: samples,
    } = p;
    const cmoPatientId = patientAliases?.find(
      (pa) => pa.namespace === "cmoId"
    )?.value;
    const dmpPatientId = patientAliases?.find(
      (pa) => pa.namespace === "dmpId"
    )?.value;

    const totalSamples = samplesConnection?.totalCount;

    const cmoSampleIds = samples?.map((s) => {
      const sampleMetadata = s.hasMetadataSampleMetadata[0];
      return sampleMetadata?.cmoSampleName || sampleMetadata?.primaryId;
    });

    const additionalProperties =
      samples[0]?.hasMetadataSampleMetadata[0]?.additionalProperties;
    const additionalPropertiesJson = additionalProperties
      ? JSON.parse(additionalProperties)
      : {};
    const consentPartA = additionalPropertiesJson["consent-parta"];
    const consentPartC = additionalPropertiesJson["consent-partc"];

    return {
      cmoPatientId,
      dmpPatientId,
      totalSamples,
      cmoSampleIds,
      consentPartA,
      consentPartC,
      smilePatientId,
    };
  });

  return {
    patientsConnection,
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
    headerName: "CMO Sample IDs",
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

export const SampleDetailsColumns: ColDef<SampleMetadataExtended>[] = [
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
    colDef.cellClassRules = {
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

    if (colDef.valueGetter === undefined) {
      colDef.valueGetter = (params) => {
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
    headerName: "# Samples",
    valueGetter: ({ data }) =>
      data["hasCohortSampleSamplesConnection"].totalCount,
    sortable: false,
  },
  {
    headerName: "Billed",
    valueGetter: ({ data }) => {
      return data["hasCohortSampleSamples"]?.every((sample: Sample) => {
        return sample.hasTempoTempos?.[0]?.billed === true;
      });
    },
    valueFormatter: (params) => (params.value === true ? "Yes" : "No"),
  },
  {
    headerName: "Initial Cohort Delivery Date",
    valueGetter: ({ data }) => {
      const earliestCohortCompleteDate =
        data["hasCohortCompleteCohortCompletes"]?.slice(-1)[0]?.date;
      return formatCohortRelatedDate(earliestCohortCompleteDate);
    },
    sortable: false,
  },
  {
    headerName: "Complete Date",
    valueGetter: ({ data }) =>
      data["hasCohortCompleteCohortCompletes"][0]?.date,
    sortable: false,
    hide: true,
  },
  {
    headerName: "End Users",
    valueGetter: ({ data }) =>
      data["hasCohortCompleteCohortCompletes"][0]?.endUsers,
    sortable: false,
  },
  {
    headerName: "PM Users",
    valueGetter: ({ data }) =>
      data["hasCohortCompleteCohortCompletes"][0]?.pmUsers,
    sortable: false,
  },
  {
    headerName: "Project Title",
    valueGetter: ({ data }) =>
      data["hasCohortCompleteCohortCompletes"][0]?.projectTitle,
    sortable: false,
  },
  {
    headerName: "Project Subtitle",
    valueGetter: ({ data }) =>
      data["hasCohortCompleteCohortCompletes"][0]?.projectSubtitle,
    sortable: false,
  },
  {
    headerName: "Status",
    valueGetter: ({ data }) =>
      data["hasCohortCompleteCohortCompletes"][0]?.status,
    sortable: false,
  },
  {
    headerName: "Type",
    valueGetter: ({ data }) =>
      data["hasCohortCompleteCohortCompletes"][0]?.type,
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
    field: "deliveryDate",
    headerName: "Initial Pipeline Run Date",
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
  },
  {
    field: "costCenter",
    headerName: "Cost Center",
    editable: true,
  },
  {
    field: "billedBy",
    headerName: "Edited By",
    headerTooltip: 'User who last updated the "Billed" status',
    headerComponentParams: createCustomHeader(lockIcon + toolTipIcon),
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

setupEditableSampleFields(SampleDetailsColumns);
setupEditableSampleFields(CohortSampleDetailsColumns);

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
  } else {
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
    const cohorts = s.cohortsHasCohortSampleConnection?.edges;
    const cohortDates = cohorts?.flatMap((c) => {
      return c.node.hasCohortCompleteCohortCompletes.map((cc) => {
        return cc.date;
      });
    });
    const deliveryDate = cohortDates?.sort()[0]; // earliest cohort date

    const tempo = s.hasTempoTempos?.[0];
    const { billed, billedBy, costCenter } = tempo ?? {};

    const bamComplete = tempo?.hasEventBamCompletes?.[0];
    const { date: bamCompleteDate, status: bamCompleteStatus } =
      bamComplete ?? {};

    const mafComplete = tempo?.hasEventMafCompletes?.[0];
    const {
      date: mafCompleteDate,
      status: mafCompleteStatus,
      normalPrimaryId: mafCompleteNormalPrimaryId,
    } = mafComplete ?? {};

    const qcComplete = tempo?.hasEventQcCompletes?.[0];
    const {
      date: qcCompleteDate,
      result: qcCompleteResult,
      reason: qcCompleteReason,
      status: qcCompleteStatus,
    } = qcComplete ?? {};

    return {
      ...s.hasMetadataSampleMetadata[0],
      revisable: s.revisable,
      deliveryDate: formatCohortRelatedDate(deliveryDate),
      billed,
      billedBy,
      costCenter,
      bamCompleteDate: formatCohortRelatedDate(bamCompleteDate),
      bamCompleteStatus,
      mafCompleteDate: formatCohortRelatedDate(mafCompleteDate),
      mafCompleteStatus,
      mafCompleteNormalPrimaryId,
      qcCompleteDate: formatCohortRelatedDate(qcCompleteDate),
      qcCompleteResult,
      qcCompleteReason,
      qcCompleteStatus,
    };
  });
}

export function handleSearch(
  userSearchVal: string,
  setParsedSearchVals: Dispatch<SetStateAction<string[]>>
) {
  const parsedSearchVals = parseUserSearchVal(userSearchVal);
  setParsedSearchVals(parsedSearchVals);
}

function formatCohortRelatedDate(date: string) {
  return date?.split(" ")[0];
}
