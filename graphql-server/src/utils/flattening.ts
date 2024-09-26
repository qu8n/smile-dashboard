import {
  CohortsListQuery,
  PatientsListQuery,
  RequestsListQuery,
  SortDirection,
} from "../generated/graphql";
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
