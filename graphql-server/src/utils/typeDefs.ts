import { gql } from "apollo-server";

const GENERIC_TYPEDEFS = gql`
  enum AgGridSortDirection {
    asc
    desc
  }

  input DashboardRecordContext {
    fieldName: String
    values: [String!]!
  }

  # Modeling after AG Grid's SortModel type
  input DashboardRecordSort {
    colId: String! # field name
    sort: AgGridSortDirection!
  }

  input DashboardRecordColumnFilter {
    # The field to filter on, e.g. "smileSampleId", "cmoPatientId", etc.
    field: String!
    # Can be a single value or an array of values to filter on. Comes from AG Grid's filter model object
    filter: String!
  }
`;

const SAMPLE_FIELDS = `
  # (s:Sample)
  smileSampleId: String!
  revisable: Boolean
  sampleCategory: String!

  # (s:Sample)-[:HAS_METADATA]->(sm:SampleMetadata)
  ## Root-level fields
  primaryId: String
  cmoSampleName: String
  importDate: String
  cmoPatientId: String
  investigatorSampleId: String
  sampleType: String
  species: String
  genePanel: String
  baitSet: String
  preservation: String
  tumorOrNormal: String
  sampleClass: String
  oncotreeCode: String
  collectionYear: String
  sampleOrigin: String
  tissueLocation: String
  sex: String
  cfDNA2dBarcode: String
  ## Custom fields
  recipe: String
  altId: String
  analyteType: String
  historicalCmoSampleNames: String
  instrumentModel: String
  platform: String
  ## (sm:SampleMetadata)-[:HAS_STATUS]->(s:Status)
  validationReport: String
  validationStatus: Boolean

  # Oncotree API
  cancerType: String
  cancerTypeDetailed: String

  # (s:Sample)-[:HAS_TEMPO]->(t:Tempo)
  ## Root-level fields
  billed: Boolean
  costCenter: String
  billedBy: String
  custodianInformation: String
  accessLevel: String
  ## Custom fields
  initialPipelineRunDate: String
  embargoDate: String
  ## (t:Tempo)-[:HAS_EVENT]->(bc:BamComplete)
  bamCompleteDate: String
  bamCompleteStatus: String
  ## (t:Tempo)-[:HAS_EVENT]->(mc:MafComplete)
  mafCompleteDate: String
  mafCompleteNormalPrimaryId: String
  mafCompleteStatus: String
  # (t:Tempo)-[:HAS_EVENT]->(qc:QcComplete)
  qcCompleteDate: String
  qcCompleteResult: String
  qcCompleteReason: String
  qcCompleteStatus: String
  # (s:Sample)<-[:HAS_COHORT_SAMPLE]-(c:Cohort)
  sampleCohortIds: String

  # (s:Sample)-[:HAS_DBGAP]->(d:DbGap)
  dbGapStudy: String

  # (s:Sample)<-[:HAS_SAMPLE]-(p:Patient)<-[:IS_ALIAS]-(pa:PatientAlias)
  ## Custom fields
  dmpPatientAlias: String

  # results total
  _total: Int
`;

const QUERY_RESULT_TYPEDEFS = gql`
  type DashboardRequest {
    igoRequestId: String!
    igoProjectId: String
    validationReport: String
    validationStatus: Boolean
    importDate: String
    totalSampleCount: Int
    projectManagerName: String
    investigatorName: String
    investigatorEmail: String
    piEmail: String
    dataAnalystName: String
    dataAnalystEmail: String
    genePanel: String
    labHeadName: String
    labHeadEmail: String
    qcAccessEmails: String
    dataAccessEmails: String
    bicAnalysis: Boolean
    isCmoRequest: Boolean
    otherContactEmails: String
    _total: Int
    toleratedSampleErrors: [ToleratedSampleValidationError]
  }

  type ToleratedSampleValidationError {
    primaryId: String!
    validationStatus: Boolean
    validationReport: String
  }

  type DashboardPatient {
    smilePatientId: String!
    cmoPatientId: String
    dmpPatientId: String
    totalSampleCount: Int
    cmoSampleIds: String
    consentPartA: String
    consentPartC: String
    inDbGap: Boolean
    mrn: String
    anchorSequencingDate: String
    _total: Int
  }

  type DashboardCohort {
    cohortId: String!
    totalSampleCount: Int
    billed: String
    initialCohortDeliveryDate: String
    endUsers: String
    pmUsers: String
    projectTitle: String
    projectSubtitle: String
    status: String
    type: String
    searchableSampleIds: String
    _total: Int
    _uniqueSampleCount: Int
  }

  type DashboardSample {
    ${SAMPLE_FIELDS}
  }

  type PatientIdsTriplet {
    CMO_PATIENT_ID: String!
    DMP_PATIENT_ID: String
    MRN: String!
  }

  type AnchorSeqDateByPatientId {
    MRN: String!
    DMP_PATIENT_ID: String!
    ANCHOR_SEQUENCING_DATE: String!
  }
`;

const QUERY_TYPEDEFS = gql`
  type Query {
    dashboardRequests(
      searchVals: [String!]
      columnFilters: [DashboardRecordColumnFilter!]
      sort: DashboardRecordSort!
      limit: Int!
      offset: Int!
    ): [DashboardRequest!]!

    dashboardPatients(
      searchVals: [String!]
      columnFilters: [DashboardRecordColumnFilter!]
      sort: DashboardRecordSort!
      limit: Int!
      offset: Int!
      phiEnabled: Boolean
    ): [DashboardPatient!]!

    dashboardCohorts(
      searchVals: [String!]
      columnFilters: [DashboardRecordColumnFilter!]
      sort: DashboardRecordSort!
      limit: Int!
      offset: Int!
    ): [DashboardCohort!]!

    dashboardSamples(
      searchVals: [String!]
      contexts: [DashboardRecordContext]
      columnFilters: [DashboardRecordColumnFilter!]
      sort: DashboardRecordSort!
      limit: Int!
      offset: Int!
    ): [DashboardSample!]!

    allAnchorSeqDateByPatientId(
      phiEnabled: Boolean
    ): [AnchorSeqDateByPatientId!]!
  }
`;

// We have to define a separate "input" type for the mutation and can't reuse DashboardSample.
// For more context, see: https://stackoverflow.com/q/41743253
const MUTATION_TYPEDEFS = gql`
  input DashboardSampleInput {
    changedFieldNames: [String!]!
    ${SAMPLE_FIELDS}
  }

  type Mutation {
    updateDashboardSamples(
      newDashboardSamples: [DashboardSampleInput]
    ): [DashboardSample]
  }
`;

export const typeDefs = [
  GENERIC_TYPEDEFS,
  QUERY_RESULT_TYPEDEFS,
  QUERY_TYPEDEFS,
  MUTATION_TYPEDEFS,
];
