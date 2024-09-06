import {
  CohortsListQuery,
  PatientsListQuery,
  RequestsListQuery,
  SamplesListQuery,
  SortDirection,
} from "../generated/graphql";
import { CachedOncotreeData, fetchAndCacheOncotreeData } from "./oncotree";
import { ApolloServerContext } from "./servers";

export const flattenedRequestFields = ["importDate", "totalSampleCount"];

export const flattenedPatientFields = [
  "cmoPatientId",
  "dmpPatientId",
  "totalSampleCount",
  "cmoSampleIds",
  "consentPartA",
  "consentPartC",
];

export const flattenedCohortFields = [
  "totalSampleCount",
  "smileSampleIds",
  "billed",
  "initialCohortDeliveryDate",
  "endUsers",
  "pmUsers",
  "projectTitle",
  "projectSubtitle",
  "status",
  "type",
];

type SampleMetadataKey =
  keyof SamplesListQuery["samples"][number]["hasMetadataSampleMetadata"][number];
const flattenedSampleMetadataFields: SampleMetadataKey[] = [
  "additionalProperties",
  "baitSet",
  "cfDNA2dBarcode",
  "cmoInfoIgoId",
  "cmoPatientId",
  "cmoSampleIdFields",
  "cmoSampleName",
  "collectionYear",
  "genePanel",
  "igoComplete",
  "igoRequestId",
  "importDate",
  "investigatorSampleId",
  "libraries",
  "oncotreeCode",
  "preservation",
  "primaryId",
  "qcReports",
  "sampleClass",
  "sampleName",
  "sampleOrigin",
  "sampleType",
  "sex",
  "species",
  "tissueLocation",
  "tubeId",
  "tumorOrNormal",
];

type SampleMetadataStatusKey =
  keyof SamplesListQuery["samples"][number]["hasMetadataSampleMetadata"][number]["hasStatusStatuses"][number];
const flattenedSampleMetadataStatusFields: SampleMetadataStatusKey[] = [
  "validationReport",
  "validationStatus",
];

type TempoKey =
  keyof SamplesListQuery["samples"][number]["hasTempoTempos"][number];
const flattenedTempoFields: TempoKey[] = [
  "smileTempoId",
  "billed",
  "costCenter",
  "billedBy",
  "custodianInformation",
  "accessLevel",
];

const flattenedTempoCustomFields = [
  "initialPipelineRunDate",
  "embargoDate",
  "bamCompleteDate",
  "bamCompleteStatus",
  "mafCompleteDate",
  "mafCompleteNormalPrimaryId",
  "mafCompleteStatus",
  "qcCompleteDate",
  "qcCompleteResult",
  "qcCompleteReason",
  "qcCompleteStatus",
];

const flattenedOncotreeFields = ["cancerType", "cancerTypeDetailed"];

export const flattenedSampleFields = [
  ...flattenedSampleMetadataFields,
  ...flattenedSampleMetadataStatusFields,
  ...flattenedTempoFields,
  ...flattenedTempoCustomFields,
  ...flattenedOncotreeFields,
  "recipe",
  "dmpPatientId",
];

export function generateFieldResolvers(
  flattenedFields: string[],
  nodeLabel: keyof typeof nestedValueGetters
) {
  return flattenedFields.reduce((resolvers, fieldName) => {
    resolvers[fieldName] = (parent, _args, context, _info) => {
      return nestedValueGetters[nodeLabel](parent, fieldName, context);
    };
    return resolvers;
  }, {} as Record<string, (parent: any, _args: any, context: ApolloServerContext, _info: any) => any>);
}

type NestedValueGetters = {
  Request: (
    parent: RequestsListQuery["requests"][number],
    fieldName: any,
    context?: ApolloServerContext
  ) => any;
  Patient: (
    parent: PatientsListQuery["patients"][number],
    fieldName: any,
    context?: ApolloServerContext
  ) => string | number | boolean | null;
  Sample: (
    parent: SamplesListQuery["samples"][number],
    fieldName: any,
    context?: ApolloServerContext
  ) => any;
  Cohort: (
    parent: CohortsListQuery["cohorts"][number],
    fieldName: any,
    context?: ApolloServerContext
  ) => any;
};

