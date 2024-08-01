import {
  PatientAlias,
  Sample,
  SamplesListQuery,
  SortDirection,
} from "../generated/graphql";

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

export function generateFieldResolvers<ParentType>(
  flattenedFields: string[],
  nodeLabel: string
) {
  return flattenedFields.reduce((resolvers, fieldName) => {
    resolvers[fieldName] = (parent: ParentType) => {
      return getNestedValue(parent, nodeLabel, fieldName);
    };
    return resolvers;
  }, {} as Record<string, (parent: ParentType) => any>);
}

export function getNestedValue(
  parent: any,
  nodeLabel: string,
  fieldName: string
) {
  if (nodeLabel === "Request") {
    switch (fieldName) {
      case "importDate":
        return parent.hasMetadataRequestMetadata[0]?.importDate;
      case "totalSampleCount":
        return parent.hasSampleSamplesConnection?.totalCount;
    }
  }

  if (nodeLabel === "Patient") {
    switch (fieldName) {
      case "cmoPatientId":
        return parent.patientAliasesIsAlias?.find(
          (patientAlias: PatientAlias) => patientAlias.namespace === "cmoId"
        )?.value;
      case "dmpPatientId":
        return parent.patientAliasesIsAlias?.find(
          (patientAlias: PatientAlias) => patientAlias.namespace === "dmpId"
        )?.value;
      case "totalSampleCount":
        return parent.hasSampleSamplesConnection?.totalCount;
      case "cmoSampleIds":
        return parent.hasSampleSamples
          ?.map((s: Sample) => {
            const sampleMetadata = s.hasMetadataSampleMetadata[0];
            return sampleMetadata?.cmoSampleName || sampleMetadata?.primaryId;
          })
          ?.join(", ");
      case "consentPartA":
        try {
          return JSON.parse(
            parent.hasSampleSamples[0].hasMetadataSampleMetadata[0]
              .additionalProperties
          )["consent-parta"];
        } catch {
          return null;
        }
      case "consentPartC":
        try {
          return JSON.parse(
            parent.hasSampleSamples[0].hasMetadataSampleMetadata[0]
              .additionalProperties
          )["consent-partc"];
        } catch {
          return null;
        }
    }
  }

  if (nodeLabel === "Cohort") {
    switch (fieldName) {
      case "totalSampleCount":
        return parent.hasCohortSampleSamplesConnection?.totalCount;
      case "smileSampleIds":
        return parent.hasCohortSampleSamples?.map(
          (s: Sample) => s.smileSampleId
        );
      case "billed":
        const samples: SamplesListQuery["samples"] =
          parent.hasCohortSampleSamples;
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
  }
}

export function sortArrayByNestedField(
  arr: any[],
  nodeLabel: string,
  fieldName: string,
  sortOrder: SortDirection
) {
  arr.sort((objA, objB) => {
    let a = getNestedValue(objA, nodeLabel, fieldName);
    let b = getNestedValue(objB, nodeLabel, fieldName);

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
