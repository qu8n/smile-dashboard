import {
  CellClassParams,
  ColDef,
  ICellRendererParams,
  IHeaderParams,
  RowNode,
} from "ag-grid-community";
import { Button } from "react-bootstrap";
import "ag-grid-enterprise";
import {
  Sample,
  SampleMetadata,
  SampleMetadataWhere,
  SampleWhere,
  TempoWhere,
} from "../generated/graphql";
import WarningIcon from "@material-ui/icons/Warning";
import { StatusTooltip } from "./components/StatusToolTip";
import { ITooltipParams } from "ag-grid-community";
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
  rowNode: RowNode<any>;
};

export type ChangeForSubmit = {
  [primaryId: string]: {
    [fieldName: string]: string;
  };
};

export const RequestsListColumns: ColDef[] = [
  {
    headerName: "View Samples",
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
    headerName: "View Samples",
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

const readOnlyHeader = {
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

SampleDetailsColumns.forEach((colDef) => {
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
      !protectedFields.includes(params.colDef.field!) &&
      params.data?.revisable === true
    );
  };

  colDef.headerComponentParams = (params: IHeaderParams) => {
    if (protectedFields.includes(params.column.getColDef().field!))
      return readOnlyHeader;
  };
});

export const CohortsListColumns: ColDef[] = [
  {
    headerName: "View Samples",
    cellRenderer: (params: CellClassParams<any>) => {
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
    headerName: "Delivery Date",
    valueGetter: ({ data }) =>
      data["hasCohortCompleteCohortCompletes"]?.slice(-1)[0]?.date,
    sortable: false,
  },
  {
    headerName: "Complete Date",
    valueGetter: ({ data }) =>
      data["hasCohortCompleteCohortCompletes"][0]?.date,
    sortable: false,
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

export const CohortSamplesDetailsColumns: ColDef[] = [
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
    headerName: "Delivery Date",
  },
  {
    field: "bamCompleteDate",
    headerName: "BAM Complete Date",
  },
  {
    field: "bamCompleteStatus",
    headerName: "BAM Complete Status",
  },
  {
    field: "mafCompleteDate",
    headerName: "MAF Complete Date",
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
    headerName: "QC Complete Date",
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

export const defaultColDef: ColDef = {
  sortable: true,
  resizable: true,
  headerComponentParams: readOnlyHeader,
};

export const defaultEditableColDef: ColDef = {
  ...defaultColDef,
  editable: true,
};

export const defaultReadOnlyColDef: ColDef = {
  ...defaultColDef,
  editable: false,
};

const protectedFields: string[] = [
  "cmoSampleName",
  "igoComplete",
  "importDate",
  "primaryId",
  "cmoSampleIdFields",
  "libraries",
  "genePanel",
  "baitSet",
  "species",
  "validationStatus",
  "validationReport",
  "revisable",
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

export function getSampleMetadataFromSamplesQuery(samples: Sample[]) {
  return samples.map((s) => {
    return {
      ...s.hasMetadataSampleMetadata[0],
      revisable: s.revisable,
    };
  });
}

export function getSampleCohortDataFromSamplesQuery(samples: Sample[]) {
  return samples.map((s) => {
    const cohorts = s.cohortsHasCohortSampleConnection?.edges;
    const cohortDates = cohorts?.flatMap((c) => {
      return c.node.hasCohortCompleteCohortCompletes.map((cc) => {
        return cc.date;
      });
    });
    const deliveryDate = cohortDates?.sort()[0]; // earliest cohort date

    const tempo = s.hasTempoTempos?.[0];
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
      deliveryDate,
      bamCompleteDate,
      bamCompleteStatus,
      mafCompleteDate,
      mafCompleteStatus,
      mafCompleteNormalPrimaryId,
      qcCompleteDate,
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
