"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSamplesDocument =
  exports.SamplesDocument =
  exports.RequestWithSamplesDocument =
  exports.RequestsListDocument =
  exports.RequestPartsFragmentDoc =
  exports.SortDirection =
    void 0;
const client_1 = require("@apollo/client");
var SortDirection;
(function (SortDirection) {
  /** Sort by field values in ascending order. */
  SortDirection["Asc"] = "ASC";
  /** Sort by field values in descending order. */
  SortDirection["Desc"] = "DESC";
})((SortDirection = exports.SortDirection || (exports.SortDirection = {})));
exports.RequestPartsFragmentDoc = (0, client_1.gql)`
    fragment RequestParts on Request {
  igoRequestId
  igoProjectId
  genePanel
  dataAnalystName
  dataAnalystEmail
  dataAccessEmails
  bicAnalysis
  investigatorEmail
  investigatorName
  isCmoRequest
  labHeadEmail
  labHeadName
  libraryType
  otherContactEmails
  piEmail
  projectManagerName
  qcAccessEmails
  smileRequestId
}
    `;
exports.RequestsListDocument = (0, client_1.gql)`
    query RequestsList($options: RequestOptions, $where: RequestWhere, $requestsConnectionWhere2: RequestWhere) {
  requestsConnection(where: $requestsConnectionWhere2) {
    totalCount
  }
  requests(where: $where, options: $options) {
    ...RequestParts
    hasSampleSamplesConnection {
      totalCount
    }
  }
}
    ${exports.RequestPartsFragmentDoc}`;
exports.RequestWithSamplesDocument = (0, client_1.gql)`
    query RequestWithSamples($options: RequestOptions, $where: RequestWhere, $hasSampleSamplesWhere2: SampleWhere, $hasMetadataSampleMetadataWhere2: SampleMetadataWhere, $hasSampleSamplesConnectionWhere2: RequestHasSampleSamplesConnectionWhere, $hasMetadataSampleMetadataOptions2: SampleMetadataOptions) {
  requests(where: $where, options: $options) {
    ...RequestParts
    hasSampleSamples(where: $hasSampleSamplesWhere2) {
      smileSampleId
      sampleCategory
      sampleClass
      datasource
      hasMetadataSampleMetadata(
        where: $hasMetadataSampleMetadataWhere2
        options: $hasMetadataSampleMetadataOptions2
      ) {
        cmoSampleName
        igoComplete
        importDate
        investigatorSampleId
        primaryId
        sampleClass
        cmoPatientId
        cmoSampleIdFields
        sampleName
        preservation
        tumorOrNormal
        oncotreeCode
        collectionYear
        sampleOrigin
        tissueLocation
        sex
        libraries
        sampleType
        species
        genePanel
      }
      patientsHasSample {
        smilePatientId
        patientAliasesIsAlias {
          namespace
          value
        }
      }
    }
    hasSampleSamplesConnection(where: $hasSampleSamplesConnectionWhere2) {
      totalCount
    }
  }
}
    ${exports.RequestPartsFragmentDoc}`;
exports.SamplesDocument = (0, client_1.gql)`
    query Samples($options: SampleOptions, $where: SampleWhere, $samplesConnectionWhere2: SampleWhere) {
  samplesConnection(where: $samplesConnectionWhere2) {
    totalCount
  }
  samples(where: $where, options: $options) {
    smileSampleId
  }
}
    `;
exports.UpdateSamplesDocument = (0, client_1.gql)`
    mutation UpdateSamples($where: SampleWhere, $update: SampleUpdateInput) {
  updateSamples(where: $where, update: $update) {
    samples {
      smileSampleId
      revisable
      datasource
      sampleCategory
      sampleClass
      hasMetadataSampleMetadata {
        cmoSampleName
        igoComplete
        importDate
        investigatorSampleId
        primaryId
        sampleClass
        cmoPatientId
        cmoSampleIdFields
        sampleName
        preservation
        tumorOrNormal
        oncotreeCode
        collectionYear
        sampleOrigin
        tissueLocation
        sex
        libraries
        sampleType
        species
        genePanel
      }
    }
  }
}
    `;