const nestedValueGetters: NestedValueGetters = {
  Request: (parent, fieldName, _context) => {
    switch (fieldName) {
      case "importDate":
        return parent.hasMetadataRequestMetadata[0]?.importDate;
      case "totalSampleCount":
        return parent.hasSampleSamplesConnection?.totalCount;
    }
  },
  Patient: (parent, fieldName, _context) => {
    switch (fieldName) {
      case "cmoPatientId":
        return parent.patientAliasesIsAlias?.find(
          (patientAlias) => patientAlias.namespace === "cmoId"
        )?.value;
      case "dmpPatientId":
        return parent.patientAliasesIsAlias?.find(
          (patientAlias) => patientAlias.namespace === "dmpId"
        )?.value;
      case "totalSampleCount":
        return parent.hasSampleSamplesConnection?.totalCount;
      case "cmoSampleIds":
        return parent.hasSampleSamples
          ?.map((s) => {
            const sampleMetadata = s.hasMetadataSampleMetadata[0];
            return sampleMetadata?.cmoSampleName || sampleMetadata?.primaryId;
          })
          ?.join(", ");
      case "consentPartA":
        try {
          return parent.hasSampleSamples
            .map((s) => {
              return JSON.parse(
                s.hasMetadataSampleMetadata[0].additionalProperties
              )["consent-parta"];
            })
            .find((value) => value !== undefined);
        } catch {
          return null;
        }
      case "consentPartC":
        try {
          return parent.hasSampleSamples
            .map((s) => {
              return JSON.parse(
                s.hasMetadataSampleMetadata[0].additionalProperties
              )["consent-partc"];
            })
            .find((value) => value !== undefined);
        } catch {
          return null;
        }
    }
  },
  Sample: async (parent, fieldName, context) => {
    if (flattenedSampleMetadataFields.includes(fieldName)) {
      return parent.hasMetadataSampleMetadata?.[0]?.[
        fieldName as SampleMetadataKey
      ];
    }
    if (flattenedSampleMetadataStatusFields.includes(fieldName)) {
      return parent.hasMetadataSampleMetadata?.[0]?.hasStatusStatuses?.[0]?.[
        fieldName as SampleMetadataStatusKey
      ];
    }
    if (flattenedTempoFields.includes(fieldName)) {
      return parent.hasTempoTempos?.[0]?.[fieldName as TempoKey];
    }
    if (flattenedTempoCustomFields.includes(fieldName)) {
      const cohortDates = parent.cohortsHasCohortSample?.flatMap((c) => {
        return c.hasCohortCompleteCohortCompletes.map((cc) => {
          return cc.date;
        });
      });
      const initialPipelineRunDate = cohortDates?.sort()[0];
      const tempo = parent.hasTempoTempos?.[0];
      const bamComplete = tempo?.hasEventBamCompletes?.[0];
      const mafComplete = tempo?.hasEventMafCompletes?.[0];
      const qcComplete = tempo?.hasEventQcCompletes?.[0];
      switch (fieldName) {
        case "initialPipelineRunDate":
          return initialPipelineRunDate;
        case "embargoDate":
          if (initialPipelineRunDate) {
            const embargoDate = new Date(initialPipelineRunDate);
            embargoDate.setMonth(embargoDate.getMonth() + 18);
            return embargoDate.toISOString();
          }
          return null;
        case "bamCompleteDate":
          return bamComplete?.date;
        case "bamCompleteStatus":
          return bamComplete?.status;
        case "mafCompleteDate":
          return mafComplete?.date;
        case "mafCompleteNormalPrimaryId":
          return mafComplete?.normalPrimaryId;
        case "mafCompleteStatus":
          return mafComplete?.status;
        case "qcCompleteDate":
          return qcComplete?.date;
        case "qcCompleteResult":
          return qcComplete?.result;
        case "qcCompleteReason":
          return qcComplete?.reason;
        case "qcCompleteStatus":
          return qcComplete?.status;
      }
    }
    if (flattenedOncotreeFields.includes(fieldName)) {
      const { oncotreeCode } = parent.hasMetadataSampleMetadata?.[0];
      const { oncotreeCache } = context || {};
      if (!oncotreeCode) return null;
      let cachedData = oncotreeCache?.get<CachedOncotreeData>(oncotreeCode);
      if (!cachedData && oncotreeCache) {
        await fetchAndCacheOncotreeData(oncotreeCache);
        cachedData = oncotreeCache.get(oncotreeCode);
      }
      switch (fieldName) {
        case "cancerType":
          return cachedData?.mainType;
        case "cancerTypeDetailed":
          return cachedData?.name;
      }
    }
    switch (fieldName) {
      case "recipe":
        const cmoSampleIds =
          parent.hasMetadataSampleMetadata?.[0]?.cmoSampleIdFields;
        try {
          const cmoSampleIdsObj = JSON.parse(cmoSampleIds);
          return cmoSampleIdsObj["recipe"];
        } catch {
          return null;
        }
      case "dmpPatientId":
        return parent.patientsHasSample?.[0]?.patientAliasesIsAlias?.find(
          (patientAlias) => patientAlias.namespace === "dmpId"
        )?.value;
    }
  },
  Cohort: (parent, fieldName, _context) => {
    switch (fieldName) {
      case "totalSampleCount":
        return parent.hasCohortSampleSamplesConnection?.totalCount;
      case "smileSampleIds":
        return parent.hasCohortSampleSamples?.map((s) => s.smileSampleId);
      case "billed":
        const samples = parent.hasCohortSampleSamples;
        const allSamplesBilled =
          samples?.length > 0 &&
          samples.every((sample) => sample.hasTempoTempos?.[0]?.billed);
        return allSamplesBilled ? "Yes" : "No";
      case "initialCohortDeliveryDate":
        return parent.hasCohortCompleteCohortCompletes?.slice(-1)[0]?.date;
      case "endUsers":
        return parent.hasCohortCompleteCohortCompletes?.[0]?.endUsers;
      case "pmUsers":
        return parent.hasCohortCompleteCohortCompletes?.[0]?.pmUsers;
      case "projectTitle":
        return parent.hasCohortCompleteCohortCompletes?.[0]?.projectTitle;
      case "projectSubtitle":
        return parent.hasCohortCompleteCohortCompletes?.[0]?.projectSubtitle;
      case "status":
        return parent.hasCohortCompleteCohortCompletes?.[0]?.status;
      case "type":
        return parent.hasCohortCompleteCohortCompletes?.[0]?.type;
    }
  },
};

export async function sortArrayByNestedField(
  arr: any[],
  nodeLabel: keyof typeof nestedValueGetters,
  fieldName: string,
  sortOrder: SortDirection,
  context?: ApolloServerContext
) {
  // Although the parts of nestedValueGetters that we use are all synchronous,
  // it's still an async function and could return a promise
  const resolvedValues = await Promise.all(
    arr.map((obj) => nestedValueGetters[nodeLabel](obj, fieldName, context))
  );

  arr.sort((objA, objB) => {
    const indexA = arr.indexOf(objA);
    const indexB = arr.indexOf(objB);
    let a = resolvedValues[indexA];
    let b = resolvedValues[indexB];

    if (a === null || a === undefined) return 1;
    if (b === null || b === undefined) return -1;

    if (Array.isArray(a)) a = a.join(", ");
    if (Array.isArray(b)) b = b.join(", ");

    if (typeof a === "number" && typeof b === "number") {
      return sortOrder === "ASC" ? a - b : b - a;
    } else if (typeof a === "string" && typeof b === "string") {
      return sortOrder === "ASC"
        ? a.localeCompare(b, "en", { sensitivity: "base" })
        : b.localeCompare(a, "en", { sensitivity: "base" });
    } else {
      return 0;
    }
  });
}
