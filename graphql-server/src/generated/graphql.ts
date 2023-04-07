import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateInfo = {
  __typename?: "CreateInfo";
  bookmark?: Maybe<Scalars["String"]>;
  nodesCreated: Scalars["Int"];
  relationshipsCreated: Scalars["Int"];
};

export type CreatePatientAliasesMutationResponse = {
  __typename?: "CreatePatientAliasesMutationResponse";
  info: CreateInfo;
  patientAliases: Array<PatientAlias>;
};

export type CreatePatientsMutationResponse = {
  __typename?: "CreatePatientsMutationResponse";
  info: CreateInfo;
  patients: Array<Patient>;
};

export type CreateProjectsMutationResponse = {
  __typename?: "CreateProjectsMutationResponse";
  info: CreateInfo;
  projects: Array<Project>;
};

export type CreateRequestMetadataMutationResponse = {
  __typename?: "CreateRequestMetadataMutationResponse";
  info: CreateInfo;
  requestMetadata: Array<RequestMetadata>;
};

export type CreateRequestsMutationResponse = {
  __typename?: "CreateRequestsMutationResponse";
  info: CreateInfo;
  requests: Array<Request>;
};

export type CreateSampleAliasesMutationResponse = {
  __typename?: "CreateSampleAliasesMutationResponse";
  info: CreateInfo;
  sampleAliases: Array<SampleAlias>;
};

export type CreateSampleMetadataMutationResponse = {
  __typename?: "CreateSampleMetadataMutationResponse";
  info: CreateInfo;
  sampleMetadata: Array<SampleMetadata>;
};

export type CreateSamplesMutationResponse = {
  __typename?: "CreateSamplesMutationResponse";
  info: CreateInfo;
  samples: Array<Sample>;
};

export type CreateStatusesMutationResponse = {
  __typename?: "CreateStatusesMutationResponse";
  info: CreateInfo;
  statuses: Array<Status>;
};

export type DeleteInfo = {
  __typename?: "DeleteInfo";
  bookmark?: Maybe<Scalars["String"]>;
  nodesDeleted: Scalars["Int"];
  relationshipsDeleted: Scalars["Int"];
};

export type Mutation = {
  __typename?: "Mutation";
  createPatientAliases: CreatePatientAliasesMutationResponse;
  createPatients: CreatePatientsMutationResponse;
  createProjects: CreateProjectsMutationResponse;
  createRequestMetadata: CreateRequestMetadataMutationResponse;
  createRequests: CreateRequestsMutationResponse;
  createSampleAliases: CreateSampleAliasesMutationResponse;
  createSampleMetadata: CreateSampleMetadataMutationResponse;
  createSamples: CreateSamplesMutationResponse;
  createStatuses: CreateStatusesMutationResponse;
  deletePatientAliases: DeleteInfo;
  deletePatients: DeleteInfo;
  deleteProjects: DeleteInfo;
  deleteRequestMetadata: DeleteInfo;
  deleteRequests: DeleteInfo;
  deleteSampleAliases: DeleteInfo;
  deleteSampleMetadata: DeleteInfo;
  deleteSamples: DeleteInfo;
  deleteStatuses: DeleteInfo;
  updatePatientAliases: UpdatePatientAliasesMutationResponse;
  updatePatients: UpdatePatientsMutationResponse;
  updateProjects: UpdateProjectsMutationResponse;
  updateRequestMetadata: UpdateRequestMetadataMutationResponse;
  updateRequests: UpdateRequestsMutationResponse;
  updateSampleAliases: UpdateSampleAliasesMutationResponse;
  updateSampleMetadata: UpdateSampleMetadataMutationResponse;
  updateSamples: UpdateSamplesMutationResponse;
  updateStatuses: UpdateStatusesMutationResponse;
};

export type MutationCreatePatientAliasesArgs = {
  input: Array<PatientAliasCreateInput>;
};

export type MutationCreatePatientsArgs = {
  input: Array<PatientCreateInput>;
};

export type MutationCreateProjectsArgs = {
  input: Array<ProjectCreateInput>;
};

export type MutationCreateRequestMetadataArgs = {
  input: Array<RequestMetadataCreateInput>;
};

export type MutationCreateRequestsArgs = {
  input: Array<RequestCreateInput>;
};

export type MutationCreateSampleAliasesArgs = {
  input: Array<SampleAliasCreateInput>;
};

export type MutationCreateSampleMetadataArgs = {
  input: Array<SampleMetadataCreateInput>;
};

export type MutationCreateSamplesArgs = {
  input: Array<SampleCreateInput>;
};

export type MutationCreateStatusesArgs = {
  input: Array<StatusCreateInput>;
};

export type MutationDeletePatientAliasesArgs = {
  delete?: InputMaybe<PatientAliasDeleteInput>;
  where?: InputMaybe<PatientAliasWhere>;
};

export type MutationDeletePatientsArgs = {
  delete?: InputMaybe<PatientDeleteInput>;
  where?: InputMaybe<PatientWhere>;
};

export type MutationDeleteProjectsArgs = {
  delete?: InputMaybe<ProjectDeleteInput>;
  where?: InputMaybe<ProjectWhere>;
};

export type MutationDeleteRequestMetadataArgs = {
  delete?: InputMaybe<RequestMetadataDeleteInput>;
  where?: InputMaybe<RequestMetadataWhere>;
};

export type MutationDeleteRequestsArgs = {
  delete?: InputMaybe<RequestDeleteInput>;
  where?: InputMaybe<RequestWhere>;
};

export type MutationDeleteSampleAliasesArgs = {
  delete?: InputMaybe<SampleAliasDeleteInput>;
  where?: InputMaybe<SampleAliasWhere>;
};

export type MutationDeleteSampleMetadataArgs = {
  delete?: InputMaybe<SampleMetadataDeleteInput>;
  where?: InputMaybe<SampleMetadataWhere>;
};

export type MutationDeleteSamplesArgs = {
  delete?: InputMaybe<SampleDeleteInput>;
  where?: InputMaybe<SampleWhere>;
};

export type MutationDeleteStatusesArgs = {
  delete?: InputMaybe<StatusDeleteInput>;
  where?: InputMaybe<StatusWhere>;
};

export type MutationUpdatePatientAliasesArgs = {
  connect?: InputMaybe<PatientAliasConnectInput>;
  create?: InputMaybe<PatientAliasRelationInput>;
  delete?: InputMaybe<PatientAliasDeleteInput>;
  disconnect?: InputMaybe<PatientAliasDisconnectInput>;
  update?: InputMaybe<PatientAliasUpdateInput>;
  where?: InputMaybe<PatientAliasWhere>;
};

export type MutationUpdatePatientsArgs = {
  connect?: InputMaybe<PatientConnectInput>;
  create?: InputMaybe<PatientRelationInput>;
  delete?: InputMaybe<PatientDeleteInput>;
  disconnect?: InputMaybe<PatientDisconnectInput>;
  update?: InputMaybe<PatientUpdateInput>;
  where?: InputMaybe<PatientWhere>;
};

export type MutationUpdateProjectsArgs = {
  connect?: InputMaybe<ProjectConnectInput>;
  create?: InputMaybe<ProjectRelationInput>;
  delete?: InputMaybe<ProjectDeleteInput>;
  disconnect?: InputMaybe<ProjectDisconnectInput>;
  update?: InputMaybe<ProjectUpdateInput>;
  where?: InputMaybe<ProjectWhere>;
};

export type MutationUpdateRequestMetadataArgs = {
  connect?: InputMaybe<RequestMetadataConnectInput>;
  create?: InputMaybe<RequestMetadataRelationInput>;
  delete?: InputMaybe<RequestMetadataDeleteInput>;
  disconnect?: InputMaybe<RequestMetadataDisconnectInput>;
  update?: InputMaybe<RequestMetadataUpdateInput>;
  where?: InputMaybe<RequestMetadataWhere>;
};

export type MutationUpdateRequestsArgs = {
  connect?: InputMaybe<RequestConnectInput>;
  create?: InputMaybe<RequestRelationInput>;
  delete?: InputMaybe<RequestDeleteInput>;
  disconnect?: InputMaybe<RequestDisconnectInput>;
  update?: InputMaybe<RequestUpdateInput>;
  where?: InputMaybe<RequestWhere>;
};

export type MutationUpdateSampleAliasesArgs = {
  connect?: InputMaybe<SampleAliasConnectInput>;
  create?: InputMaybe<SampleAliasRelationInput>;
  delete?: InputMaybe<SampleAliasDeleteInput>;
  disconnect?: InputMaybe<SampleAliasDisconnectInput>;
  update?: InputMaybe<SampleAliasUpdateInput>;
  where?: InputMaybe<SampleAliasWhere>;
};

export type MutationUpdateSampleMetadataArgs = {
  connect?: InputMaybe<SampleMetadataConnectInput>;
  create?: InputMaybe<SampleMetadataRelationInput>;
  delete?: InputMaybe<SampleMetadataDeleteInput>;
  disconnect?: InputMaybe<SampleMetadataDisconnectInput>;
  update?: InputMaybe<SampleMetadataUpdateInput>;
  where?: InputMaybe<SampleMetadataWhere>;
};

export type MutationUpdateSamplesArgs = {
  connect?: InputMaybe<SampleConnectInput>;
  create?: InputMaybe<SampleRelationInput>;
  delete?: InputMaybe<SampleDeleteInput>;
  disconnect?: InputMaybe<SampleDisconnectInput>;
  update?: InputMaybe<SampleUpdateInput>;
  where?: InputMaybe<SampleWhere>;
};

export type MutationUpdateStatusesArgs = {
  connect?: InputMaybe<StatusConnectInput>;
  create?: InputMaybe<StatusRelationInput>;
  delete?: InputMaybe<StatusDeleteInput>;
  disconnect?: InputMaybe<StatusDisconnectInput>;
  update?: InputMaybe<StatusUpdateInput>;
  where?: InputMaybe<StatusWhere>;
};

/** Pagination information (Relay) */
export type PageInfo = {
  __typename?: "PageInfo";
  endCursor?: Maybe<Scalars["String"]>;
  hasNextPage: Scalars["Boolean"];
  hasPreviousPage: Scalars["Boolean"];
  startCursor?: Maybe<Scalars["String"]>;
};

export type Patient = {
  __typename?: "Patient";
  hasSampleSamples: Array<Sample>;
  hasSampleSamplesAggregate?: Maybe<PatientSampleHasSampleSamplesAggregationSelection>;
  hasSampleSamplesConnection: PatientHasSampleSamplesConnection;
  patientAliasesIsAlias: Array<PatientAlias>;
  patientAliasesIsAliasAggregate?: Maybe<PatientPatientAliasPatientAliasesIsAliasAggregationSelection>;
  patientAliasesIsAliasConnection: PatientPatientAliasesIsAliasConnection;
  smilePatientId: Scalars["String"];
};

export type PatientHasSampleSamplesArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  options?: InputMaybe<SampleOptions>;
  where?: InputMaybe<SampleWhere>;
};

export type PatientHasSampleSamplesAggregateArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  where?: InputMaybe<SampleWhere>;
};

export type PatientHasSampleSamplesConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  directed?: InputMaybe<Scalars["Boolean"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<PatientHasSampleSamplesConnectionSort>>;
  where?: InputMaybe<PatientHasSampleSamplesConnectionWhere>;
};

export type PatientPatientAliasesIsAliasArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  options?: InputMaybe<PatientAliasOptions>;
  where?: InputMaybe<PatientAliasWhere>;
};

export type PatientPatientAliasesIsAliasAggregateArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  where?: InputMaybe<PatientAliasWhere>;
};

export type PatientPatientAliasesIsAliasConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  directed?: InputMaybe<Scalars["Boolean"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<PatientPatientAliasesIsAliasConnectionSort>>;
  where?: InputMaybe<PatientPatientAliasesIsAliasConnectionWhere>;
};

export type PatientAggregateSelection = {
  __typename?: "PatientAggregateSelection";
  count: Scalars["Int"];
  smilePatientId: StringAggregateSelectionNonNullable;
};

export type PatientAlias = {
  __typename?: "PatientAlias";
  isAliasPatients: Array<Patient>;
  isAliasPatientsAggregate?: Maybe<PatientAliasPatientIsAliasPatientsAggregationSelection>;
  isAliasPatientsConnection: PatientAliasIsAliasPatientsConnection;
  namespace: Scalars["String"];
  value?: Maybe<Scalars["String"]>;
};

export type PatientAliasIsAliasPatientsArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  options?: InputMaybe<PatientOptions>;
  where?: InputMaybe<PatientWhere>;
};

export type PatientAliasIsAliasPatientsAggregateArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  where?: InputMaybe<PatientWhere>;
};

export type PatientAliasIsAliasPatientsConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  directed?: InputMaybe<Scalars["Boolean"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<PatientAliasIsAliasPatientsConnectionSort>>;
  where?: InputMaybe<PatientAliasIsAliasPatientsConnectionWhere>;
};

export type PatientAliasAggregateSelection = {
  __typename?: "PatientAliasAggregateSelection";
  count: Scalars["Int"];
  namespace: StringAggregateSelectionNonNullable;
  value: StringAggregateSelectionNullable;
};

export type PatientAliasConnectInput = {
  isAliasPatients?: InputMaybe<
    Array<PatientAliasIsAliasPatientsConnectFieldInput>
  >;
};

export type PatientAliasConnectWhere = {
  node: PatientAliasWhere;
};

export type PatientAliasCreateInput = {
  isAliasPatients?: InputMaybe<PatientAliasIsAliasPatientsFieldInput>;
  namespace: Scalars["String"];
  value?: InputMaybe<Scalars["String"]>;
};

export type PatientAliasDeleteInput = {
  isAliasPatients?: InputMaybe<
    Array<PatientAliasIsAliasPatientsDeleteFieldInput>
  >;
};

export type PatientAliasDisconnectInput = {
  isAliasPatients?: InputMaybe<
    Array<PatientAliasIsAliasPatientsDisconnectFieldInput>
  >;
};

export type PatientAliasEdge = {
  __typename?: "PatientAliasEdge";
  cursor: Scalars["String"];
  node: PatientAlias;
};

export type PatientAliasIsAliasPatientsAggregateInput = {
  AND?: InputMaybe<Array<PatientAliasIsAliasPatientsAggregateInput>>;
  OR?: InputMaybe<Array<PatientAliasIsAliasPatientsAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<PatientAliasIsAliasPatientsNodeAggregationWhereInput>;
};

export type PatientAliasIsAliasPatientsConnectFieldInput = {
  connect?: InputMaybe<Array<PatientConnectInput>>;
  where?: InputMaybe<PatientConnectWhere>;
};

export type PatientAliasIsAliasPatientsConnection = {
  __typename?: "PatientAliasIsAliasPatientsConnection";
  edges: Array<PatientAliasIsAliasPatientsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type PatientAliasIsAliasPatientsConnectionSort = {
  node?: InputMaybe<PatientSort>;
};

export type PatientAliasIsAliasPatientsConnectionWhere = {
  AND?: InputMaybe<Array<PatientAliasIsAliasPatientsConnectionWhere>>;
  OR?: InputMaybe<Array<PatientAliasIsAliasPatientsConnectionWhere>>;
  node?: InputMaybe<PatientWhere>;
  node_NOT?: InputMaybe<PatientWhere>;
};

export type PatientAliasIsAliasPatientsCreateFieldInput = {
  node: PatientCreateInput;
};

export type PatientAliasIsAliasPatientsDeleteFieldInput = {
  delete?: InputMaybe<PatientDeleteInput>;
  where?: InputMaybe<PatientAliasIsAliasPatientsConnectionWhere>;
};

export type PatientAliasIsAliasPatientsDisconnectFieldInput = {
  disconnect?: InputMaybe<PatientDisconnectInput>;
  where?: InputMaybe<PatientAliasIsAliasPatientsConnectionWhere>;
};

export type PatientAliasIsAliasPatientsFieldInput = {
  connect?: InputMaybe<Array<PatientAliasIsAliasPatientsConnectFieldInput>>;
  create?: InputMaybe<Array<PatientAliasIsAliasPatientsCreateFieldInput>>;
};

export type PatientAliasIsAliasPatientsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<PatientAliasIsAliasPatientsNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<PatientAliasIsAliasPatientsNodeAggregationWhereInput>>;
  smilePatientId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  smilePatientId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  smilePatientId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  smilePatientId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  smilePatientId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  smilePatientId_EQUAL?: InputMaybe<Scalars["String"]>;
  smilePatientId_GT?: InputMaybe<Scalars["Int"]>;
  smilePatientId_GTE?: InputMaybe<Scalars["Int"]>;
  smilePatientId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  smilePatientId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  smilePatientId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  smilePatientId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  smilePatientId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  smilePatientId_LT?: InputMaybe<Scalars["Int"]>;
  smilePatientId_LTE?: InputMaybe<Scalars["Int"]>;
  smilePatientId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  smilePatientId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  smilePatientId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  smilePatientId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  smilePatientId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
};

export type PatientAliasIsAliasPatientsRelationship = {
  __typename?: "PatientAliasIsAliasPatientsRelationship";
  cursor: Scalars["String"];
  node: Patient;
};

export type PatientAliasIsAliasPatientsUpdateConnectionInput = {
  node?: InputMaybe<PatientUpdateInput>;
};

export type PatientAliasIsAliasPatientsUpdateFieldInput = {
  connect?: InputMaybe<Array<PatientAliasIsAliasPatientsConnectFieldInput>>;
  create?: InputMaybe<Array<PatientAliasIsAliasPatientsCreateFieldInput>>;
  delete?: InputMaybe<Array<PatientAliasIsAliasPatientsDeleteFieldInput>>;
  disconnect?: InputMaybe<
    Array<PatientAliasIsAliasPatientsDisconnectFieldInput>
  >;
  update?: InputMaybe<PatientAliasIsAliasPatientsUpdateConnectionInput>;
  where?: InputMaybe<PatientAliasIsAliasPatientsConnectionWhere>;
};

export type PatientAliasOptions = {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more PatientAliasSort objects to sort PatientAliases by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<PatientAliasSort>>;
};

export type PatientAliasPatientIsAliasPatientsAggregationSelection = {
  __typename?: "PatientAliasPatientIsAliasPatientsAggregationSelection";
  count: Scalars["Int"];
  node?: Maybe<PatientAliasPatientIsAliasPatientsNodeAggregateSelection>;
};

export type PatientAliasPatientIsAliasPatientsNodeAggregateSelection = {
  __typename?: "PatientAliasPatientIsAliasPatientsNodeAggregateSelection";
  smilePatientId: StringAggregateSelectionNonNullable;
};

export type PatientAliasRelationInput = {
  isAliasPatients?: InputMaybe<
    Array<PatientAliasIsAliasPatientsCreateFieldInput>
  >;
};

/** Fields to sort PatientAliases by. The order in which sorts are applied is not guaranteed when specifying many fields in one PatientAliasSort object. */
export type PatientAliasSort = {
  namespace?: InputMaybe<SortDirection>;
  value?: InputMaybe<SortDirection>;
};

export type PatientAliasUpdateInput = {
  isAliasPatients?: InputMaybe<
    Array<PatientAliasIsAliasPatientsUpdateFieldInput>
  >;
  namespace?: InputMaybe<Scalars["String"]>;
  value?: InputMaybe<Scalars["String"]>;
};

export type PatientAliasWhere = {
  AND?: InputMaybe<Array<PatientAliasWhere>>;
  OR?: InputMaybe<Array<PatientAliasWhere>>;
  isAliasPatientsAggregate?: InputMaybe<PatientAliasIsAliasPatientsAggregateInput>;
  isAliasPatientsConnection_ALL?: InputMaybe<PatientAliasIsAliasPatientsConnectionWhere>;
  isAliasPatientsConnection_NONE?: InputMaybe<PatientAliasIsAliasPatientsConnectionWhere>;
  isAliasPatientsConnection_SINGLE?: InputMaybe<PatientAliasIsAliasPatientsConnectionWhere>;
  isAliasPatientsConnection_SOME?: InputMaybe<PatientAliasIsAliasPatientsConnectionWhere>;
  /** Return PatientAliases where all of the related Patients match this filter */
  isAliasPatients_ALL?: InputMaybe<PatientWhere>;
  /** Return PatientAliases where none of the related Patients match this filter */
  isAliasPatients_NONE?: InputMaybe<PatientWhere>;
  /** Return PatientAliases where one of the related Patients match this filter */
  isAliasPatients_SINGLE?: InputMaybe<PatientWhere>;
  /** Return PatientAliases where some of the related Patients match this filter */
  isAliasPatients_SOME?: InputMaybe<PatientWhere>;
  namespace?: InputMaybe<Scalars["String"]>;
  namespace_CONTAINS?: InputMaybe<Scalars["String"]>;
  namespace_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  namespace_IN?: InputMaybe<Array<Scalars["String"]>>;
  namespace_NOT?: InputMaybe<Scalars["String"]>;
  namespace_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  namespace_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  namespace_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  namespace_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  namespace_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  value?: InputMaybe<Scalars["String"]>;
  value_CONTAINS?: InputMaybe<Scalars["String"]>;
  value_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  value_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  value_NOT?: InputMaybe<Scalars["String"]>;
  value_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  value_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  value_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  value_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  value_STARTS_WITH?: InputMaybe<Scalars["String"]>;
};

export type PatientAliasesConnection = {
  __typename?: "PatientAliasesConnection";
  edges: Array<PatientAliasEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type PatientConnectInput = {
  hasSampleSamples?: InputMaybe<
    Array<PatientHasSampleSamplesConnectFieldInput>
  >;
  patientAliasesIsAlias?: InputMaybe<
    Array<PatientPatientAliasesIsAliasConnectFieldInput>
  >;
};

export type PatientConnectWhere = {
  node: PatientWhere;
};

export type PatientCreateInput = {
  hasSampleSamples?: InputMaybe<PatientHasSampleSamplesFieldInput>;
  patientAliasesIsAlias?: InputMaybe<PatientPatientAliasesIsAliasFieldInput>;
  smilePatientId: Scalars["String"];
};

export type PatientDeleteInput = {
  hasSampleSamples?: InputMaybe<Array<PatientHasSampleSamplesDeleteFieldInput>>;
  patientAliasesIsAlias?: InputMaybe<
    Array<PatientPatientAliasesIsAliasDeleteFieldInput>
  >;
};

export type PatientDisconnectInput = {
  hasSampleSamples?: InputMaybe<
    Array<PatientHasSampleSamplesDisconnectFieldInput>
  >;
  patientAliasesIsAlias?: InputMaybe<
    Array<PatientPatientAliasesIsAliasDisconnectFieldInput>
  >;
};

export type PatientEdge = {
  __typename?: "PatientEdge";
  cursor: Scalars["String"];
  node: Patient;
};

export type PatientHasSampleSamplesAggregateInput = {
  AND?: InputMaybe<Array<PatientHasSampleSamplesAggregateInput>>;
  OR?: InputMaybe<Array<PatientHasSampleSamplesAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<PatientHasSampleSamplesNodeAggregationWhereInput>;
};

export type PatientHasSampleSamplesConnectFieldInput = {
  connect?: InputMaybe<Array<SampleConnectInput>>;
  where?: InputMaybe<SampleConnectWhere>;
};

export type PatientHasSampleSamplesConnection = {
  __typename?: "PatientHasSampleSamplesConnection";
  edges: Array<PatientHasSampleSamplesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type PatientHasSampleSamplesConnectionSort = {
  node?: InputMaybe<SampleSort>;
};

export type PatientHasSampleSamplesConnectionWhere = {
  AND?: InputMaybe<Array<PatientHasSampleSamplesConnectionWhere>>;
  OR?: InputMaybe<Array<PatientHasSampleSamplesConnectionWhere>>;
  node?: InputMaybe<SampleWhere>;
  node_NOT?: InputMaybe<SampleWhere>;
};

export type PatientHasSampleSamplesCreateFieldInput = {
  node: SampleCreateInput;
};

export type PatientHasSampleSamplesDeleteFieldInput = {
  delete?: InputMaybe<SampleDeleteInput>;
  where?: InputMaybe<PatientHasSampleSamplesConnectionWhere>;
};

export type PatientHasSampleSamplesDisconnectFieldInput = {
  disconnect?: InputMaybe<SampleDisconnectInput>;
  where?: InputMaybe<PatientHasSampleSamplesConnectionWhere>;
};

export type PatientHasSampleSamplesFieldInput = {
  connect?: InputMaybe<Array<PatientHasSampleSamplesConnectFieldInput>>;
  create?: InputMaybe<Array<PatientHasSampleSamplesCreateFieldInput>>;
};

export type PatientHasSampleSamplesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<PatientHasSampleSamplesNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<PatientHasSampleSamplesNodeAggregationWhereInput>>;
  datasource_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  datasource_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  datasource_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  datasource_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  datasource_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  datasource_EQUAL?: InputMaybe<Scalars["String"]>;
  datasource_GT?: InputMaybe<Scalars["Int"]>;
  datasource_GTE?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  datasource_LT?: InputMaybe<Scalars["Int"]>;
  datasource_LTE?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  sampleCategory_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  sampleCategory_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  sampleCategory_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  sampleCategory_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  sampleCategory_EQUAL?: InputMaybe<Scalars["String"]>;
  sampleCategory_GT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_GTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  sampleClass_EQUAL?: InputMaybe<Scalars["String"]>;
  sampleClass_GT?: InputMaybe<Scalars["Int"]>;
  sampleClass_GTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_LT?: InputMaybe<Scalars["Int"]>;
  sampleClass_LTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  smileSampleId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  smileSampleId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  smileSampleId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  smileSampleId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  smileSampleId_EQUAL?: InputMaybe<Scalars["String"]>;
  smileSampleId_GT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_GTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
};

export type PatientHasSampleSamplesRelationship = {
  __typename?: "PatientHasSampleSamplesRelationship";
  cursor: Scalars["String"];
  node: Sample;
};

export type PatientHasSampleSamplesUpdateConnectionInput = {
  node?: InputMaybe<SampleUpdateInput>;
};

export type PatientHasSampleSamplesUpdateFieldInput = {
  connect?: InputMaybe<Array<PatientHasSampleSamplesConnectFieldInput>>;
  create?: InputMaybe<Array<PatientHasSampleSamplesCreateFieldInput>>;
  delete?: InputMaybe<Array<PatientHasSampleSamplesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<PatientHasSampleSamplesDisconnectFieldInput>>;
  update?: InputMaybe<PatientHasSampleSamplesUpdateConnectionInput>;
  where?: InputMaybe<PatientHasSampleSamplesConnectionWhere>;
};

export type PatientOptions = {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more PatientSort objects to sort Patients by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<PatientSort>>;
};

export type PatientPatientAliasPatientAliasesIsAliasAggregationSelection = {
  __typename?: "PatientPatientAliasPatientAliasesIsAliasAggregationSelection";
  count: Scalars["Int"];
  node?: Maybe<PatientPatientAliasPatientAliasesIsAliasNodeAggregateSelection>;
};

export type PatientPatientAliasPatientAliasesIsAliasNodeAggregateSelection = {
  __typename?: "PatientPatientAliasPatientAliasesIsAliasNodeAggregateSelection";
  namespace: StringAggregateSelectionNonNullable;
  value: StringAggregateSelectionNullable;
};

export type PatientPatientAliasesIsAliasAggregateInput = {
  AND?: InputMaybe<Array<PatientPatientAliasesIsAliasAggregateInput>>;
  OR?: InputMaybe<Array<PatientPatientAliasesIsAliasAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<PatientPatientAliasesIsAliasNodeAggregationWhereInput>;
};

export type PatientPatientAliasesIsAliasConnectFieldInput = {
  connect?: InputMaybe<Array<PatientAliasConnectInput>>;
  where?: InputMaybe<PatientAliasConnectWhere>;
};

export type PatientPatientAliasesIsAliasConnection = {
  __typename?: "PatientPatientAliasesIsAliasConnection";
  edges: Array<PatientPatientAliasesIsAliasRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type PatientPatientAliasesIsAliasConnectionSort = {
  node?: InputMaybe<PatientAliasSort>;
};

export type PatientPatientAliasesIsAliasConnectionWhere = {
  AND?: InputMaybe<Array<PatientPatientAliasesIsAliasConnectionWhere>>;
  OR?: InputMaybe<Array<PatientPatientAliasesIsAliasConnectionWhere>>;
  node?: InputMaybe<PatientAliasWhere>;
  node_NOT?: InputMaybe<PatientAliasWhere>;
};

export type PatientPatientAliasesIsAliasCreateFieldInput = {
  node: PatientAliasCreateInput;
};

export type PatientPatientAliasesIsAliasDeleteFieldInput = {
  delete?: InputMaybe<PatientAliasDeleteInput>;
  where?: InputMaybe<PatientPatientAliasesIsAliasConnectionWhere>;
};

export type PatientPatientAliasesIsAliasDisconnectFieldInput = {
  disconnect?: InputMaybe<PatientAliasDisconnectInput>;
  where?: InputMaybe<PatientPatientAliasesIsAliasConnectionWhere>;
};

export type PatientPatientAliasesIsAliasFieldInput = {
  connect?: InputMaybe<Array<PatientPatientAliasesIsAliasConnectFieldInput>>;
  create?: InputMaybe<Array<PatientPatientAliasesIsAliasCreateFieldInput>>;
};

export type PatientPatientAliasesIsAliasNodeAggregationWhereInput = {
  AND?: InputMaybe<
    Array<PatientPatientAliasesIsAliasNodeAggregationWhereInput>
  >;
  OR?: InputMaybe<Array<PatientPatientAliasesIsAliasNodeAggregationWhereInput>>;
  namespace_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  namespace_EQUAL?: InputMaybe<Scalars["String"]>;
  namespace_GT?: InputMaybe<Scalars["Int"]>;
  namespace_GTE?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  namespace_LT?: InputMaybe<Scalars["Int"]>;
  namespace_LTE?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  value_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  value_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  value_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  value_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  value_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  value_EQUAL?: InputMaybe<Scalars["String"]>;
  value_GT?: InputMaybe<Scalars["Int"]>;
  value_GTE?: InputMaybe<Scalars["Int"]>;
  value_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  value_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  value_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  value_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  value_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  value_LT?: InputMaybe<Scalars["Int"]>;
  value_LTE?: InputMaybe<Scalars["Int"]>;
  value_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  value_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  value_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  value_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  value_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
};

export type PatientPatientAliasesIsAliasRelationship = {
  __typename?: "PatientPatientAliasesIsAliasRelationship";
  cursor: Scalars["String"];
  node: PatientAlias;
};

export type PatientPatientAliasesIsAliasUpdateConnectionInput = {
  node?: InputMaybe<PatientAliasUpdateInput>;
};

export type PatientPatientAliasesIsAliasUpdateFieldInput = {
  connect?: InputMaybe<Array<PatientPatientAliasesIsAliasConnectFieldInput>>;
  create?: InputMaybe<Array<PatientPatientAliasesIsAliasCreateFieldInput>>;
  delete?: InputMaybe<Array<PatientPatientAliasesIsAliasDeleteFieldInput>>;
  disconnect?: InputMaybe<
    Array<PatientPatientAliasesIsAliasDisconnectFieldInput>
  >;
  update?: InputMaybe<PatientPatientAliasesIsAliasUpdateConnectionInput>;
  where?: InputMaybe<PatientPatientAliasesIsAliasConnectionWhere>;
};

export type PatientRelationInput = {
  hasSampleSamples?: InputMaybe<Array<PatientHasSampleSamplesCreateFieldInput>>;
  patientAliasesIsAlias?: InputMaybe<
    Array<PatientPatientAliasesIsAliasCreateFieldInput>
  >;
};

export type PatientSampleHasSampleSamplesAggregationSelection = {
  __typename?: "PatientSampleHasSampleSamplesAggregationSelection";
  count: Scalars["Int"];
  node?: Maybe<PatientSampleHasSampleSamplesNodeAggregateSelection>;
};

export type PatientSampleHasSampleSamplesNodeAggregateSelection = {
  __typename?: "PatientSampleHasSampleSamplesNodeAggregateSelection";
  datasource: StringAggregateSelectionNonNullable;
  sampleCategory: StringAggregateSelectionNonNullable;
  sampleClass: StringAggregateSelectionNonNullable;
  smileSampleId: StringAggregateSelectionNonNullable;
};

/** Fields to sort Patients by. The order in which sorts are applied is not guaranteed when specifying many fields in one PatientSort object. */
export type PatientSort = {
  smilePatientId?: InputMaybe<SortDirection>;
};

export type PatientUpdateInput = {
  hasSampleSamples?: InputMaybe<Array<PatientHasSampleSamplesUpdateFieldInput>>;
  patientAliasesIsAlias?: InputMaybe<
    Array<PatientPatientAliasesIsAliasUpdateFieldInput>
  >;
  smilePatientId?: InputMaybe<Scalars["String"]>;
};

export type PatientWhere = {
  AND?: InputMaybe<Array<PatientWhere>>;
  OR?: InputMaybe<Array<PatientWhere>>;
  hasSampleSamplesAggregate?: InputMaybe<PatientHasSampleSamplesAggregateInput>;
  hasSampleSamplesConnection_ALL?: InputMaybe<PatientHasSampleSamplesConnectionWhere>;
  hasSampleSamplesConnection_NONE?: InputMaybe<PatientHasSampleSamplesConnectionWhere>;
  hasSampleSamplesConnection_SINGLE?: InputMaybe<PatientHasSampleSamplesConnectionWhere>;
  hasSampleSamplesConnection_SOME?: InputMaybe<PatientHasSampleSamplesConnectionWhere>;
  /** Return Patients where all of the related Samples match this filter */
  hasSampleSamples_ALL?: InputMaybe<SampleWhere>;
  /** Return Patients where none of the related Samples match this filter */
  hasSampleSamples_NONE?: InputMaybe<SampleWhere>;
  /** Return Patients where one of the related Samples match this filter */
  hasSampleSamples_SINGLE?: InputMaybe<SampleWhere>;
  /** Return Patients where some of the related Samples match this filter */
  hasSampleSamples_SOME?: InputMaybe<SampleWhere>;
  patientAliasesIsAliasAggregate?: InputMaybe<PatientPatientAliasesIsAliasAggregateInput>;
  patientAliasesIsAliasConnection_ALL?: InputMaybe<PatientPatientAliasesIsAliasConnectionWhere>;
  patientAliasesIsAliasConnection_NONE?: InputMaybe<PatientPatientAliasesIsAliasConnectionWhere>;
  patientAliasesIsAliasConnection_SINGLE?: InputMaybe<PatientPatientAliasesIsAliasConnectionWhere>;
  patientAliasesIsAliasConnection_SOME?: InputMaybe<PatientPatientAliasesIsAliasConnectionWhere>;
  /** Return Patients where all of the related PatientAliases match this filter */
  patientAliasesIsAlias_ALL?: InputMaybe<PatientAliasWhere>;
  /** Return Patients where none of the related PatientAliases match this filter */
  patientAliasesIsAlias_NONE?: InputMaybe<PatientAliasWhere>;
  /** Return Patients where one of the related PatientAliases match this filter */
  patientAliasesIsAlias_SINGLE?: InputMaybe<PatientAliasWhere>;
  /** Return Patients where some of the related PatientAliases match this filter */
  patientAliasesIsAlias_SOME?: InputMaybe<PatientAliasWhere>;
  smilePatientId?: InputMaybe<Scalars["String"]>;
  smilePatientId_CONTAINS?: InputMaybe<Scalars["String"]>;
  smilePatientId_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  smilePatientId_IN?: InputMaybe<Array<Scalars["String"]>>;
  smilePatientId_NOT?: InputMaybe<Scalars["String"]>;
  smilePatientId_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  smilePatientId_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  smilePatientId_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  smilePatientId_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  smilePatientId_STARTS_WITH?: InputMaybe<Scalars["String"]>;
};

export type PatientsConnection = {
  __typename?: "PatientsConnection";
  edges: Array<PatientEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type Project = {
  __typename?: "Project";
  hasRequestRequests: Array<Request>;
  hasRequestRequestsAggregate?: Maybe<ProjectRequestHasRequestRequestsAggregationSelection>;
  hasRequestRequestsConnection: ProjectHasRequestRequestsConnection;
  igoProjectId: Scalars["String"];
  namespace: Scalars["String"];
};

export type ProjectHasRequestRequestsArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  options?: InputMaybe<RequestOptions>;
  where?: InputMaybe<RequestWhere>;
};

export type ProjectHasRequestRequestsAggregateArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  where?: InputMaybe<RequestWhere>;
};

export type ProjectHasRequestRequestsConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  directed?: InputMaybe<Scalars["Boolean"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<ProjectHasRequestRequestsConnectionSort>>;
  where?: InputMaybe<ProjectHasRequestRequestsConnectionWhere>;
};

export type ProjectAggregateSelection = {
  __typename?: "ProjectAggregateSelection";
  count: Scalars["Int"];
  igoProjectId: StringAggregateSelectionNonNullable;
  namespace: StringAggregateSelectionNonNullable;
};

export type ProjectConnectInput = {
  hasRequestRequests?: InputMaybe<
    Array<ProjectHasRequestRequestsConnectFieldInput>
  >;
};

export type ProjectConnectWhere = {
  node: ProjectWhere;
};

export type ProjectCreateInput = {
  hasRequestRequests?: InputMaybe<ProjectHasRequestRequestsFieldInput>;
  igoProjectId: Scalars["String"];
  namespace: Scalars["String"];
};

export type ProjectDeleteInput = {
  hasRequestRequests?: InputMaybe<
    Array<ProjectHasRequestRequestsDeleteFieldInput>
  >;
};

export type ProjectDisconnectInput = {
  hasRequestRequests?: InputMaybe<
    Array<ProjectHasRequestRequestsDisconnectFieldInput>
  >;
};

export type ProjectEdge = {
  __typename?: "ProjectEdge";
  cursor: Scalars["String"];
  node: Project;
};

export type ProjectHasRequestRequestsAggregateInput = {
  AND?: InputMaybe<Array<ProjectHasRequestRequestsAggregateInput>>;
  OR?: InputMaybe<Array<ProjectHasRequestRequestsAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<ProjectHasRequestRequestsNodeAggregationWhereInput>;
};

export type ProjectHasRequestRequestsConnectFieldInput = {
  connect?: InputMaybe<Array<RequestConnectInput>>;
  where?: InputMaybe<RequestConnectWhere>;
};

export type ProjectHasRequestRequestsConnection = {
  __typename?: "ProjectHasRequestRequestsConnection";
  edges: Array<ProjectHasRequestRequestsRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type ProjectHasRequestRequestsConnectionSort = {
  node?: InputMaybe<RequestSort>;
};

export type ProjectHasRequestRequestsConnectionWhere = {
  AND?: InputMaybe<Array<ProjectHasRequestRequestsConnectionWhere>>;
  OR?: InputMaybe<Array<ProjectHasRequestRequestsConnectionWhere>>;
  node?: InputMaybe<RequestWhere>;
  node_NOT?: InputMaybe<RequestWhere>;
};

export type ProjectHasRequestRequestsCreateFieldInput = {
  node: RequestCreateInput;
};

export type ProjectHasRequestRequestsDeleteFieldInput = {
  delete?: InputMaybe<RequestDeleteInput>;
  where?: InputMaybe<ProjectHasRequestRequestsConnectionWhere>;
};

export type ProjectHasRequestRequestsDisconnectFieldInput = {
  disconnect?: InputMaybe<RequestDisconnectInput>;
  where?: InputMaybe<ProjectHasRequestRequestsConnectionWhere>;
};

export type ProjectHasRequestRequestsFieldInput = {
  connect?: InputMaybe<Array<ProjectHasRequestRequestsConnectFieldInput>>;
  create?: InputMaybe<Array<ProjectHasRequestRequestsCreateFieldInput>>;
};

export type ProjectHasRequestRequestsNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<ProjectHasRequestRequestsNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<ProjectHasRequestRequestsNodeAggregationWhereInput>>;
  dataAccessEmails_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  dataAccessEmails_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  dataAccessEmails_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  dataAccessEmails_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  dataAccessEmails_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  dataAccessEmails_EQUAL?: InputMaybe<Scalars["String"]>;
  dataAccessEmails_GT?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_GTE?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_LT?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_LTE?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  dataAnalystEmail_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  dataAnalystEmail_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  dataAnalystEmail_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  dataAnalystEmail_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  dataAnalystEmail_EQUAL?: InputMaybe<Scalars["String"]>;
  dataAnalystEmail_GT?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_GTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_LT?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_LTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  dataAnalystName_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  dataAnalystName_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  dataAnalystName_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  dataAnalystName_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  dataAnalystName_EQUAL?: InputMaybe<Scalars["String"]>;
  dataAnalystName_GT?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_GTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_LT?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_LTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  genePanel_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  genePanel_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  genePanel_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  genePanel_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  genePanel_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  genePanel_EQUAL?: InputMaybe<Scalars["String"]>;
  genePanel_GT?: InputMaybe<Scalars["Int"]>;
  genePanel_GTE?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  genePanel_LT?: InputMaybe<Scalars["Int"]>;
  genePanel_LTE?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  igoProjectId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  igoProjectId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  igoProjectId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  igoProjectId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  igoProjectId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  igoProjectId_EQUAL?: InputMaybe<Scalars["String"]>;
  igoProjectId_GT?: InputMaybe<Scalars["Int"]>;
  igoProjectId_GTE?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LT?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LTE?: InputMaybe<Scalars["Int"]>;
  igoProjectId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  igoProjectId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  igoProjectId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  igoProjectId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  igoProjectId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  igoRequestId_EQUAL?: InputMaybe<Scalars["String"]>;
  igoRequestId_GT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_GTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  investigatorEmail_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  investigatorEmail_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  investigatorEmail_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  investigatorEmail_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  investigatorEmail_EQUAL?: InputMaybe<Scalars["String"]>;
  investigatorEmail_GT?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_GTE?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_LT?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_LTE?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  investigatorName_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  investigatorName_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  investigatorName_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  investigatorName_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  investigatorName_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  investigatorName_EQUAL?: InputMaybe<Scalars["String"]>;
  investigatorName_GT?: InputMaybe<Scalars["Int"]>;
  investigatorName_GTE?: InputMaybe<Scalars["Int"]>;
  investigatorName_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  investigatorName_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  investigatorName_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  investigatorName_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  investigatorName_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  investigatorName_LT?: InputMaybe<Scalars["Int"]>;
  investigatorName_LTE?: InputMaybe<Scalars["Int"]>;
  investigatorName_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  investigatorName_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  investigatorName_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  investigatorName_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  investigatorName_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  labHeadEmail_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  labHeadEmail_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  labHeadEmail_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  labHeadEmail_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  labHeadEmail_EQUAL?: InputMaybe<Scalars["String"]>;
  labHeadEmail_GT?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_GTE?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_LT?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_LTE?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  labHeadName_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  labHeadName_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  labHeadName_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  labHeadName_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  labHeadName_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  labHeadName_EQUAL?: InputMaybe<Scalars["String"]>;
  labHeadName_GT?: InputMaybe<Scalars["Int"]>;
  labHeadName_GTE?: InputMaybe<Scalars["Int"]>;
  labHeadName_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  labHeadName_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  labHeadName_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  labHeadName_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  labHeadName_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  labHeadName_LT?: InputMaybe<Scalars["Int"]>;
  labHeadName_LTE?: InputMaybe<Scalars["Int"]>;
  labHeadName_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  labHeadName_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  labHeadName_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  labHeadName_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  labHeadName_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  libraryType_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  libraryType_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  libraryType_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  libraryType_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  libraryType_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  libraryType_EQUAL?: InputMaybe<Scalars["String"]>;
  libraryType_GT?: InputMaybe<Scalars["Int"]>;
  libraryType_GTE?: InputMaybe<Scalars["Int"]>;
  libraryType_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  libraryType_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  libraryType_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  libraryType_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  libraryType_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  libraryType_LT?: InputMaybe<Scalars["Int"]>;
  libraryType_LTE?: InputMaybe<Scalars["Int"]>;
  libraryType_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  libraryType_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  libraryType_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  libraryType_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  libraryType_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  namespace_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  namespace_EQUAL?: InputMaybe<Scalars["String"]>;
  namespace_GT?: InputMaybe<Scalars["Int"]>;
  namespace_GTE?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  namespace_LT?: InputMaybe<Scalars["Int"]>;
  namespace_LTE?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  otherContactEmails_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  otherContactEmails_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  otherContactEmails_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  otherContactEmails_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  otherContactEmails_EQUAL?: InputMaybe<Scalars["String"]>;
  otherContactEmails_GT?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_GTE?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_LT?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_LTE?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  piEmail_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  piEmail_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  piEmail_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  piEmail_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  piEmail_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  piEmail_EQUAL?: InputMaybe<Scalars["String"]>;
  piEmail_GT?: InputMaybe<Scalars["Int"]>;
  piEmail_GTE?: InputMaybe<Scalars["Int"]>;
  piEmail_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  piEmail_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  piEmail_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  piEmail_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  piEmail_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  piEmail_LT?: InputMaybe<Scalars["Int"]>;
  piEmail_LTE?: InputMaybe<Scalars["Int"]>;
  piEmail_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  piEmail_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  piEmail_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  piEmail_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  piEmail_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  projectManagerName_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  projectManagerName_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  projectManagerName_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  projectManagerName_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  projectManagerName_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  projectManagerName_EQUAL?: InputMaybe<Scalars["String"]>;
  projectManagerName_GT?: InputMaybe<Scalars["Int"]>;
  projectManagerName_GTE?: InputMaybe<Scalars["Int"]>;
  projectManagerName_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  projectManagerName_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  projectManagerName_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  projectManagerName_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  projectManagerName_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  projectManagerName_LT?: InputMaybe<Scalars["Int"]>;
  projectManagerName_LTE?: InputMaybe<Scalars["Int"]>;
  projectManagerName_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  projectManagerName_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  projectManagerName_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  projectManagerName_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  projectManagerName_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  qcAccessEmails_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  qcAccessEmails_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  qcAccessEmails_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  qcAccessEmails_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  qcAccessEmails_EQUAL?: InputMaybe<Scalars["String"]>;
  qcAccessEmails_GT?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_GTE?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_LT?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_LTE?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  requestJson_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  requestJson_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  requestJson_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  requestJson_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  requestJson_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  requestJson_EQUAL?: InputMaybe<Scalars["String"]>;
  requestJson_GT?: InputMaybe<Scalars["Int"]>;
  requestJson_GTE?: InputMaybe<Scalars["Int"]>;
  requestJson_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  requestJson_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  requestJson_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  requestJson_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  requestJson_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  requestJson_LT?: InputMaybe<Scalars["Int"]>;
  requestJson_LTE?: InputMaybe<Scalars["Int"]>;
  requestJson_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  requestJson_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  requestJson_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  requestJson_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  requestJson_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  smileRequestId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  smileRequestId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  smileRequestId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  smileRequestId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  smileRequestId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  smileRequestId_EQUAL?: InputMaybe<Scalars["String"]>;
  smileRequestId_GT?: InputMaybe<Scalars["Int"]>;
  smileRequestId_GTE?: InputMaybe<Scalars["Int"]>;
  smileRequestId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  smileRequestId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  smileRequestId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  smileRequestId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  smileRequestId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  smileRequestId_LT?: InputMaybe<Scalars["Int"]>;
  smileRequestId_LTE?: InputMaybe<Scalars["Int"]>;
  smileRequestId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  smileRequestId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  smileRequestId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  smileRequestId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  smileRequestId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  strand_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  strand_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  strand_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  strand_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  strand_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  strand_EQUAL?: InputMaybe<Scalars["String"]>;
  strand_GT?: InputMaybe<Scalars["Int"]>;
  strand_GTE?: InputMaybe<Scalars["Int"]>;
  strand_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  strand_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  strand_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  strand_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  strand_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  strand_LT?: InputMaybe<Scalars["Int"]>;
  strand_LTE?: InputMaybe<Scalars["Int"]>;
  strand_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  strand_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  strand_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  strand_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  strand_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
};

export type ProjectHasRequestRequestsRelationship = {
  __typename?: "ProjectHasRequestRequestsRelationship";
  cursor: Scalars["String"];
  node: Request;
};

export type ProjectHasRequestRequestsUpdateConnectionInput = {
  node?: InputMaybe<RequestUpdateInput>;
};

export type ProjectHasRequestRequestsUpdateFieldInput = {
  connect?: InputMaybe<Array<ProjectHasRequestRequestsConnectFieldInput>>;
  create?: InputMaybe<Array<ProjectHasRequestRequestsCreateFieldInput>>;
  delete?: InputMaybe<Array<ProjectHasRequestRequestsDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<ProjectHasRequestRequestsDisconnectFieldInput>>;
  update?: InputMaybe<ProjectHasRequestRequestsUpdateConnectionInput>;
  where?: InputMaybe<ProjectHasRequestRequestsConnectionWhere>;
};

export type ProjectOptions = {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more ProjectSort objects to sort Projects by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<ProjectSort>>;
};

export type ProjectRelationInput = {
  hasRequestRequests?: InputMaybe<
    Array<ProjectHasRequestRequestsCreateFieldInput>
  >;
};

export type ProjectRequestHasRequestRequestsAggregationSelection = {
  __typename?: "ProjectRequestHasRequestRequestsAggregationSelection";
  count: Scalars["Int"];
  node?: Maybe<ProjectRequestHasRequestRequestsNodeAggregateSelection>;
};

export type ProjectRequestHasRequestRequestsNodeAggregateSelection = {
  __typename?: "ProjectRequestHasRequestRequestsNodeAggregateSelection";
  dataAccessEmails: StringAggregateSelectionNonNullable;
  dataAnalystEmail: StringAggregateSelectionNonNullable;
  dataAnalystName: StringAggregateSelectionNonNullable;
  genePanel: StringAggregateSelectionNonNullable;
  igoProjectId: StringAggregateSelectionNonNullable;
  igoRequestId: StringAggregateSelectionNonNullable;
  investigatorEmail: StringAggregateSelectionNonNullable;
  investigatorName: StringAggregateSelectionNonNullable;
  labHeadEmail: StringAggregateSelectionNonNullable;
  labHeadName: StringAggregateSelectionNonNullable;
  libraryType: StringAggregateSelectionNullable;
  namespace: StringAggregateSelectionNonNullable;
  otherContactEmails: StringAggregateSelectionNonNullable;
  piEmail: StringAggregateSelectionNonNullable;
  projectManagerName: StringAggregateSelectionNonNullable;
  qcAccessEmails: StringAggregateSelectionNonNullable;
  requestJson: StringAggregateSelectionNonNullable;
  smileRequestId: StringAggregateSelectionNonNullable;
  strand: StringAggregateSelectionNullable;
};

/** Fields to sort Projects by. The order in which sorts are applied is not guaranteed when specifying many fields in one ProjectSort object. */
export type ProjectSort = {
  igoProjectId?: InputMaybe<SortDirection>;
  namespace?: InputMaybe<SortDirection>;
};

export type ProjectUpdateInput = {
  hasRequestRequests?: InputMaybe<
    Array<ProjectHasRequestRequestsUpdateFieldInput>
  >;
  igoProjectId?: InputMaybe<Scalars["String"]>;
  namespace?: InputMaybe<Scalars["String"]>;
};

export type ProjectWhere = {
  AND?: InputMaybe<Array<ProjectWhere>>;
  OR?: InputMaybe<Array<ProjectWhere>>;
  hasRequestRequestsAggregate?: InputMaybe<ProjectHasRequestRequestsAggregateInput>;
  hasRequestRequestsConnection_ALL?: InputMaybe<ProjectHasRequestRequestsConnectionWhere>;
  hasRequestRequestsConnection_NONE?: InputMaybe<ProjectHasRequestRequestsConnectionWhere>;
  hasRequestRequestsConnection_SINGLE?: InputMaybe<ProjectHasRequestRequestsConnectionWhere>;
  hasRequestRequestsConnection_SOME?: InputMaybe<ProjectHasRequestRequestsConnectionWhere>;
  /** Return Projects where all of the related Requests match this filter */
  hasRequestRequests_ALL?: InputMaybe<RequestWhere>;
  /** Return Projects where none of the related Requests match this filter */
  hasRequestRequests_NONE?: InputMaybe<RequestWhere>;
  /** Return Projects where one of the related Requests match this filter */
  hasRequestRequests_SINGLE?: InputMaybe<RequestWhere>;
  /** Return Projects where some of the related Requests match this filter */
  hasRequestRequests_SOME?: InputMaybe<RequestWhere>;
  igoProjectId?: InputMaybe<Scalars["String"]>;
  igoProjectId_CONTAINS?: InputMaybe<Scalars["String"]>;
  igoProjectId_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  igoProjectId_IN?: InputMaybe<Array<Scalars["String"]>>;
  igoProjectId_NOT?: InputMaybe<Scalars["String"]>;
  igoProjectId_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  igoProjectId_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  igoProjectId_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  igoProjectId_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  igoProjectId_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  namespace?: InputMaybe<Scalars["String"]>;
  namespace_CONTAINS?: InputMaybe<Scalars["String"]>;
  namespace_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  namespace_IN?: InputMaybe<Array<Scalars["String"]>>;
  namespace_NOT?: InputMaybe<Scalars["String"]>;
  namespace_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  namespace_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  namespace_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  namespace_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  namespace_STARTS_WITH?: InputMaybe<Scalars["String"]>;
};

export type ProjectsConnection = {
  __typename?: "ProjectsConnection";
  edges: Array<ProjectEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type Query = {
  __typename?: "Query";
  patientAliases: Array<PatientAlias>;
  patientAliasesAggregate: PatientAliasAggregateSelection;
  patientAliasesConnection: PatientAliasesConnection;
  patients: Array<Patient>;
  patientsAggregate: PatientAggregateSelection;
  patientsConnection: PatientsConnection;
  projects: Array<Project>;
  projectsAggregate: ProjectAggregateSelection;
  projectsConnection: ProjectsConnection;
  requestMetadata: Array<RequestMetadata>;
  requestMetadataAggregate: RequestMetadataAggregateSelection;
  requestMetadataConnection: RequestMetadataConnection;
  requests: Array<Request>;
  requestsAggregate: RequestAggregateSelection;
  requestsConnection: RequestsConnection;
  sampleAliases: Array<SampleAlias>;
  sampleAliasesAggregate: SampleAliasAggregateSelection;
  sampleAliasesConnection: SampleAliasesConnection;
  sampleMetadata: Array<SampleMetadata>;
  sampleMetadataAggregate: SampleMetadataAggregateSelection;
  sampleMetadataConnection: SampleMetadataConnection;
  samples: Array<Sample>;
  samplesAggregate: SampleAggregateSelection;
  samplesConnection: SamplesConnection;
  statuses: Array<Status>;
  statusesAggregate: StatusAggregateSelection;
  statusesConnection: StatusesConnection;
};

export type QueryPatientAliasesArgs = {
  options?: InputMaybe<PatientAliasOptions>;
  where?: InputMaybe<PatientAliasWhere>;
};

export type QueryPatientAliasesAggregateArgs = {
  where?: InputMaybe<PatientAliasWhere>;
};

export type QueryPatientAliasesConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<PatientAliasSort>>>;
  where?: InputMaybe<PatientAliasWhere>;
};

export type QueryPatientsArgs = {
  options?: InputMaybe<PatientOptions>;
  where?: InputMaybe<PatientWhere>;
};

export type QueryPatientsAggregateArgs = {
  where?: InputMaybe<PatientWhere>;
};

export type QueryPatientsConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<PatientSort>>>;
  where?: InputMaybe<PatientWhere>;
};

export type QueryProjectsArgs = {
  options?: InputMaybe<ProjectOptions>;
  where?: InputMaybe<ProjectWhere>;
};

export type QueryProjectsAggregateArgs = {
  where?: InputMaybe<ProjectWhere>;
};

export type QueryProjectsConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<ProjectSort>>>;
  where?: InputMaybe<ProjectWhere>;
};

export type QueryRequestMetadataArgs = {
  options?: InputMaybe<RequestMetadataOptions>;
  where?: InputMaybe<RequestMetadataWhere>;
};

export type QueryRequestMetadataAggregateArgs = {
  where?: InputMaybe<RequestMetadataWhere>;
};

export type QueryRequestMetadataConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<RequestMetadataSort>>>;
  where?: InputMaybe<RequestMetadataWhere>;
};

export type QueryRequestsArgs = {
  options?: InputMaybe<RequestOptions>;
  where?: InputMaybe<RequestWhere>;
};

export type QueryRequestsAggregateArgs = {
  where?: InputMaybe<RequestWhere>;
};

export type QueryRequestsConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<RequestSort>>>;
  where?: InputMaybe<RequestWhere>;
};

export type QuerySampleAliasesArgs = {
  options?: InputMaybe<SampleAliasOptions>;
  where?: InputMaybe<SampleAliasWhere>;
};

export type QuerySampleAliasesAggregateArgs = {
  where?: InputMaybe<SampleAliasWhere>;
};

export type QuerySampleAliasesConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<SampleAliasSort>>>;
  where?: InputMaybe<SampleAliasWhere>;
};

export type QuerySampleMetadataArgs = {
  options?: InputMaybe<SampleMetadataOptions>;
  where?: InputMaybe<SampleMetadataWhere>;
};

export type QuerySampleMetadataAggregateArgs = {
  where?: InputMaybe<SampleMetadataWhere>;
};

export type QuerySampleMetadataConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<SampleMetadataSort>>>;
  where?: InputMaybe<SampleMetadataWhere>;
};

export type QuerySamplesArgs = {
  options?: InputMaybe<SampleOptions>;
  where?: InputMaybe<SampleWhere>;
};

export type QuerySamplesAggregateArgs = {
  where?: InputMaybe<SampleWhere>;
};

export type QuerySamplesConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<SampleSort>>>;
  where?: InputMaybe<SampleWhere>;
};

export type QueryStatusesArgs = {
  options?: InputMaybe<StatusOptions>;
  where?: InputMaybe<StatusWhere>;
};

export type QueryStatusesAggregateArgs = {
  where?: InputMaybe<StatusWhere>;
};

export type QueryStatusesConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<InputMaybe<StatusSort>>>;
  where?: InputMaybe<StatusWhere>;
};

export type Request = {
  __typename?: "Request";
  bicAnalysis: Scalars["Boolean"];
  dataAccessEmails: Scalars["String"];
  dataAnalystEmail: Scalars["String"];
  dataAnalystName: Scalars["String"];
  genePanel: Scalars["String"];
  hasSampleSamples: Array<Sample>;
  hasSampleSamplesAggregate?: Maybe<RequestSampleHasSampleSamplesAggregationSelection>;
  hasSampleSamplesConnection: RequestHasSampleSamplesConnection;
  igoProjectId: Scalars["String"];
  igoRequestId: Scalars["String"];
  investigatorEmail: Scalars["String"];
  investigatorName: Scalars["String"];
  isCmoRequest: Scalars["Boolean"];
  labHeadEmail: Scalars["String"];
  labHeadName: Scalars["String"];
  libraryType?: Maybe<Scalars["String"]>;
  namespace: Scalars["String"];
  otherContactEmails: Scalars["String"];
  piEmail: Scalars["String"];
  pooledNormals: Array<Maybe<Scalars["String"]>>;
  projectManagerName: Scalars["String"];
  projectsHasRequest: Array<Project>;
  projectsHasRequestAggregate?: Maybe<RequestProjectProjectsHasRequestAggregationSelection>;
  projectsHasRequestConnection: RequestProjectsHasRequestConnection;
  qcAccessEmails: Scalars["String"];
  requestJson: Scalars["String"];
  revisable?: Maybe<Scalars["Boolean"]>;
  smileRequestId: Scalars["String"];
  strand?: Maybe<Scalars["String"]>;
};

export type RequestHasSampleSamplesArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  options?: InputMaybe<SampleOptions>;
  where?: InputMaybe<SampleWhere>;
};

export type RequestHasSampleSamplesAggregateArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  where?: InputMaybe<SampleWhere>;
};

export type RequestHasSampleSamplesConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  directed?: InputMaybe<Scalars["Boolean"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<RequestHasSampleSamplesConnectionSort>>;
  where?: InputMaybe<RequestHasSampleSamplesConnectionWhere>;
};

export type RequestProjectsHasRequestArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  options?: InputMaybe<ProjectOptions>;
  where?: InputMaybe<ProjectWhere>;
};

export type RequestProjectsHasRequestAggregateArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  where?: InputMaybe<ProjectWhere>;
};

export type RequestProjectsHasRequestConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  directed?: InputMaybe<Scalars["Boolean"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<RequestProjectsHasRequestConnectionSort>>;
  where?: InputMaybe<RequestProjectsHasRequestConnectionWhere>;
};

export type RequestAggregateSelection = {
  __typename?: "RequestAggregateSelection";
  count: Scalars["Int"];
  dataAccessEmails: StringAggregateSelectionNonNullable;
  dataAnalystEmail: StringAggregateSelectionNonNullable;
  dataAnalystName: StringAggregateSelectionNonNullable;
  genePanel: StringAggregateSelectionNonNullable;
  igoProjectId: StringAggregateSelectionNonNullable;
  igoRequestId: StringAggregateSelectionNonNullable;
  investigatorEmail: StringAggregateSelectionNonNullable;
  investigatorName: StringAggregateSelectionNonNullable;
  labHeadEmail: StringAggregateSelectionNonNullable;
  labHeadName: StringAggregateSelectionNonNullable;
  libraryType: StringAggregateSelectionNullable;
  namespace: StringAggregateSelectionNonNullable;
  otherContactEmails: StringAggregateSelectionNonNullable;
  piEmail: StringAggregateSelectionNonNullable;
  projectManagerName: StringAggregateSelectionNonNullable;
  qcAccessEmails: StringAggregateSelectionNonNullable;
  requestJson: StringAggregateSelectionNonNullable;
  smileRequestId: StringAggregateSelectionNonNullable;
  strand: StringAggregateSelectionNullable;
};

export type RequestConnectInput = {
  hasSampleSamples?: InputMaybe<
    Array<RequestHasSampleSamplesConnectFieldInput>
  >;
  projectsHasRequest?: InputMaybe<
    Array<RequestProjectsHasRequestConnectFieldInput>
  >;
};

export type RequestConnectWhere = {
  node: RequestWhere;
};

export type RequestCreateInput = {
  bicAnalysis: Scalars["Boolean"];
  dataAccessEmails: Scalars["String"];
  dataAnalystEmail: Scalars["String"];
  dataAnalystName: Scalars["String"];
  genePanel: Scalars["String"];
  hasSampleSamples?: InputMaybe<RequestHasSampleSamplesFieldInput>;
  igoProjectId: Scalars["String"];
  igoRequestId: Scalars["String"];
  investigatorEmail: Scalars["String"];
  investigatorName: Scalars["String"];
  isCmoRequest: Scalars["Boolean"];
  labHeadEmail: Scalars["String"];
  labHeadName: Scalars["String"];
  libraryType?: InputMaybe<Scalars["String"]>;
  namespace: Scalars["String"];
  otherContactEmails: Scalars["String"];
  piEmail: Scalars["String"];
  pooledNormals: Array<InputMaybe<Scalars["String"]>>;
  projectManagerName: Scalars["String"];
  projectsHasRequest?: InputMaybe<RequestProjectsHasRequestFieldInput>;
  qcAccessEmails: Scalars["String"];
  requestJson: Scalars["String"];
  revisable?: InputMaybe<Scalars["Boolean"]>;
  smileRequestId: Scalars["String"];
  strand?: InputMaybe<Scalars["String"]>;
};

export type RequestDeleteInput = {
  hasSampleSamples?: InputMaybe<Array<RequestHasSampleSamplesDeleteFieldInput>>;
  projectsHasRequest?: InputMaybe<
    Array<RequestProjectsHasRequestDeleteFieldInput>
  >;
};

export type RequestDisconnectInput = {
  hasSampleSamples?: InputMaybe<
    Array<RequestHasSampleSamplesDisconnectFieldInput>
  >;
  projectsHasRequest?: InputMaybe<
    Array<RequestProjectsHasRequestDisconnectFieldInput>
  >;
};

export type RequestEdge = {
  __typename?: "RequestEdge";
  cursor: Scalars["String"];
  node: Request;
};

export type RequestHasSampleSamplesAggregateInput = {
  AND?: InputMaybe<Array<RequestHasSampleSamplesAggregateInput>>;
  OR?: InputMaybe<Array<RequestHasSampleSamplesAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<RequestHasSampleSamplesNodeAggregationWhereInput>;
};

export type RequestHasSampleSamplesConnectFieldInput = {
  connect?: InputMaybe<Array<SampleConnectInput>>;
  where?: InputMaybe<SampleConnectWhere>;
};

export type RequestHasSampleSamplesConnection = {
  __typename?: "RequestHasSampleSamplesConnection";
  edges: Array<RequestHasSampleSamplesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type RequestHasSampleSamplesConnectionSort = {
  node?: InputMaybe<SampleSort>;
};

export type RequestHasSampleSamplesConnectionWhere = {
  AND?: InputMaybe<Array<RequestHasSampleSamplesConnectionWhere>>;
  OR?: InputMaybe<Array<RequestHasSampleSamplesConnectionWhere>>;
  node?: InputMaybe<SampleWhere>;
  node_NOT?: InputMaybe<SampleWhere>;
};

export type RequestHasSampleSamplesCreateFieldInput = {
  node: SampleCreateInput;
};

export type RequestHasSampleSamplesDeleteFieldInput = {
  delete?: InputMaybe<SampleDeleteInput>;
  where?: InputMaybe<RequestHasSampleSamplesConnectionWhere>;
};

export type RequestHasSampleSamplesDisconnectFieldInput = {
  disconnect?: InputMaybe<SampleDisconnectInput>;
  where?: InputMaybe<RequestHasSampleSamplesConnectionWhere>;
};

export type RequestHasSampleSamplesFieldInput = {
  connect?: InputMaybe<Array<RequestHasSampleSamplesConnectFieldInput>>;
  create?: InputMaybe<Array<RequestHasSampleSamplesCreateFieldInput>>;
};

export type RequestHasSampleSamplesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<RequestHasSampleSamplesNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<RequestHasSampleSamplesNodeAggregationWhereInput>>;
  datasource_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  datasource_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  datasource_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  datasource_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  datasource_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  datasource_EQUAL?: InputMaybe<Scalars["String"]>;
  datasource_GT?: InputMaybe<Scalars["Int"]>;
  datasource_GTE?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  datasource_LT?: InputMaybe<Scalars["Int"]>;
  datasource_LTE?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  sampleCategory_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  sampleCategory_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  sampleCategory_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  sampleCategory_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  sampleCategory_EQUAL?: InputMaybe<Scalars["String"]>;
  sampleCategory_GT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_GTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  sampleClass_EQUAL?: InputMaybe<Scalars["String"]>;
  sampleClass_GT?: InputMaybe<Scalars["Int"]>;
  sampleClass_GTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_LT?: InputMaybe<Scalars["Int"]>;
  sampleClass_LTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  smileSampleId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  smileSampleId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  smileSampleId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  smileSampleId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  smileSampleId_EQUAL?: InputMaybe<Scalars["String"]>;
  smileSampleId_GT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_GTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
};

export type RequestHasSampleSamplesRelationship = {
  __typename?: "RequestHasSampleSamplesRelationship";
  cursor: Scalars["String"];
  node: Sample;
};

export type RequestHasSampleSamplesUpdateConnectionInput = {
  node?: InputMaybe<SampleUpdateInput>;
};

export type RequestHasSampleSamplesUpdateFieldInput = {
  connect?: InputMaybe<Array<RequestHasSampleSamplesConnectFieldInput>>;
  create?: InputMaybe<Array<RequestHasSampleSamplesCreateFieldInput>>;
  delete?: InputMaybe<Array<RequestHasSampleSamplesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<RequestHasSampleSamplesDisconnectFieldInput>>;
  update?: InputMaybe<RequestHasSampleSamplesUpdateConnectionInput>;
  where?: InputMaybe<RequestHasSampleSamplesConnectionWhere>;
};

export type RequestMetadata = {
  __typename?: "RequestMetadata";
  hasStatusStatuses: Array<Status>;
  hasStatusStatusesAggregate?: Maybe<RequestMetadataStatusHasStatusStatusesAggregationSelection>;
  hasStatusStatusesConnection: RequestMetadataHasStatusStatusesConnection;
  igoRequestId: Scalars["String"];
  importDate: Scalars["String"];
  requestMetadataJson: Scalars["String"];
};

export type RequestMetadataHasStatusStatusesArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  options?: InputMaybe<StatusOptions>;
  where?: InputMaybe<StatusWhere>;
};

export type RequestMetadataHasStatusStatusesAggregateArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  where?: InputMaybe<StatusWhere>;
};

export type RequestMetadataHasStatusStatusesConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  directed?: InputMaybe<Scalars["Boolean"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<RequestMetadataHasStatusStatusesConnectionSort>>;
  where?: InputMaybe<RequestMetadataHasStatusStatusesConnectionWhere>;
};

export type RequestMetadataAggregateSelection = {
  __typename?: "RequestMetadataAggregateSelection";
  count: Scalars["Int"];
  igoRequestId: StringAggregateSelectionNonNullable;
  importDate: StringAggregateSelectionNonNullable;
  requestMetadataJson: StringAggregateSelectionNonNullable;
};

export type RequestMetadataConnectInput = {
  hasStatusStatuses?: InputMaybe<
    Array<RequestMetadataHasStatusStatusesConnectFieldInput>
  >;
};

export type RequestMetadataConnectWhere = {
  node: RequestMetadataWhere;
};

export type RequestMetadataConnection = {
  __typename?: "RequestMetadataConnection";
  edges: Array<RequestMetadataEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type RequestMetadataCreateInput = {
  hasStatusStatuses?: InputMaybe<RequestMetadataHasStatusStatusesFieldInput>;
  igoRequestId: Scalars["String"];
  importDate: Scalars["String"];
  requestMetadataJson: Scalars["String"];
};

export type RequestMetadataDeleteInput = {
  hasStatusStatuses?: InputMaybe<
    Array<RequestMetadataHasStatusStatusesDeleteFieldInput>
  >;
};

export type RequestMetadataDisconnectInput = {
  hasStatusStatuses?: InputMaybe<
    Array<RequestMetadataHasStatusStatusesDisconnectFieldInput>
  >;
};

export type RequestMetadataEdge = {
  __typename?: "RequestMetadataEdge";
  cursor: Scalars["String"];
  node: RequestMetadata;
};

export type RequestMetadataHasStatusStatusesAggregateInput = {
  AND?: InputMaybe<Array<RequestMetadataHasStatusStatusesAggregateInput>>;
  OR?: InputMaybe<Array<RequestMetadataHasStatusStatusesAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<RequestMetadataHasStatusStatusesNodeAggregationWhereInput>;
};

export type RequestMetadataHasStatusStatusesConnectFieldInput = {
  connect?: InputMaybe<Array<StatusConnectInput>>;
  where?: InputMaybe<StatusConnectWhere>;
};

export type RequestMetadataHasStatusStatusesConnection = {
  __typename?: "RequestMetadataHasStatusStatusesConnection";
  edges: Array<RequestMetadataHasStatusStatusesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type RequestMetadataHasStatusStatusesConnectionSort = {
  node?: InputMaybe<StatusSort>;
};

export type RequestMetadataHasStatusStatusesConnectionWhere = {
  AND?: InputMaybe<Array<RequestMetadataHasStatusStatusesConnectionWhere>>;
  OR?: InputMaybe<Array<RequestMetadataHasStatusStatusesConnectionWhere>>;
  node?: InputMaybe<StatusWhere>;
  node_NOT?: InputMaybe<StatusWhere>;
};

export type RequestMetadataHasStatusStatusesCreateFieldInput = {
  node: StatusCreateInput;
};

export type RequestMetadataHasStatusStatusesDeleteFieldInput = {
  delete?: InputMaybe<StatusDeleteInput>;
  where?: InputMaybe<RequestMetadataHasStatusStatusesConnectionWhere>;
};

export type RequestMetadataHasStatusStatusesDisconnectFieldInput = {
  disconnect?: InputMaybe<StatusDisconnectInput>;
  where?: InputMaybe<RequestMetadataHasStatusStatusesConnectionWhere>;
};

export type RequestMetadataHasStatusStatusesFieldInput = {
  connect?: InputMaybe<
    Array<RequestMetadataHasStatusStatusesConnectFieldInput>
  >;
  create?: InputMaybe<Array<RequestMetadataHasStatusStatusesCreateFieldInput>>;
};

export type RequestMetadataHasStatusStatusesNodeAggregationWhereInput = {
  AND?: InputMaybe<
    Array<RequestMetadataHasStatusStatusesNodeAggregationWhereInput>
  >;
  OR?: InputMaybe<
    Array<RequestMetadataHasStatusStatusesNodeAggregationWhereInput>
  >;
  validationReport_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  validationReport_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  validationReport_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  validationReport_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  validationReport_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  validationReport_EQUAL?: InputMaybe<Scalars["String"]>;
  validationReport_GT?: InputMaybe<Scalars["Int"]>;
  validationReport_GTE?: InputMaybe<Scalars["Int"]>;
  validationReport_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  validationReport_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  validationReport_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  validationReport_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  validationReport_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  validationReport_LT?: InputMaybe<Scalars["Int"]>;
  validationReport_LTE?: InputMaybe<Scalars["Int"]>;
  validationReport_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  validationReport_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  validationReport_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  validationReport_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  validationReport_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
};

export type RequestMetadataHasStatusStatusesRelationship = {
  __typename?: "RequestMetadataHasStatusStatusesRelationship";
  cursor: Scalars["String"];
  node: Status;
};

export type RequestMetadataHasStatusStatusesUpdateConnectionInput = {
  node?: InputMaybe<StatusUpdateInput>;
};

export type RequestMetadataHasStatusStatusesUpdateFieldInput = {
  connect?: InputMaybe<
    Array<RequestMetadataHasStatusStatusesConnectFieldInput>
  >;
  create?: InputMaybe<Array<RequestMetadataHasStatusStatusesCreateFieldInput>>;
  delete?: InputMaybe<Array<RequestMetadataHasStatusStatusesDeleteFieldInput>>;
  disconnect?: InputMaybe<
    Array<RequestMetadataHasStatusStatusesDisconnectFieldInput>
  >;
  update?: InputMaybe<RequestMetadataHasStatusStatusesUpdateConnectionInput>;
  where?: InputMaybe<RequestMetadataHasStatusStatusesConnectionWhere>;
};

export type RequestMetadataOptions = {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more RequestMetadataSort objects to sort RequestMetadata by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<RequestMetadataSort>>;
};

export type RequestMetadataRelationInput = {
  hasStatusStatuses?: InputMaybe<
    Array<RequestMetadataHasStatusStatusesCreateFieldInput>
  >;
};

/** Fields to sort RequestMetadata by. The order in which sorts are applied is not guaranteed when specifying many fields in one RequestMetadataSort object. */
export type RequestMetadataSort = {
  igoRequestId?: InputMaybe<SortDirection>;
  importDate?: InputMaybe<SortDirection>;
  requestMetadataJson?: InputMaybe<SortDirection>;
};

export type RequestMetadataStatusHasStatusStatusesAggregationSelection = {
  __typename?: "RequestMetadataStatusHasStatusStatusesAggregationSelection";
  count: Scalars["Int"];
  node?: Maybe<RequestMetadataStatusHasStatusStatusesNodeAggregateSelection>;
};

export type RequestMetadataStatusHasStatusStatusesNodeAggregateSelection = {
  __typename?: "RequestMetadataStatusHasStatusStatusesNodeAggregateSelection";
  validationReport: StringAggregateSelectionNonNullable;
};

export type RequestMetadataUpdateInput = {
  hasStatusStatuses?: InputMaybe<
    Array<RequestMetadataHasStatusStatusesUpdateFieldInput>
  >;
  igoRequestId?: InputMaybe<Scalars["String"]>;
  importDate?: InputMaybe<Scalars["String"]>;
  requestMetadataJson?: InputMaybe<Scalars["String"]>;
};

export type RequestMetadataWhere = {
  AND?: InputMaybe<Array<RequestMetadataWhere>>;
  OR?: InputMaybe<Array<RequestMetadataWhere>>;
  hasStatusStatusesAggregate?: InputMaybe<RequestMetadataHasStatusStatusesAggregateInput>;
  hasStatusStatusesConnection_ALL?: InputMaybe<RequestMetadataHasStatusStatusesConnectionWhere>;
  hasStatusStatusesConnection_NONE?: InputMaybe<RequestMetadataHasStatusStatusesConnectionWhere>;
  hasStatusStatusesConnection_SINGLE?: InputMaybe<RequestMetadataHasStatusStatusesConnectionWhere>;
  hasStatusStatusesConnection_SOME?: InputMaybe<RequestMetadataHasStatusStatusesConnectionWhere>;
  /** Return RequestMetadata where all of the related Statuses match this filter */
  hasStatusStatuses_ALL?: InputMaybe<StatusWhere>;
  /** Return RequestMetadata where none of the related Statuses match this filter */
  hasStatusStatuses_NONE?: InputMaybe<StatusWhere>;
  /** Return RequestMetadata where one of the related Statuses match this filter */
  hasStatusStatuses_SINGLE?: InputMaybe<StatusWhere>;
  /** Return RequestMetadata where some of the related Statuses match this filter */
  hasStatusStatuses_SOME?: InputMaybe<StatusWhere>;
  igoRequestId?: InputMaybe<Scalars["String"]>;
  igoRequestId_CONTAINS?: InputMaybe<Scalars["String"]>;
  igoRequestId_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  igoRequestId_IN?: InputMaybe<Array<Scalars["String"]>>;
  igoRequestId_NOT?: InputMaybe<Scalars["String"]>;
  igoRequestId_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  igoRequestId_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  igoRequestId_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  igoRequestId_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  igoRequestId_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  importDate?: InputMaybe<Scalars["String"]>;
  importDate_CONTAINS?: InputMaybe<Scalars["String"]>;
  importDate_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  importDate_IN?: InputMaybe<Array<Scalars["String"]>>;
  importDate_NOT?: InputMaybe<Scalars["String"]>;
  importDate_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  importDate_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  importDate_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  importDate_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  importDate_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  requestMetadataJson?: InputMaybe<Scalars["String"]>;
  requestMetadataJson_CONTAINS?: InputMaybe<Scalars["String"]>;
  requestMetadataJson_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  requestMetadataJson_IN?: InputMaybe<Array<Scalars["String"]>>;
  requestMetadataJson_NOT?: InputMaybe<Scalars["String"]>;
  requestMetadataJson_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  requestMetadataJson_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  requestMetadataJson_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  requestMetadataJson_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  requestMetadataJson_STARTS_WITH?: InputMaybe<Scalars["String"]>;
};

export type RequestOptions = {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more RequestSort objects to sort Requests by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<RequestSort>>;
};

export type RequestProjectProjectsHasRequestAggregationSelection = {
  __typename?: "RequestProjectProjectsHasRequestAggregationSelection";
  count: Scalars["Int"];
  node?: Maybe<RequestProjectProjectsHasRequestNodeAggregateSelection>;
};

export type RequestProjectProjectsHasRequestNodeAggregateSelection = {
  __typename?: "RequestProjectProjectsHasRequestNodeAggregateSelection";
  igoProjectId: StringAggregateSelectionNonNullable;
  namespace: StringAggregateSelectionNonNullable;
};

export type RequestProjectsHasRequestAggregateInput = {
  AND?: InputMaybe<Array<RequestProjectsHasRequestAggregateInput>>;
  OR?: InputMaybe<Array<RequestProjectsHasRequestAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<RequestProjectsHasRequestNodeAggregationWhereInput>;
};

export type RequestProjectsHasRequestConnectFieldInput = {
  connect?: InputMaybe<Array<ProjectConnectInput>>;
  where?: InputMaybe<ProjectConnectWhere>;
};

export type RequestProjectsHasRequestConnection = {
  __typename?: "RequestProjectsHasRequestConnection";
  edges: Array<RequestProjectsHasRequestRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type RequestProjectsHasRequestConnectionSort = {
  node?: InputMaybe<ProjectSort>;
};

export type RequestProjectsHasRequestConnectionWhere = {
  AND?: InputMaybe<Array<RequestProjectsHasRequestConnectionWhere>>;
  OR?: InputMaybe<Array<RequestProjectsHasRequestConnectionWhere>>;
  node?: InputMaybe<ProjectWhere>;
  node_NOT?: InputMaybe<ProjectWhere>;
};

export type RequestProjectsHasRequestCreateFieldInput = {
  node: ProjectCreateInput;
};

export type RequestProjectsHasRequestDeleteFieldInput = {
  delete?: InputMaybe<ProjectDeleteInput>;
  where?: InputMaybe<RequestProjectsHasRequestConnectionWhere>;
};

export type RequestProjectsHasRequestDisconnectFieldInput = {
  disconnect?: InputMaybe<ProjectDisconnectInput>;
  where?: InputMaybe<RequestProjectsHasRequestConnectionWhere>;
};

export type RequestProjectsHasRequestFieldInput = {
  connect?: InputMaybe<Array<RequestProjectsHasRequestConnectFieldInput>>;
  create?: InputMaybe<Array<RequestProjectsHasRequestCreateFieldInput>>;
};

export type RequestProjectsHasRequestNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<RequestProjectsHasRequestNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<RequestProjectsHasRequestNodeAggregationWhereInput>>;
  igoProjectId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  igoProjectId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  igoProjectId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  igoProjectId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  igoProjectId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  igoProjectId_EQUAL?: InputMaybe<Scalars["String"]>;
  igoProjectId_GT?: InputMaybe<Scalars["Int"]>;
  igoProjectId_GTE?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LT?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LTE?: InputMaybe<Scalars["Int"]>;
  igoProjectId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  igoProjectId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  igoProjectId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  igoProjectId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  igoProjectId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  namespace_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  namespace_EQUAL?: InputMaybe<Scalars["String"]>;
  namespace_GT?: InputMaybe<Scalars["Int"]>;
  namespace_GTE?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  namespace_LT?: InputMaybe<Scalars["Int"]>;
  namespace_LTE?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
};

export type RequestProjectsHasRequestRelationship = {
  __typename?: "RequestProjectsHasRequestRelationship";
  cursor: Scalars["String"];
  node: Project;
};

export type RequestProjectsHasRequestUpdateConnectionInput = {
  node?: InputMaybe<ProjectUpdateInput>;
};

export type RequestProjectsHasRequestUpdateFieldInput = {
  connect?: InputMaybe<Array<RequestProjectsHasRequestConnectFieldInput>>;
  create?: InputMaybe<Array<RequestProjectsHasRequestCreateFieldInput>>;
  delete?: InputMaybe<Array<RequestProjectsHasRequestDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<RequestProjectsHasRequestDisconnectFieldInput>>;
  update?: InputMaybe<RequestProjectsHasRequestUpdateConnectionInput>;
  where?: InputMaybe<RequestProjectsHasRequestConnectionWhere>;
};

export type RequestRelationInput = {
  hasSampleSamples?: InputMaybe<Array<RequestHasSampleSamplesCreateFieldInput>>;
  projectsHasRequest?: InputMaybe<
    Array<RequestProjectsHasRequestCreateFieldInput>
  >;
};

export type RequestSampleHasSampleSamplesAggregationSelection = {
  __typename?: "RequestSampleHasSampleSamplesAggregationSelection";
  count: Scalars["Int"];
  node?: Maybe<RequestSampleHasSampleSamplesNodeAggregateSelection>;
};

export type RequestSampleHasSampleSamplesNodeAggregateSelection = {
  __typename?: "RequestSampleHasSampleSamplesNodeAggregateSelection";
  datasource: StringAggregateSelectionNonNullable;
  sampleCategory: StringAggregateSelectionNonNullable;
  sampleClass: StringAggregateSelectionNonNullable;
  smileSampleId: StringAggregateSelectionNonNullable;
};

/** Fields to sort Requests by. The order in which sorts are applied is not guaranteed when specifying many fields in one RequestSort object. */
export type RequestSort = {
  bicAnalysis?: InputMaybe<SortDirection>;
  dataAccessEmails?: InputMaybe<SortDirection>;
  dataAnalystEmail?: InputMaybe<SortDirection>;
  dataAnalystName?: InputMaybe<SortDirection>;
  genePanel?: InputMaybe<SortDirection>;
  igoProjectId?: InputMaybe<SortDirection>;
  igoRequestId?: InputMaybe<SortDirection>;
  investigatorEmail?: InputMaybe<SortDirection>;
  investigatorName?: InputMaybe<SortDirection>;
  isCmoRequest?: InputMaybe<SortDirection>;
  labHeadEmail?: InputMaybe<SortDirection>;
  labHeadName?: InputMaybe<SortDirection>;
  libraryType?: InputMaybe<SortDirection>;
  namespace?: InputMaybe<SortDirection>;
  otherContactEmails?: InputMaybe<SortDirection>;
  piEmail?: InputMaybe<SortDirection>;
  projectManagerName?: InputMaybe<SortDirection>;
  qcAccessEmails?: InputMaybe<SortDirection>;
  requestJson?: InputMaybe<SortDirection>;
  revisable?: InputMaybe<SortDirection>;
  smileRequestId?: InputMaybe<SortDirection>;
  strand?: InputMaybe<SortDirection>;
};

export type RequestUpdateInput = {
  bicAnalysis?: InputMaybe<Scalars["Boolean"]>;
  dataAccessEmails?: InputMaybe<Scalars["String"]>;
  dataAnalystEmail?: InputMaybe<Scalars["String"]>;
  dataAnalystName?: InputMaybe<Scalars["String"]>;
  genePanel?: InputMaybe<Scalars["String"]>;
  hasSampleSamples?: InputMaybe<Array<RequestHasSampleSamplesUpdateFieldInput>>;
  igoProjectId?: InputMaybe<Scalars["String"]>;
  igoRequestId?: InputMaybe<Scalars["String"]>;
  investigatorEmail?: InputMaybe<Scalars["String"]>;
  investigatorName?: InputMaybe<Scalars["String"]>;
  isCmoRequest?: InputMaybe<Scalars["Boolean"]>;
  labHeadEmail?: InputMaybe<Scalars["String"]>;
  labHeadName?: InputMaybe<Scalars["String"]>;
  libraryType?: InputMaybe<Scalars["String"]>;
  namespace?: InputMaybe<Scalars["String"]>;
  otherContactEmails?: InputMaybe<Scalars["String"]>;
  piEmail?: InputMaybe<Scalars["String"]>;
  pooledNormals?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  pooledNormals_POP?: InputMaybe<Scalars["Int"]>;
  pooledNormals_PUSH?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  projectManagerName?: InputMaybe<Scalars["String"]>;
  projectsHasRequest?: InputMaybe<
    Array<RequestProjectsHasRequestUpdateFieldInput>
  >;
  qcAccessEmails?: InputMaybe<Scalars["String"]>;
  requestJson?: InputMaybe<Scalars["String"]>;
  revisable?: InputMaybe<Scalars["Boolean"]>;
  smileRequestId?: InputMaybe<Scalars["String"]>;
  strand?: InputMaybe<Scalars["String"]>;
};

export type RequestWhere = {
  AND?: InputMaybe<Array<RequestWhere>>;
  OR?: InputMaybe<Array<RequestWhere>>;
  bicAnalysis?: InputMaybe<Scalars["Boolean"]>;
  bicAnalysis_NOT?: InputMaybe<Scalars["Boolean"]>;
  dataAccessEmails?: InputMaybe<Scalars["String"]>;
  dataAccessEmails_CONTAINS?: InputMaybe<Scalars["String"]>;
  dataAccessEmails_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  dataAccessEmails_IN?: InputMaybe<Array<Scalars["String"]>>;
  dataAccessEmails_NOT?: InputMaybe<Scalars["String"]>;
  dataAccessEmails_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  dataAccessEmails_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  dataAccessEmails_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  dataAccessEmails_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  dataAccessEmails_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  dataAnalystEmail?: InputMaybe<Scalars["String"]>;
  dataAnalystEmail_CONTAINS?: InputMaybe<Scalars["String"]>;
  dataAnalystEmail_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  dataAnalystEmail_IN?: InputMaybe<Array<Scalars["String"]>>;
  dataAnalystEmail_NOT?: InputMaybe<Scalars["String"]>;
  dataAnalystEmail_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  dataAnalystEmail_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  dataAnalystEmail_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  dataAnalystEmail_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  dataAnalystEmail_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  dataAnalystName?: InputMaybe<Scalars["String"]>;
  dataAnalystName_CONTAINS?: InputMaybe<Scalars["String"]>;
  dataAnalystName_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  dataAnalystName_IN?: InputMaybe<Array<Scalars["String"]>>;
  dataAnalystName_NOT?: InputMaybe<Scalars["String"]>;
  dataAnalystName_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  dataAnalystName_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  dataAnalystName_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  dataAnalystName_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  dataAnalystName_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  genePanel?: InputMaybe<Scalars["String"]>;
  genePanel_CONTAINS?: InputMaybe<Scalars["String"]>;
  genePanel_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  genePanel_IN?: InputMaybe<Array<Scalars["String"]>>;
  genePanel_NOT?: InputMaybe<Scalars["String"]>;
  genePanel_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  genePanel_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  genePanel_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  genePanel_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  genePanel_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  hasSampleSamplesAggregate?: InputMaybe<RequestHasSampleSamplesAggregateInput>;
  hasSampleSamplesConnection_ALL?: InputMaybe<RequestHasSampleSamplesConnectionWhere>;
  hasSampleSamplesConnection_NONE?: InputMaybe<RequestHasSampleSamplesConnectionWhere>;
  hasSampleSamplesConnection_SINGLE?: InputMaybe<RequestHasSampleSamplesConnectionWhere>;
  hasSampleSamplesConnection_SOME?: InputMaybe<RequestHasSampleSamplesConnectionWhere>;
  /** Return Requests where all of the related Samples match this filter */
  hasSampleSamples_ALL?: InputMaybe<SampleWhere>;
  /** Return Requests where none of the related Samples match this filter */
  hasSampleSamples_NONE?: InputMaybe<SampleWhere>;
  /** Return Requests where one of the related Samples match this filter */
  hasSampleSamples_SINGLE?: InputMaybe<SampleWhere>;
  /** Return Requests where some of the related Samples match this filter */
  hasSampleSamples_SOME?: InputMaybe<SampleWhere>;
  igoProjectId?: InputMaybe<Scalars["String"]>;
  igoProjectId_CONTAINS?: InputMaybe<Scalars["String"]>;
  igoProjectId_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  igoProjectId_IN?: InputMaybe<Array<Scalars["String"]>>;
  igoProjectId_NOT?: InputMaybe<Scalars["String"]>;
  igoProjectId_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  igoProjectId_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  igoProjectId_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  igoProjectId_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  igoProjectId_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  igoRequestId?: InputMaybe<Scalars["String"]>;
  igoRequestId_CONTAINS?: InputMaybe<Scalars["String"]>;
  igoRequestId_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  igoRequestId_IN?: InputMaybe<Array<Scalars["String"]>>;
  igoRequestId_NOT?: InputMaybe<Scalars["String"]>;
  igoRequestId_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  igoRequestId_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  igoRequestId_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  igoRequestId_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  igoRequestId_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  investigatorEmail?: InputMaybe<Scalars["String"]>;
  investigatorEmail_CONTAINS?: InputMaybe<Scalars["String"]>;
  investigatorEmail_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  investigatorEmail_IN?: InputMaybe<Array<Scalars["String"]>>;
  investigatorEmail_NOT?: InputMaybe<Scalars["String"]>;
  investigatorEmail_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  investigatorEmail_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  investigatorEmail_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  investigatorEmail_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  investigatorEmail_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  investigatorName?: InputMaybe<Scalars["String"]>;
  investigatorName_CONTAINS?: InputMaybe<Scalars["String"]>;
  investigatorName_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  investigatorName_IN?: InputMaybe<Array<Scalars["String"]>>;
  investigatorName_NOT?: InputMaybe<Scalars["String"]>;
  investigatorName_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  investigatorName_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  investigatorName_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  investigatorName_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  investigatorName_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  isCmoRequest?: InputMaybe<Scalars["Boolean"]>;
  isCmoRequest_NOT?: InputMaybe<Scalars["Boolean"]>;
  labHeadEmail?: InputMaybe<Scalars["String"]>;
  labHeadEmail_CONTAINS?: InputMaybe<Scalars["String"]>;
  labHeadEmail_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  labHeadEmail_IN?: InputMaybe<Array<Scalars["String"]>>;
  labHeadEmail_NOT?: InputMaybe<Scalars["String"]>;
  labHeadEmail_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  labHeadEmail_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  labHeadEmail_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  labHeadEmail_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  labHeadEmail_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  labHeadName?: InputMaybe<Scalars["String"]>;
  labHeadName_CONTAINS?: InputMaybe<Scalars["String"]>;
  labHeadName_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  labHeadName_IN?: InputMaybe<Array<Scalars["String"]>>;
  labHeadName_NOT?: InputMaybe<Scalars["String"]>;
  labHeadName_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  labHeadName_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  labHeadName_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  labHeadName_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  labHeadName_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  libraryType?: InputMaybe<Scalars["String"]>;
  libraryType_CONTAINS?: InputMaybe<Scalars["String"]>;
  libraryType_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  libraryType_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  libraryType_NOT?: InputMaybe<Scalars["String"]>;
  libraryType_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  libraryType_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  libraryType_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  libraryType_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  libraryType_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  namespace?: InputMaybe<Scalars["String"]>;
  namespace_CONTAINS?: InputMaybe<Scalars["String"]>;
  namespace_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  namespace_IN?: InputMaybe<Array<Scalars["String"]>>;
  namespace_NOT?: InputMaybe<Scalars["String"]>;
  namespace_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  namespace_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  namespace_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  namespace_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  namespace_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  otherContactEmails?: InputMaybe<Scalars["String"]>;
  otherContactEmails_CONTAINS?: InputMaybe<Scalars["String"]>;
  otherContactEmails_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  otherContactEmails_IN?: InputMaybe<Array<Scalars["String"]>>;
  otherContactEmails_NOT?: InputMaybe<Scalars["String"]>;
  otherContactEmails_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  otherContactEmails_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  otherContactEmails_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  otherContactEmails_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  otherContactEmails_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  piEmail?: InputMaybe<Scalars["String"]>;
  piEmail_CONTAINS?: InputMaybe<Scalars["String"]>;
  piEmail_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  piEmail_IN?: InputMaybe<Array<Scalars["String"]>>;
  piEmail_NOT?: InputMaybe<Scalars["String"]>;
  piEmail_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  piEmail_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  piEmail_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  piEmail_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  piEmail_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  pooledNormals?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  pooledNormals_INCLUDES?: InputMaybe<Scalars["String"]>;
  pooledNormals_NOT?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  pooledNormals_NOT_INCLUDES?: InputMaybe<Scalars["String"]>;
  projectManagerName?: InputMaybe<Scalars["String"]>;
  projectManagerName_CONTAINS?: InputMaybe<Scalars["String"]>;
  projectManagerName_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  projectManagerName_IN?: InputMaybe<Array<Scalars["String"]>>;
  projectManagerName_NOT?: InputMaybe<Scalars["String"]>;
  projectManagerName_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  projectManagerName_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  projectManagerName_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  projectManagerName_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  projectManagerName_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  projectsHasRequestAggregate?: InputMaybe<RequestProjectsHasRequestAggregateInput>;
  projectsHasRequestConnection_ALL?: InputMaybe<RequestProjectsHasRequestConnectionWhere>;
  projectsHasRequestConnection_NONE?: InputMaybe<RequestProjectsHasRequestConnectionWhere>;
  projectsHasRequestConnection_SINGLE?: InputMaybe<RequestProjectsHasRequestConnectionWhere>;
  projectsHasRequestConnection_SOME?: InputMaybe<RequestProjectsHasRequestConnectionWhere>;
  /** Return Requests where all of the related Projects match this filter */
  projectsHasRequest_ALL?: InputMaybe<ProjectWhere>;
  /** Return Requests where none of the related Projects match this filter */
  projectsHasRequest_NONE?: InputMaybe<ProjectWhere>;
  /** Return Requests where one of the related Projects match this filter */
  projectsHasRequest_SINGLE?: InputMaybe<ProjectWhere>;
  /** Return Requests where some of the related Projects match this filter */
  projectsHasRequest_SOME?: InputMaybe<ProjectWhere>;
  qcAccessEmails?: InputMaybe<Scalars["String"]>;
  qcAccessEmails_CONTAINS?: InputMaybe<Scalars["String"]>;
  qcAccessEmails_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  qcAccessEmails_IN?: InputMaybe<Array<Scalars["String"]>>;
  qcAccessEmails_NOT?: InputMaybe<Scalars["String"]>;
  qcAccessEmails_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  qcAccessEmails_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  qcAccessEmails_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  qcAccessEmails_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  qcAccessEmails_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  requestJson?: InputMaybe<Scalars["String"]>;
  requestJson_CONTAINS?: InputMaybe<Scalars["String"]>;
  requestJson_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  requestJson_IN?: InputMaybe<Array<Scalars["String"]>>;
  requestJson_NOT?: InputMaybe<Scalars["String"]>;
  requestJson_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  requestJson_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  requestJson_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  requestJson_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  requestJson_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  revisable?: InputMaybe<Scalars["Boolean"]>;
  revisable_NOT?: InputMaybe<Scalars["Boolean"]>;
  smileRequestId?: InputMaybe<Scalars["String"]>;
  smileRequestId_CONTAINS?: InputMaybe<Scalars["String"]>;
  smileRequestId_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  smileRequestId_IN?: InputMaybe<Array<Scalars["String"]>>;
  smileRequestId_NOT?: InputMaybe<Scalars["String"]>;
  smileRequestId_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  smileRequestId_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  smileRequestId_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  smileRequestId_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  smileRequestId_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  strand?: InputMaybe<Scalars["String"]>;
  strand_CONTAINS?: InputMaybe<Scalars["String"]>;
  strand_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  strand_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  strand_NOT?: InputMaybe<Scalars["String"]>;
  strand_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  strand_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  strand_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  strand_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  strand_STARTS_WITH?: InputMaybe<Scalars["String"]>;
};

export type RequestsConnection = {
  __typename?: "RequestsConnection";
  edges: Array<RequestEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type Sample = {
  __typename?: "Sample";
  datasource: Scalars["String"];
  hasMetadataSampleMetadata: Array<SampleMetadata>;
  hasMetadataSampleMetadataAggregate?: Maybe<SampleSampleMetadataHasMetadataSampleMetadataAggregationSelection>;
  hasMetadataSampleMetadataConnection: SampleHasMetadataSampleMetadataConnection;
  patientsHasSample: Array<Patient>;
  patientsHasSampleAggregate?: Maybe<SamplePatientPatientsHasSampleAggregationSelection>;
  patientsHasSampleConnection: SamplePatientsHasSampleConnection;
  requestsHasSample: Array<Request>;
  requestsHasSampleAggregate?: Maybe<SampleRequestRequestsHasSampleAggregationSelection>;
  requestsHasSampleConnection: SampleRequestsHasSampleConnection;
  revisable: Scalars["Boolean"];
  sampleAliasesIsAlias: Array<SampleAlias>;
  sampleAliasesIsAliasAggregate?: Maybe<SampleSampleAliasSampleAliasesIsAliasAggregationSelection>;
  sampleAliasesIsAliasConnection: SampleSampleAliasesIsAliasConnection;
  sampleCategory: Scalars["String"];
  sampleClass: Scalars["String"];
  smileSampleId: Scalars["String"];
};

export type SampleHasMetadataSampleMetadataArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  options?: InputMaybe<SampleMetadataOptions>;
  where?: InputMaybe<SampleMetadataWhere>;
};

export type SampleHasMetadataSampleMetadataAggregateArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  where?: InputMaybe<SampleMetadataWhere>;
};

export type SampleHasMetadataSampleMetadataConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  directed?: InputMaybe<Scalars["Boolean"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<SampleHasMetadataSampleMetadataConnectionSort>>;
  where?: InputMaybe<SampleHasMetadataSampleMetadataConnectionWhere>;
};

export type SamplePatientsHasSampleArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  options?: InputMaybe<PatientOptions>;
  where?: InputMaybe<PatientWhere>;
};

export type SamplePatientsHasSampleAggregateArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  where?: InputMaybe<PatientWhere>;
};

export type SamplePatientsHasSampleConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  directed?: InputMaybe<Scalars["Boolean"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<SamplePatientsHasSampleConnectionSort>>;
  where?: InputMaybe<SamplePatientsHasSampleConnectionWhere>;
};

export type SampleRequestsHasSampleArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  options?: InputMaybe<RequestOptions>;
  where?: InputMaybe<RequestWhere>;
};

export type SampleRequestsHasSampleAggregateArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  where?: InputMaybe<RequestWhere>;
};

export type SampleRequestsHasSampleConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  directed?: InputMaybe<Scalars["Boolean"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<SampleRequestsHasSampleConnectionSort>>;
  where?: InputMaybe<SampleRequestsHasSampleConnectionWhere>;
};

export type SampleSampleAliasesIsAliasArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  options?: InputMaybe<SampleAliasOptions>;
  where?: InputMaybe<SampleAliasWhere>;
};

export type SampleSampleAliasesIsAliasAggregateArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  where?: InputMaybe<SampleAliasWhere>;
};

export type SampleSampleAliasesIsAliasConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  directed?: InputMaybe<Scalars["Boolean"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<SampleSampleAliasesIsAliasConnectionSort>>;
  where?: InputMaybe<SampleSampleAliasesIsAliasConnectionWhere>;
};

export type SampleAggregateSelection = {
  __typename?: "SampleAggregateSelection";
  count: Scalars["Int"];
  datasource: StringAggregateSelectionNonNullable;
  sampleCategory: StringAggregateSelectionNonNullable;
  sampleClass: StringAggregateSelectionNonNullable;
  smileSampleId: StringAggregateSelectionNonNullable;
};

export type SampleAlias = {
  __typename?: "SampleAlias";
  isAliasSamples: Array<Sample>;
  isAliasSamplesAggregate?: Maybe<SampleAliasSampleIsAliasSamplesAggregationSelection>;
  isAliasSamplesConnection: SampleAliasIsAliasSamplesConnection;
  namespace: Scalars["String"];
  value: Scalars["String"];
};

export type SampleAliasIsAliasSamplesArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  options?: InputMaybe<SampleOptions>;
  where?: InputMaybe<SampleWhere>;
};

export type SampleAliasIsAliasSamplesAggregateArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  where?: InputMaybe<SampleWhere>;
};

export type SampleAliasIsAliasSamplesConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  directed?: InputMaybe<Scalars["Boolean"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<SampleAliasIsAliasSamplesConnectionSort>>;
  where?: InputMaybe<SampleAliasIsAliasSamplesConnectionWhere>;
};

export type SampleAliasAggregateSelection = {
  __typename?: "SampleAliasAggregateSelection";
  count: Scalars["Int"];
  namespace: StringAggregateSelectionNonNullable;
  value: StringAggregateSelectionNonNullable;
};

export type SampleAliasConnectInput = {
  isAliasSamples?: InputMaybe<
    Array<SampleAliasIsAliasSamplesConnectFieldInput>
  >;
};

export type SampleAliasConnectWhere = {
  node: SampleAliasWhere;
};

export type SampleAliasCreateInput = {
  isAliasSamples?: InputMaybe<SampleAliasIsAliasSamplesFieldInput>;
  namespace: Scalars["String"];
  value: Scalars["String"];
};

export type SampleAliasDeleteInput = {
  isAliasSamples?: InputMaybe<Array<SampleAliasIsAliasSamplesDeleteFieldInput>>;
};

export type SampleAliasDisconnectInput = {
  isAliasSamples?: InputMaybe<
    Array<SampleAliasIsAliasSamplesDisconnectFieldInput>
  >;
};

export type SampleAliasEdge = {
  __typename?: "SampleAliasEdge";
  cursor: Scalars["String"];
  node: SampleAlias;
};

export type SampleAliasIsAliasSamplesAggregateInput = {
  AND?: InputMaybe<Array<SampleAliasIsAliasSamplesAggregateInput>>;
  OR?: InputMaybe<Array<SampleAliasIsAliasSamplesAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<SampleAliasIsAliasSamplesNodeAggregationWhereInput>;
};

export type SampleAliasIsAliasSamplesConnectFieldInput = {
  connect?: InputMaybe<Array<SampleConnectInput>>;
  where?: InputMaybe<SampleConnectWhere>;
};

export type SampleAliasIsAliasSamplesConnection = {
  __typename?: "SampleAliasIsAliasSamplesConnection";
  edges: Array<SampleAliasIsAliasSamplesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type SampleAliasIsAliasSamplesConnectionSort = {
  node?: InputMaybe<SampleSort>;
};

export type SampleAliasIsAliasSamplesConnectionWhere = {
  AND?: InputMaybe<Array<SampleAliasIsAliasSamplesConnectionWhere>>;
  OR?: InputMaybe<Array<SampleAliasIsAliasSamplesConnectionWhere>>;
  node?: InputMaybe<SampleWhere>;
  node_NOT?: InputMaybe<SampleWhere>;
};

export type SampleAliasIsAliasSamplesCreateFieldInput = {
  node: SampleCreateInput;
};

export type SampleAliasIsAliasSamplesDeleteFieldInput = {
  delete?: InputMaybe<SampleDeleteInput>;
  where?: InputMaybe<SampleAliasIsAliasSamplesConnectionWhere>;
};

export type SampleAliasIsAliasSamplesDisconnectFieldInput = {
  disconnect?: InputMaybe<SampleDisconnectInput>;
  where?: InputMaybe<SampleAliasIsAliasSamplesConnectionWhere>;
};

export type SampleAliasIsAliasSamplesFieldInput = {
  connect?: InputMaybe<Array<SampleAliasIsAliasSamplesConnectFieldInput>>;
  create?: InputMaybe<Array<SampleAliasIsAliasSamplesCreateFieldInput>>;
};

export type SampleAliasIsAliasSamplesNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<SampleAliasIsAliasSamplesNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<SampleAliasIsAliasSamplesNodeAggregationWhereInput>>;
  datasource_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  datasource_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  datasource_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  datasource_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  datasource_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  datasource_EQUAL?: InputMaybe<Scalars["String"]>;
  datasource_GT?: InputMaybe<Scalars["Int"]>;
  datasource_GTE?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  datasource_LT?: InputMaybe<Scalars["Int"]>;
  datasource_LTE?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  sampleCategory_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  sampleCategory_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  sampleCategory_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  sampleCategory_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  sampleCategory_EQUAL?: InputMaybe<Scalars["String"]>;
  sampleCategory_GT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_GTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  sampleClass_EQUAL?: InputMaybe<Scalars["String"]>;
  sampleClass_GT?: InputMaybe<Scalars["Int"]>;
  sampleClass_GTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_LT?: InputMaybe<Scalars["Int"]>;
  sampleClass_LTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  smileSampleId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  smileSampleId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  smileSampleId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  smileSampleId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  smileSampleId_EQUAL?: InputMaybe<Scalars["String"]>;
  smileSampleId_GT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_GTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
};

export type SampleAliasIsAliasSamplesRelationship = {
  __typename?: "SampleAliasIsAliasSamplesRelationship";
  cursor: Scalars["String"];
  node: Sample;
};

export type SampleAliasIsAliasSamplesUpdateConnectionInput = {
  node?: InputMaybe<SampleUpdateInput>;
};

export type SampleAliasIsAliasSamplesUpdateFieldInput = {
  connect?: InputMaybe<Array<SampleAliasIsAliasSamplesConnectFieldInput>>;
  create?: InputMaybe<Array<SampleAliasIsAliasSamplesCreateFieldInput>>;
  delete?: InputMaybe<Array<SampleAliasIsAliasSamplesDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<SampleAliasIsAliasSamplesDisconnectFieldInput>>;
  update?: InputMaybe<SampleAliasIsAliasSamplesUpdateConnectionInput>;
  where?: InputMaybe<SampleAliasIsAliasSamplesConnectionWhere>;
};

export type SampleAliasOptions = {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more SampleAliasSort objects to sort SampleAliases by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<SampleAliasSort>>;
};

export type SampleAliasRelationInput = {
  isAliasSamples?: InputMaybe<Array<SampleAliasIsAliasSamplesCreateFieldInput>>;
};

export type SampleAliasSampleIsAliasSamplesAggregationSelection = {
  __typename?: "SampleAliasSampleIsAliasSamplesAggregationSelection";
  count: Scalars["Int"];
  node?: Maybe<SampleAliasSampleIsAliasSamplesNodeAggregateSelection>;
};

export type SampleAliasSampleIsAliasSamplesNodeAggregateSelection = {
  __typename?: "SampleAliasSampleIsAliasSamplesNodeAggregateSelection";
  datasource: StringAggregateSelectionNonNullable;
  sampleCategory: StringAggregateSelectionNonNullable;
  sampleClass: StringAggregateSelectionNonNullable;
  smileSampleId: StringAggregateSelectionNonNullable;
};

/** Fields to sort SampleAliases by. The order in which sorts are applied is not guaranteed when specifying many fields in one SampleAliasSort object. */
export type SampleAliasSort = {
  namespace?: InputMaybe<SortDirection>;
  value?: InputMaybe<SortDirection>;
};

export type SampleAliasUpdateInput = {
  isAliasSamples?: InputMaybe<Array<SampleAliasIsAliasSamplesUpdateFieldInput>>;
  namespace?: InputMaybe<Scalars["String"]>;
  value?: InputMaybe<Scalars["String"]>;
};

export type SampleAliasWhere = {
  AND?: InputMaybe<Array<SampleAliasWhere>>;
  OR?: InputMaybe<Array<SampleAliasWhere>>;
  isAliasSamplesAggregate?: InputMaybe<SampleAliasIsAliasSamplesAggregateInput>;
  isAliasSamplesConnection_ALL?: InputMaybe<SampleAliasIsAliasSamplesConnectionWhere>;
  isAliasSamplesConnection_NONE?: InputMaybe<SampleAliasIsAliasSamplesConnectionWhere>;
  isAliasSamplesConnection_SINGLE?: InputMaybe<SampleAliasIsAliasSamplesConnectionWhere>;
  isAliasSamplesConnection_SOME?: InputMaybe<SampleAliasIsAliasSamplesConnectionWhere>;
  /** Return SampleAliases where all of the related Samples match this filter */
  isAliasSamples_ALL?: InputMaybe<SampleWhere>;
  /** Return SampleAliases where none of the related Samples match this filter */
  isAliasSamples_NONE?: InputMaybe<SampleWhere>;
  /** Return SampleAliases where one of the related Samples match this filter */
  isAliasSamples_SINGLE?: InputMaybe<SampleWhere>;
  /** Return SampleAliases where some of the related Samples match this filter */
  isAliasSamples_SOME?: InputMaybe<SampleWhere>;
  namespace?: InputMaybe<Scalars["String"]>;
  namespace_CONTAINS?: InputMaybe<Scalars["String"]>;
  namespace_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  namespace_IN?: InputMaybe<Array<Scalars["String"]>>;
  namespace_NOT?: InputMaybe<Scalars["String"]>;
  namespace_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  namespace_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  namespace_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  namespace_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  namespace_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  value?: InputMaybe<Scalars["String"]>;
  value_CONTAINS?: InputMaybe<Scalars["String"]>;
  value_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  value_IN?: InputMaybe<Array<Scalars["String"]>>;
  value_NOT?: InputMaybe<Scalars["String"]>;
  value_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  value_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  value_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  value_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  value_STARTS_WITH?: InputMaybe<Scalars["String"]>;
};

export type SampleAliasesConnection = {
  __typename?: "SampleAliasesConnection";
  edges: Array<SampleAliasEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type SampleConnectInput = {
  hasMetadataSampleMetadata?: InputMaybe<
    Array<SampleHasMetadataSampleMetadataConnectFieldInput>
  >;
  patientsHasSample?: InputMaybe<
    Array<SamplePatientsHasSampleConnectFieldInput>
  >;
  requestsHasSample?: InputMaybe<
    Array<SampleRequestsHasSampleConnectFieldInput>
  >;
  sampleAliasesIsAlias?: InputMaybe<
    Array<SampleSampleAliasesIsAliasConnectFieldInput>
  >;
};

export type SampleConnectWhere = {
  node: SampleWhere;
};

export type SampleCreateInput = {
  datasource: Scalars["String"];
  hasMetadataSampleMetadata?: InputMaybe<SampleHasMetadataSampleMetadataFieldInput>;
  patientsHasSample?: InputMaybe<SamplePatientsHasSampleFieldInput>;
  requestsHasSample?: InputMaybe<SampleRequestsHasSampleFieldInput>;
  revisable: Scalars["Boolean"];
  sampleAliasesIsAlias?: InputMaybe<SampleSampleAliasesIsAliasFieldInput>;
  sampleCategory: Scalars["String"];
  sampleClass: Scalars["String"];
  smileSampleId: Scalars["String"];
};

export type SampleDeleteInput = {
  hasMetadataSampleMetadata?: InputMaybe<
    Array<SampleHasMetadataSampleMetadataDeleteFieldInput>
  >;
  patientsHasSample?: InputMaybe<
    Array<SamplePatientsHasSampleDeleteFieldInput>
  >;
  requestsHasSample?: InputMaybe<
    Array<SampleRequestsHasSampleDeleteFieldInput>
  >;
  sampleAliasesIsAlias?: InputMaybe<
    Array<SampleSampleAliasesIsAliasDeleteFieldInput>
  >;
};

export type SampleDisconnectInput = {
  hasMetadataSampleMetadata?: InputMaybe<
    Array<SampleHasMetadataSampleMetadataDisconnectFieldInput>
  >;
  patientsHasSample?: InputMaybe<
    Array<SamplePatientsHasSampleDisconnectFieldInput>
  >;
  requestsHasSample?: InputMaybe<
    Array<SampleRequestsHasSampleDisconnectFieldInput>
  >;
  sampleAliasesIsAlias?: InputMaybe<
    Array<SampleSampleAliasesIsAliasDisconnectFieldInput>
  >;
};

export type SampleEdge = {
  __typename?: "SampleEdge";
  cursor: Scalars["String"];
  node: Sample;
};

export type SampleHasMetadataSampleMetadataAggregateInput = {
  AND?: InputMaybe<Array<SampleHasMetadataSampleMetadataAggregateInput>>;
  OR?: InputMaybe<Array<SampleHasMetadataSampleMetadataAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<SampleHasMetadataSampleMetadataNodeAggregationWhereInput>;
};

export type SampleHasMetadataSampleMetadataConnectFieldInput = {
  connect?: InputMaybe<Array<SampleMetadataConnectInput>>;
  where?: InputMaybe<SampleMetadataConnectWhere>;
};

export type SampleHasMetadataSampleMetadataConnection = {
  __typename?: "SampleHasMetadataSampleMetadataConnection";
  edges: Array<SampleHasMetadataSampleMetadataRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type SampleHasMetadataSampleMetadataConnectionSort = {
  node?: InputMaybe<SampleMetadataSort>;
};

export type SampleHasMetadataSampleMetadataConnectionWhere = {
  AND?: InputMaybe<Array<SampleHasMetadataSampleMetadataConnectionWhere>>;
  OR?: InputMaybe<Array<SampleHasMetadataSampleMetadataConnectionWhere>>;
  node?: InputMaybe<SampleMetadataWhere>;
  node_NOT?: InputMaybe<SampleMetadataWhere>;
};

export type SampleHasMetadataSampleMetadataCreateFieldInput = {
  node: SampleMetadataCreateInput;
};

export type SampleHasMetadataSampleMetadataDeleteFieldInput = {
  delete?: InputMaybe<SampleMetadataDeleteInput>;
  where?: InputMaybe<SampleHasMetadataSampleMetadataConnectionWhere>;
};

export type SampleHasMetadataSampleMetadataDisconnectFieldInput = {
  disconnect?: InputMaybe<SampleMetadataDisconnectInput>;
  where?: InputMaybe<SampleHasMetadataSampleMetadataConnectionWhere>;
};

export type SampleHasMetadataSampleMetadataFieldInput = {
  connect?: InputMaybe<Array<SampleHasMetadataSampleMetadataConnectFieldInput>>;
  create?: InputMaybe<Array<SampleHasMetadataSampleMetadataCreateFieldInput>>;
};

export type SampleHasMetadataSampleMetadataNodeAggregationWhereInput = {
  AND?: InputMaybe<
    Array<SampleHasMetadataSampleMetadataNodeAggregationWhereInput>
  >;
  OR?: InputMaybe<
    Array<SampleHasMetadataSampleMetadataNodeAggregationWhereInput>
  >;
  additionalProperties_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  additionalProperties_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  additionalProperties_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  additionalProperties_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  additionalProperties_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  additionalProperties_EQUAL?: InputMaybe<Scalars["String"]>;
  additionalProperties_GT?: InputMaybe<Scalars["Int"]>;
  additionalProperties_GTE?: InputMaybe<Scalars["Int"]>;
  additionalProperties_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  additionalProperties_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  additionalProperties_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  additionalProperties_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  additionalProperties_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  additionalProperties_LT?: InputMaybe<Scalars["Int"]>;
  additionalProperties_LTE?: InputMaybe<Scalars["Int"]>;
  additionalProperties_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  additionalProperties_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  additionalProperties_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  additionalProperties_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  additionalProperties_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  baitSet_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  baitSet_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  baitSet_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  baitSet_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  baitSet_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  baitSet_EQUAL?: InputMaybe<Scalars["String"]>;
  baitSet_GT?: InputMaybe<Scalars["Int"]>;
  baitSet_GTE?: InputMaybe<Scalars["Int"]>;
  baitSet_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  baitSet_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  baitSet_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  baitSet_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  baitSet_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  baitSet_LT?: InputMaybe<Scalars["Int"]>;
  baitSet_LTE?: InputMaybe<Scalars["Int"]>;
  baitSet_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  baitSet_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  baitSet_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  baitSet_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  baitSet_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  cfDNA2dBarcode_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  cfDNA2dBarcode_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  cfDNA2dBarcode_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  cfDNA2dBarcode_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  cfDNA2dBarcode_EQUAL?: InputMaybe<Scalars["String"]>;
  cfDNA2dBarcode_GT?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_GTE?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_LT?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_LTE?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  cmoInfoIgoId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  cmoInfoIgoId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  cmoInfoIgoId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  cmoInfoIgoId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  cmoInfoIgoId_EQUAL?: InputMaybe<Scalars["String"]>;
  cmoInfoIgoId_GT?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_GTE?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_LT?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_LTE?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  cmoPatientId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  cmoPatientId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  cmoPatientId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  cmoPatientId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  cmoPatientId_EQUAL?: InputMaybe<Scalars["String"]>;
  cmoPatientId_GT?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_GTE?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_LT?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_LTE?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  cmoSampleIdFields_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  cmoSampleIdFields_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  cmoSampleIdFields_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  cmoSampleIdFields_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  cmoSampleIdFields_EQUAL?: InputMaybe<Scalars["String"]>;
  cmoSampleIdFields_GT?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_GTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_LT?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_LTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  cmoSampleName_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  cmoSampleName_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  cmoSampleName_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  cmoSampleName_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  cmoSampleName_EQUAL?: InputMaybe<Scalars["String"]>;
  cmoSampleName_GT?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_GTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_LT?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_LTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  collectionYear_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  collectionYear_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  collectionYear_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  collectionYear_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  collectionYear_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  collectionYear_EQUAL?: InputMaybe<Scalars["String"]>;
  collectionYear_GT?: InputMaybe<Scalars["Int"]>;
  collectionYear_GTE?: InputMaybe<Scalars["Int"]>;
  collectionYear_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  collectionYear_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  collectionYear_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  collectionYear_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  collectionYear_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  collectionYear_LT?: InputMaybe<Scalars["Int"]>;
  collectionYear_LTE?: InputMaybe<Scalars["Int"]>;
  collectionYear_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  collectionYear_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  collectionYear_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  collectionYear_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  collectionYear_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  genePanel_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  genePanel_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  genePanel_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  genePanel_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  genePanel_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  genePanel_EQUAL?: InputMaybe<Scalars["String"]>;
  genePanel_GT?: InputMaybe<Scalars["Int"]>;
  genePanel_GTE?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  genePanel_LT?: InputMaybe<Scalars["Int"]>;
  genePanel_LTE?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  igoRequestId_EQUAL?: InputMaybe<Scalars["String"]>;
  igoRequestId_GT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_GTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  importDate_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  importDate_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  importDate_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  importDate_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  importDate_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  importDate_EQUAL?: InputMaybe<Scalars["String"]>;
  importDate_GT?: InputMaybe<Scalars["Int"]>;
  importDate_GTE?: InputMaybe<Scalars["Int"]>;
  importDate_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  importDate_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  importDate_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  importDate_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  importDate_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  importDate_LT?: InputMaybe<Scalars["Int"]>;
  importDate_LTE?: InputMaybe<Scalars["Int"]>;
  importDate_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  importDate_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  importDate_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  importDate_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  importDate_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  investigatorSampleId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  investigatorSampleId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  investigatorSampleId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  investigatorSampleId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  investigatorSampleId_EQUAL?: InputMaybe<Scalars["String"]>;
  investigatorSampleId_GT?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_GTE?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_LT?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_LTE?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  libraries_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  libraries_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  libraries_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  libraries_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  libraries_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  libraries_EQUAL?: InputMaybe<Scalars["String"]>;
  libraries_GT?: InputMaybe<Scalars["Int"]>;
  libraries_GTE?: InputMaybe<Scalars["Int"]>;
  libraries_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  libraries_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  libraries_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  libraries_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  libraries_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  libraries_LT?: InputMaybe<Scalars["Int"]>;
  libraries_LTE?: InputMaybe<Scalars["Int"]>;
  libraries_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  libraries_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  libraries_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  libraries_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  libraries_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  oncotreeCode_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  oncotreeCode_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  oncotreeCode_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  oncotreeCode_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  oncotreeCode_EQUAL?: InputMaybe<Scalars["String"]>;
  oncotreeCode_GT?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_GTE?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_LT?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_LTE?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  preservation_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  preservation_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  preservation_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  preservation_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  preservation_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  preservation_EQUAL?: InputMaybe<Scalars["String"]>;
  preservation_GT?: InputMaybe<Scalars["Int"]>;
  preservation_GTE?: InputMaybe<Scalars["Int"]>;
  preservation_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  preservation_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  preservation_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  preservation_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  preservation_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  preservation_LT?: InputMaybe<Scalars["Int"]>;
  preservation_LTE?: InputMaybe<Scalars["Int"]>;
  preservation_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  preservation_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  preservation_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  preservation_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  preservation_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  primaryId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  primaryId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  primaryId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  primaryId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  primaryId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  primaryId_EQUAL?: InputMaybe<Scalars["String"]>;
  primaryId_GT?: InputMaybe<Scalars["Int"]>;
  primaryId_GTE?: InputMaybe<Scalars["Int"]>;
  primaryId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  primaryId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  primaryId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  primaryId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  primaryId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  primaryId_LT?: InputMaybe<Scalars["Int"]>;
  primaryId_LTE?: InputMaybe<Scalars["Int"]>;
  primaryId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  primaryId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  primaryId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  primaryId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  primaryId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  qcReports_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  qcReports_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  qcReports_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  qcReports_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  qcReports_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  qcReports_EQUAL?: InputMaybe<Scalars["String"]>;
  qcReports_GT?: InputMaybe<Scalars["Int"]>;
  qcReports_GTE?: InputMaybe<Scalars["Int"]>;
  qcReports_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  qcReports_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  qcReports_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  qcReports_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  qcReports_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  qcReports_LT?: InputMaybe<Scalars["Int"]>;
  qcReports_LTE?: InputMaybe<Scalars["Int"]>;
  qcReports_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  qcReports_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  qcReports_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  qcReports_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  qcReports_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  sampleClass_EQUAL?: InputMaybe<Scalars["String"]>;
  sampleClass_GT?: InputMaybe<Scalars["Int"]>;
  sampleClass_GTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_LT?: InputMaybe<Scalars["Int"]>;
  sampleClass_LTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleName_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  sampleName_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  sampleName_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  sampleName_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  sampleName_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  sampleName_EQUAL?: InputMaybe<Scalars["String"]>;
  sampleName_GT?: InputMaybe<Scalars["Int"]>;
  sampleName_GTE?: InputMaybe<Scalars["Int"]>;
  sampleName_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleName_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleName_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleName_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleName_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleName_LT?: InputMaybe<Scalars["Int"]>;
  sampleName_LTE?: InputMaybe<Scalars["Int"]>;
  sampleName_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleName_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleName_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleName_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleName_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  sampleOrigin_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  sampleOrigin_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  sampleOrigin_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  sampleOrigin_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  sampleOrigin_EQUAL?: InputMaybe<Scalars["String"]>;
  sampleOrigin_GT?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_GTE?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_LT?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_LTE?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleType_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  sampleType_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  sampleType_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  sampleType_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  sampleType_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  sampleType_EQUAL?: InputMaybe<Scalars["String"]>;
  sampleType_GT?: InputMaybe<Scalars["Int"]>;
  sampleType_GTE?: InputMaybe<Scalars["Int"]>;
  sampleType_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleType_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleType_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleType_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleType_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleType_LT?: InputMaybe<Scalars["Int"]>;
  sampleType_LTE?: InputMaybe<Scalars["Int"]>;
  sampleType_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleType_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleType_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleType_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleType_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  sex_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  sex_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  sex_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  sex_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  sex_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  sex_EQUAL?: InputMaybe<Scalars["String"]>;
  sex_GT?: InputMaybe<Scalars["Int"]>;
  sex_GTE?: InputMaybe<Scalars["Int"]>;
  sex_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sex_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  sex_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  sex_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  sex_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  sex_LT?: InputMaybe<Scalars["Int"]>;
  sex_LTE?: InputMaybe<Scalars["Int"]>;
  sex_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sex_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  sex_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  sex_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  sex_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  species_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  species_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  species_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  species_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  species_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  species_EQUAL?: InputMaybe<Scalars["String"]>;
  species_GT?: InputMaybe<Scalars["Int"]>;
  species_GTE?: InputMaybe<Scalars["Int"]>;
  species_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  species_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  species_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  species_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  species_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  species_LT?: InputMaybe<Scalars["Int"]>;
  species_LTE?: InputMaybe<Scalars["Int"]>;
  species_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  species_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  species_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  species_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  species_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  tissueLocation_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  tissueLocation_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  tissueLocation_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  tissueLocation_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  tissueLocation_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  tissueLocation_EQUAL?: InputMaybe<Scalars["String"]>;
  tissueLocation_GT?: InputMaybe<Scalars["Int"]>;
  tissueLocation_GTE?: InputMaybe<Scalars["Int"]>;
  tissueLocation_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  tissueLocation_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  tissueLocation_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  tissueLocation_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  tissueLocation_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  tissueLocation_LT?: InputMaybe<Scalars["Int"]>;
  tissueLocation_LTE?: InputMaybe<Scalars["Int"]>;
  tissueLocation_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  tissueLocation_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  tissueLocation_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  tissueLocation_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  tissueLocation_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  tubeId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  tubeId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  tubeId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  tubeId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  tubeId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  tubeId_EQUAL?: InputMaybe<Scalars["String"]>;
  tubeId_GT?: InputMaybe<Scalars["Int"]>;
  tubeId_GTE?: InputMaybe<Scalars["Int"]>;
  tubeId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  tubeId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  tubeId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  tubeId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  tubeId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  tubeId_LT?: InputMaybe<Scalars["Int"]>;
  tubeId_LTE?: InputMaybe<Scalars["Int"]>;
  tubeId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  tubeId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  tubeId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  tubeId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  tubeId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  tumorOrNormal_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  tumorOrNormal_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  tumorOrNormal_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  tumorOrNormal_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  tumorOrNormal_EQUAL?: InputMaybe<Scalars["String"]>;
  tumorOrNormal_GT?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_GTE?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_LT?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_LTE?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
};

export type SampleHasMetadataSampleMetadataRelationship = {
  __typename?: "SampleHasMetadataSampleMetadataRelationship";
  cursor: Scalars["String"];
  node: SampleMetadata;
};

export type SampleHasMetadataSampleMetadataUpdateConnectionInput = {
  node?: InputMaybe<SampleMetadataUpdateInput>;
};

export type SampleHasMetadataSampleMetadataUpdateFieldInput = {
  connect?: InputMaybe<Array<SampleHasMetadataSampleMetadataConnectFieldInput>>;
  create?: InputMaybe<Array<SampleHasMetadataSampleMetadataCreateFieldInput>>;
  delete?: InputMaybe<Array<SampleHasMetadataSampleMetadataDeleteFieldInput>>;
  disconnect?: InputMaybe<
    Array<SampleHasMetadataSampleMetadataDisconnectFieldInput>
  >;
  update?: InputMaybe<SampleHasMetadataSampleMetadataUpdateConnectionInput>;
  where?: InputMaybe<SampleHasMetadataSampleMetadataConnectionWhere>;
};

export type SampleMetadata = {
  __typename?: "SampleMetadata";
  additionalProperties: Scalars["String"];
  baitSet?: Maybe<Scalars["String"]>;
  cfDNA2dBarcode?: Maybe<Scalars["String"]>;
  cmoInfoIgoId?: Maybe<Scalars["String"]>;
  cmoPatientId?: Maybe<Scalars["String"]>;
  cmoSampleIdFields: Scalars["String"];
  cmoSampleName?: Maybe<Scalars["String"]>;
  collectionYear: Scalars["String"];
  genePanel: Scalars["String"];
  hasStatusStatuses: Array<Status>;
  hasStatusStatusesAggregate?: Maybe<SampleMetadataStatusHasStatusStatusesAggregationSelection>;
  hasStatusStatusesConnection: SampleMetadataHasStatusStatusesConnection;
  igoComplete?: Maybe<Scalars["Boolean"]>;
  igoRequestId?: Maybe<Scalars["String"]>;
  importDate: Scalars["String"];
  investigatorSampleId?: Maybe<Scalars["String"]>;
  libraries: Scalars["String"];
  oncotreeCode?: Maybe<Scalars["String"]>;
  preservation?: Maybe<Scalars["String"]>;
  primaryId: Scalars["String"];
  qcReports: Scalars["String"];
  sampleClass: Scalars["String"];
  sampleName?: Maybe<Scalars["String"]>;
  sampleOrigin?: Maybe<Scalars["String"]>;
  sampleType: Scalars["String"];
  samplesHasMetadata: Array<Sample>;
  samplesHasMetadataAggregate?: Maybe<SampleMetadataSampleSamplesHasMetadataAggregationSelection>;
  samplesHasMetadataConnection: SampleMetadataSamplesHasMetadataConnection;
  sex: Scalars["String"];
  species: Scalars["String"];
  tissueLocation?: Maybe<Scalars["String"]>;
  tubeId?: Maybe<Scalars["String"]>;
  tumorOrNormal: Scalars["String"];
};

export type SampleMetadataHasStatusStatusesArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  options?: InputMaybe<StatusOptions>;
  where?: InputMaybe<StatusWhere>;
};

export type SampleMetadataHasStatusStatusesAggregateArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  where?: InputMaybe<StatusWhere>;
};

export type SampleMetadataHasStatusStatusesConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  directed?: InputMaybe<Scalars["Boolean"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<SampleMetadataHasStatusStatusesConnectionSort>>;
  where?: InputMaybe<SampleMetadataHasStatusStatusesConnectionWhere>;
};

export type SampleMetadataSamplesHasMetadataArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  options?: InputMaybe<SampleOptions>;
  where?: InputMaybe<SampleWhere>;
};

export type SampleMetadataSamplesHasMetadataAggregateArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  where?: InputMaybe<SampleWhere>;
};

export type SampleMetadataSamplesHasMetadataConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  directed?: InputMaybe<Scalars["Boolean"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<SampleMetadataSamplesHasMetadataConnectionSort>>;
  where?: InputMaybe<SampleMetadataSamplesHasMetadataConnectionWhere>;
};

export type SampleMetadataAggregateSelection = {
  __typename?: "SampleMetadataAggregateSelection";
  additionalProperties: StringAggregateSelectionNonNullable;
  baitSet: StringAggregateSelectionNullable;
  cfDNA2dBarcode: StringAggregateSelectionNullable;
  cmoInfoIgoId: StringAggregateSelectionNullable;
  cmoPatientId: StringAggregateSelectionNullable;
  cmoSampleIdFields: StringAggregateSelectionNonNullable;
  cmoSampleName: StringAggregateSelectionNullable;
  collectionYear: StringAggregateSelectionNonNullable;
  count: Scalars["Int"];
  genePanel: StringAggregateSelectionNonNullable;
  igoRequestId: StringAggregateSelectionNullable;
  importDate: StringAggregateSelectionNonNullable;
  investigatorSampleId: StringAggregateSelectionNullable;
  libraries: StringAggregateSelectionNonNullable;
  oncotreeCode: StringAggregateSelectionNullable;
  preservation: StringAggregateSelectionNullable;
  primaryId: StringAggregateSelectionNonNullable;
  qcReports: StringAggregateSelectionNonNullable;
  sampleClass: StringAggregateSelectionNonNullable;
  sampleName: StringAggregateSelectionNullable;
  sampleOrigin: StringAggregateSelectionNullable;
  sampleType: StringAggregateSelectionNonNullable;
  sex: StringAggregateSelectionNonNullable;
  species: StringAggregateSelectionNonNullable;
  tissueLocation: StringAggregateSelectionNullable;
  tubeId: StringAggregateSelectionNullable;
  tumorOrNormal: StringAggregateSelectionNonNullable;
};

export type SampleMetadataConnectInput = {
  hasStatusStatuses?: InputMaybe<
    Array<SampleMetadataHasStatusStatusesConnectFieldInput>
  >;
  samplesHasMetadata?: InputMaybe<
    Array<SampleMetadataSamplesHasMetadataConnectFieldInput>
  >;
};

export type SampleMetadataConnectWhere = {
  node: SampleMetadataWhere;
};

export type SampleMetadataConnection = {
  __typename?: "SampleMetadataConnection";
  edges: Array<SampleMetadataEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type SampleMetadataCreateInput = {
  additionalProperties: Scalars["String"];
  baitSet?: InputMaybe<Scalars["String"]>;
  cfDNA2dBarcode?: InputMaybe<Scalars["String"]>;
  cmoInfoIgoId?: InputMaybe<Scalars["String"]>;
  cmoPatientId?: InputMaybe<Scalars["String"]>;
  cmoSampleIdFields: Scalars["String"];
  cmoSampleName?: InputMaybe<Scalars["String"]>;
  collectionYear: Scalars["String"];
  genePanel: Scalars["String"];
  hasStatusStatuses?: InputMaybe<SampleMetadataHasStatusStatusesFieldInput>;
  igoComplete?: InputMaybe<Scalars["Boolean"]>;
  igoRequestId?: InputMaybe<Scalars["String"]>;
  importDate: Scalars["String"];
  investigatorSampleId?: InputMaybe<Scalars["String"]>;
  libraries: Scalars["String"];
  oncotreeCode?: InputMaybe<Scalars["String"]>;
  preservation?: InputMaybe<Scalars["String"]>;
  primaryId: Scalars["String"];
  qcReports: Scalars["String"];
  sampleClass: Scalars["String"];
  sampleName?: InputMaybe<Scalars["String"]>;
  sampleOrigin?: InputMaybe<Scalars["String"]>;
  sampleType: Scalars["String"];
  samplesHasMetadata?: InputMaybe<SampleMetadataSamplesHasMetadataFieldInput>;
  sex: Scalars["String"];
  species: Scalars["String"];
  tissueLocation?: InputMaybe<Scalars["String"]>;
  tubeId?: InputMaybe<Scalars["String"]>;
  tumorOrNormal: Scalars["String"];
};

export type SampleMetadataDeleteInput = {
  hasStatusStatuses?: InputMaybe<
    Array<SampleMetadataHasStatusStatusesDeleteFieldInput>
  >;
  samplesHasMetadata?: InputMaybe<
    Array<SampleMetadataSamplesHasMetadataDeleteFieldInput>
  >;
};

export type SampleMetadataDisconnectInput = {
  hasStatusStatuses?: InputMaybe<
    Array<SampleMetadataHasStatusStatusesDisconnectFieldInput>
  >;
  samplesHasMetadata?: InputMaybe<
    Array<SampleMetadataSamplesHasMetadataDisconnectFieldInput>
  >;
};

export type SampleMetadataEdge = {
  __typename?: "SampleMetadataEdge";
  cursor: Scalars["String"];
  node: SampleMetadata;
};

export type SampleMetadataHasStatusStatusesAggregateInput = {
  AND?: InputMaybe<Array<SampleMetadataHasStatusStatusesAggregateInput>>;
  OR?: InputMaybe<Array<SampleMetadataHasStatusStatusesAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<SampleMetadataHasStatusStatusesNodeAggregationWhereInput>;
};

export type SampleMetadataHasStatusStatusesConnectFieldInput = {
  connect?: InputMaybe<Array<StatusConnectInput>>;
  where?: InputMaybe<StatusConnectWhere>;
};

export type SampleMetadataHasStatusStatusesConnection = {
  __typename?: "SampleMetadataHasStatusStatusesConnection";
  edges: Array<SampleMetadataHasStatusStatusesRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type SampleMetadataHasStatusStatusesConnectionSort = {
  node?: InputMaybe<StatusSort>;
};

export type SampleMetadataHasStatusStatusesConnectionWhere = {
  AND?: InputMaybe<Array<SampleMetadataHasStatusStatusesConnectionWhere>>;
  OR?: InputMaybe<Array<SampleMetadataHasStatusStatusesConnectionWhere>>;
  node?: InputMaybe<StatusWhere>;
  node_NOT?: InputMaybe<StatusWhere>;
};

export type SampleMetadataHasStatusStatusesCreateFieldInput = {
  node: StatusCreateInput;
};

export type SampleMetadataHasStatusStatusesDeleteFieldInput = {
  delete?: InputMaybe<StatusDeleteInput>;
  where?: InputMaybe<SampleMetadataHasStatusStatusesConnectionWhere>;
};

export type SampleMetadataHasStatusStatusesDisconnectFieldInput = {
  disconnect?: InputMaybe<StatusDisconnectInput>;
  where?: InputMaybe<SampleMetadataHasStatusStatusesConnectionWhere>;
};

export type SampleMetadataHasStatusStatusesFieldInput = {
  connect?: InputMaybe<Array<SampleMetadataHasStatusStatusesConnectFieldInput>>;
  create?: InputMaybe<Array<SampleMetadataHasStatusStatusesCreateFieldInput>>;
};

export type SampleMetadataHasStatusStatusesNodeAggregationWhereInput = {
  AND?: InputMaybe<
    Array<SampleMetadataHasStatusStatusesNodeAggregationWhereInput>
  >;
  OR?: InputMaybe<
    Array<SampleMetadataHasStatusStatusesNodeAggregationWhereInput>
  >;
  validationReport_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  validationReport_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  validationReport_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  validationReport_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  validationReport_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  validationReport_EQUAL?: InputMaybe<Scalars["String"]>;
  validationReport_GT?: InputMaybe<Scalars["Int"]>;
  validationReport_GTE?: InputMaybe<Scalars["Int"]>;
  validationReport_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  validationReport_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  validationReport_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  validationReport_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  validationReport_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  validationReport_LT?: InputMaybe<Scalars["Int"]>;
  validationReport_LTE?: InputMaybe<Scalars["Int"]>;
  validationReport_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  validationReport_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  validationReport_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  validationReport_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  validationReport_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
};

export type SampleMetadataHasStatusStatusesRelationship = {
  __typename?: "SampleMetadataHasStatusStatusesRelationship";
  cursor: Scalars["String"];
  node: Status;
};

export type SampleMetadataHasStatusStatusesUpdateConnectionInput = {
  node?: InputMaybe<StatusUpdateInput>;
};

export type SampleMetadataHasStatusStatusesUpdateFieldInput = {
  connect?: InputMaybe<Array<SampleMetadataHasStatusStatusesConnectFieldInput>>;
  create?: InputMaybe<Array<SampleMetadataHasStatusStatusesCreateFieldInput>>;
  delete?: InputMaybe<Array<SampleMetadataHasStatusStatusesDeleteFieldInput>>;
  disconnect?: InputMaybe<
    Array<SampleMetadataHasStatusStatusesDisconnectFieldInput>
  >;
  update?: InputMaybe<SampleMetadataHasStatusStatusesUpdateConnectionInput>;
  where?: InputMaybe<SampleMetadataHasStatusStatusesConnectionWhere>;
};

export type SampleMetadataOptions = {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more SampleMetadataSort objects to sort SampleMetadata by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<SampleMetadataSort>>;
};

export type SampleMetadataRelationInput = {
  hasStatusStatuses?: InputMaybe<
    Array<SampleMetadataHasStatusStatusesCreateFieldInput>
  >;
  samplesHasMetadata?: InputMaybe<
    Array<SampleMetadataSamplesHasMetadataCreateFieldInput>
  >;
};

export type SampleMetadataSampleSamplesHasMetadataAggregationSelection = {
  __typename?: "SampleMetadataSampleSamplesHasMetadataAggregationSelection";
  count: Scalars["Int"];
  node?: Maybe<SampleMetadataSampleSamplesHasMetadataNodeAggregateSelection>;
};

export type SampleMetadataSampleSamplesHasMetadataNodeAggregateSelection = {
  __typename?: "SampleMetadataSampleSamplesHasMetadataNodeAggregateSelection";
  datasource: StringAggregateSelectionNonNullable;
  sampleCategory: StringAggregateSelectionNonNullable;
  sampleClass: StringAggregateSelectionNonNullable;
  smileSampleId: StringAggregateSelectionNonNullable;
};

export type SampleMetadataSamplesHasMetadataAggregateInput = {
  AND?: InputMaybe<Array<SampleMetadataSamplesHasMetadataAggregateInput>>;
  OR?: InputMaybe<Array<SampleMetadataSamplesHasMetadataAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<SampleMetadataSamplesHasMetadataNodeAggregationWhereInput>;
};

export type SampleMetadataSamplesHasMetadataConnectFieldInput = {
  connect?: InputMaybe<Array<SampleConnectInput>>;
  where?: InputMaybe<SampleConnectWhere>;
};

export type SampleMetadataSamplesHasMetadataConnection = {
  __typename?: "SampleMetadataSamplesHasMetadataConnection";
  edges: Array<SampleMetadataSamplesHasMetadataRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type SampleMetadataSamplesHasMetadataConnectionSort = {
  node?: InputMaybe<SampleSort>;
};

export type SampleMetadataSamplesHasMetadataConnectionWhere = {
  AND?: InputMaybe<Array<SampleMetadataSamplesHasMetadataConnectionWhere>>;
  OR?: InputMaybe<Array<SampleMetadataSamplesHasMetadataConnectionWhere>>;
  node?: InputMaybe<SampleWhere>;
  node_NOT?: InputMaybe<SampleWhere>;
};

export type SampleMetadataSamplesHasMetadataCreateFieldInput = {
  node: SampleCreateInput;
};

export type SampleMetadataSamplesHasMetadataDeleteFieldInput = {
  delete?: InputMaybe<SampleDeleteInput>;
  where?: InputMaybe<SampleMetadataSamplesHasMetadataConnectionWhere>;
};

export type SampleMetadataSamplesHasMetadataDisconnectFieldInput = {
  disconnect?: InputMaybe<SampleDisconnectInput>;
  where?: InputMaybe<SampleMetadataSamplesHasMetadataConnectionWhere>;
};

export type SampleMetadataSamplesHasMetadataFieldInput = {
  connect?: InputMaybe<
    Array<SampleMetadataSamplesHasMetadataConnectFieldInput>
  >;
  create?: InputMaybe<Array<SampleMetadataSamplesHasMetadataCreateFieldInput>>;
};

export type SampleMetadataSamplesHasMetadataNodeAggregationWhereInput = {
  AND?: InputMaybe<
    Array<SampleMetadataSamplesHasMetadataNodeAggregationWhereInput>
  >;
  OR?: InputMaybe<
    Array<SampleMetadataSamplesHasMetadataNodeAggregationWhereInput>
  >;
  datasource_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  datasource_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  datasource_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  datasource_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  datasource_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  datasource_EQUAL?: InputMaybe<Scalars["String"]>;
  datasource_GT?: InputMaybe<Scalars["Int"]>;
  datasource_GTE?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  datasource_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  datasource_LT?: InputMaybe<Scalars["Int"]>;
  datasource_LTE?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  datasource_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  sampleCategory_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  sampleCategory_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  sampleCategory_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  sampleCategory_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  sampleCategory_EQUAL?: InputMaybe<Scalars["String"]>;
  sampleCategory_GT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_GTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_LTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleCategory_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  sampleClass_EQUAL?: InputMaybe<Scalars["String"]>;
  sampleClass_GT?: InputMaybe<Scalars["Int"]>;
  sampleClass_GTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_LT?: InputMaybe<Scalars["Int"]>;
  sampleClass_LTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  smileSampleId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  smileSampleId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  smileSampleId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  smileSampleId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  smileSampleId_EQUAL?: InputMaybe<Scalars["String"]>;
  smileSampleId_GT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_GTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_LTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  smileSampleId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
};

export type SampleMetadataSamplesHasMetadataRelationship = {
  __typename?: "SampleMetadataSamplesHasMetadataRelationship";
  cursor: Scalars["String"];
  node: Sample;
};

export type SampleMetadataSamplesHasMetadataUpdateConnectionInput = {
  node?: InputMaybe<SampleUpdateInput>;
};

export type SampleMetadataSamplesHasMetadataUpdateFieldInput = {
  connect?: InputMaybe<
    Array<SampleMetadataSamplesHasMetadataConnectFieldInput>
  >;
  create?: InputMaybe<Array<SampleMetadataSamplesHasMetadataCreateFieldInput>>;
  delete?: InputMaybe<Array<SampleMetadataSamplesHasMetadataDeleteFieldInput>>;
  disconnect?: InputMaybe<
    Array<SampleMetadataSamplesHasMetadataDisconnectFieldInput>
  >;
  update?: InputMaybe<SampleMetadataSamplesHasMetadataUpdateConnectionInput>;
  where?: InputMaybe<SampleMetadataSamplesHasMetadataConnectionWhere>;
};

/** Fields to sort SampleMetadata by. The order in which sorts are applied is not guaranteed when specifying many fields in one SampleMetadataSort object. */
export type SampleMetadataSort = {
  additionalProperties?: InputMaybe<SortDirection>;
  baitSet?: InputMaybe<SortDirection>;
  cfDNA2dBarcode?: InputMaybe<SortDirection>;
  cmoInfoIgoId?: InputMaybe<SortDirection>;
  cmoPatientId?: InputMaybe<SortDirection>;
  cmoSampleIdFields?: InputMaybe<SortDirection>;
  cmoSampleName?: InputMaybe<SortDirection>;
  collectionYear?: InputMaybe<SortDirection>;
  genePanel?: InputMaybe<SortDirection>;
  igoComplete?: InputMaybe<SortDirection>;
  igoRequestId?: InputMaybe<SortDirection>;
  importDate?: InputMaybe<SortDirection>;
  investigatorSampleId?: InputMaybe<SortDirection>;
  libraries?: InputMaybe<SortDirection>;
  oncotreeCode?: InputMaybe<SortDirection>;
  preservation?: InputMaybe<SortDirection>;
  primaryId?: InputMaybe<SortDirection>;
  qcReports?: InputMaybe<SortDirection>;
  sampleClass?: InputMaybe<SortDirection>;
  sampleName?: InputMaybe<SortDirection>;
  sampleOrigin?: InputMaybe<SortDirection>;
  sampleType?: InputMaybe<SortDirection>;
  sex?: InputMaybe<SortDirection>;
  species?: InputMaybe<SortDirection>;
  tissueLocation?: InputMaybe<SortDirection>;
  tubeId?: InputMaybe<SortDirection>;
  tumorOrNormal?: InputMaybe<SortDirection>;
};

export type SampleMetadataStatusHasStatusStatusesAggregationSelection = {
  __typename?: "SampleMetadataStatusHasStatusStatusesAggregationSelection";
  count: Scalars["Int"];
  node?: Maybe<SampleMetadataStatusHasStatusStatusesNodeAggregateSelection>;
};

export type SampleMetadataStatusHasStatusStatusesNodeAggregateSelection = {
  __typename?: "SampleMetadataStatusHasStatusStatusesNodeAggregateSelection";
  validationReport: StringAggregateSelectionNonNullable;
};

export type SampleMetadataUpdateInput = {
  additionalProperties?: InputMaybe<Scalars["String"]>;
  baitSet?: InputMaybe<Scalars["String"]>;
  cfDNA2dBarcode?: InputMaybe<Scalars["String"]>;
  cmoInfoIgoId?: InputMaybe<Scalars["String"]>;
  cmoPatientId?: InputMaybe<Scalars["String"]>;
  cmoSampleIdFields?: InputMaybe<Scalars["String"]>;
  cmoSampleName?: InputMaybe<Scalars["String"]>;
  collectionYear?: InputMaybe<Scalars["String"]>;
  genePanel?: InputMaybe<Scalars["String"]>;
  hasStatusStatuses?: InputMaybe<
    Array<SampleMetadataHasStatusStatusesUpdateFieldInput>
  >;
  igoComplete?: InputMaybe<Scalars["Boolean"]>;
  igoRequestId?: InputMaybe<Scalars["String"]>;
  importDate?: InputMaybe<Scalars["String"]>;
  investigatorSampleId?: InputMaybe<Scalars["String"]>;
  libraries?: InputMaybe<Scalars["String"]>;
  oncotreeCode?: InputMaybe<Scalars["String"]>;
  preservation?: InputMaybe<Scalars["String"]>;
  primaryId?: InputMaybe<Scalars["String"]>;
  qcReports?: InputMaybe<Scalars["String"]>;
  sampleClass?: InputMaybe<Scalars["String"]>;
  sampleName?: InputMaybe<Scalars["String"]>;
  sampleOrigin?: InputMaybe<Scalars["String"]>;
  sampleType?: InputMaybe<Scalars["String"]>;
  samplesHasMetadata?: InputMaybe<
    Array<SampleMetadataSamplesHasMetadataUpdateFieldInput>
  >;
  sex?: InputMaybe<Scalars["String"]>;
  species?: InputMaybe<Scalars["String"]>;
  tissueLocation?: InputMaybe<Scalars["String"]>;
  tubeId?: InputMaybe<Scalars["String"]>;
  tumorOrNormal?: InputMaybe<Scalars["String"]>;
};

export type SampleMetadataWhere = {
  AND?: InputMaybe<Array<SampleMetadataWhere>>;
  OR?: InputMaybe<Array<SampleMetadataWhere>>;
  additionalProperties?: InputMaybe<Scalars["String"]>;
  additionalProperties_CONTAINS?: InputMaybe<Scalars["String"]>;
  additionalProperties_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  additionalProperties_IN?: InputMaybe<Array<Scalars["String"]>>;
  additionalProperties_NOT?: InputMaybe<Scalars["String"]>;
  additionalProperties_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  additionalProperties_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  additionalProperties_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  additionalProperties_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  additionalProperties_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  baitSet?: InputMaybe<Scalars["String"]>;
  baitSet_CONTAINS?: InputMaybe<Scalars["String"]>;
  baitSet_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  baitSet_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  baitSet_NOT?: InputMaybe<Scalars["String"]>;
  baitSet_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  baitSet_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  baitSet_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  baitSet_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  baitSet_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  cfDNA2dBarcode?: InputMaybe<Scalars["String"]>;
  cfDNA2dBarcode_CONTAINS?: InputMaybe<Scalars["String"]>;
  cfDNA2dBarcode_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  cfDNA2dBarcode_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  cfDNA2dBarcode_NOT?: InputMaybe<Scalars["String"]>;
  cfDNA2dBarcode_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  cfDNA2dBarcode_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  cfDNA2dBarcode_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  cfDNA2dBarcode_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  cfDNA2dBarcode_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  cmoInfoIgoId?: InputMaybe<Scalars["String"]>;
  cmoInfoIgoId_CONTAINS?: InputMaybe<Scalars["String"]>;
  cmoInfoIgoId_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  cmoInfoIgoId_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  cmoInfoIgoId_NOT?: InputMaybe<Scalars["String"]>;
  cmoInfoIgoId_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  cmoInfoIgoId_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  cmoInfoIgoId_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  cmoInfoIgoId_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  cmoInfoIgoId_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  cmoPatientId?: InputMaybe<Scalars["String"]>;
  cmoPatientId_CONTAINS?: InputMaybe<Scalars["String"]>;
  cmoPatientId_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  cmoPatientId_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  cmoPatientId_NOT?: InputMaybe<Scalars["String"]>;
  cmoPatientId_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  cmoPatientId_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  cmoPatientId_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  cmoPatientId_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  cmoPatientId_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  cmoSampleIdFields?: InputMaybe<Scalars["String"]>;
  cmoSampleIdFields_CONTAINS?: InputMaybe<Scalars["String"]>;
  cmoSampleIdFields_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  cmoSampleIdFields_IN?: InputMaybe<Array<Scalars["String"]>>;
  cmoSampleIdFields_NOT?: InputMaybe<Scalars["String"]>;
  cmoSampleIdFields_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  cmoSampleIdFields_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  cmoSampleIdFields_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  cmoSampleIdFields_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  cmoSampleIdFields_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  cmoSampleName?: InputMaybe<Scalars["String"]>;
  cmoSampleName_CONTAINS?: InputMaybe<Scalars["String"]>;
  cmoSampleName_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  cmoSampleName_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  cmoSampleName_NOT?: InputMaybe<Scalars["String"]>;
  cmoSampleName_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  cmoSampleName_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  cmoSampleName_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  cmoSampleName_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  cmoSampleName_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  collectionYear?: InputMaybe<Scalars["String"]>;
  collectionYear_CONTAINS?: InputMaybe<Scalars["String"]>;
  collectionYear_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  collectionYear_IN?: InputMaybe<Array<Scalars["String"]>>;
  collectionYear_NOT?: InputMaybe<Scalars["String"]>;
  collectionYear_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  collectionYear_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  collectionYear_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  collectionYear_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  collectionYear_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  genePanel?: InputMaybe<Scalars["String"]>;
  genePanel_CONTAINS?: InputMaybe<Scalars["String"]>;
  genePanel_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  genePanel_IN?: InputMaybe<Array<Scalars["String"]>>;
  genePanel_NOT?: InputMaybe<Scalars["String"]>;
  genePanel_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  genePanel_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  genePanel_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  genePanel_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  genePanel_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  hasStatusStatusesAggregate?: InputMaybe<SampleMetadataHasStatusStatusesAggregateInput>;
  hasStatusStatusesConnection_ALL?: InputMaybe<SampleMetadataHasStatusStatusesConnectionWhere>;
  hasStatusStatusesConnection_NONE?: InputMaybe<SampleMetadataHasStatusStatusesConnectionWhere>;
  hasStatusStatusesConnection_SINGLE?: InputMaybe<SampleMetadataHasStatusStatusesConnectionWhere>;
  hasStatusStatusesConnection_SOME?: InputMaybe<SampleMetadataHasStatusStatusesConnectionWhere>;
  /** Return SampleMetadata where all of the related Statuses match this filter */
  hasStatusStatuses_ALL?: InputMaybe<StatusWhere>;
  /** Return SampleMetadata where none of the related Statuses match this filter */
  hasStatusStatuses_NONE?: InputMaybe<StatusWhere>;
  /** Return SampleMetadata where one of the related Statuses match this filter */
  hasStatusStatuses_SINGLE?: InputMaybe<StatusWhere>;
  /** Return SampleMetadata where some of the related Statuses match this filter */
  hasStatusStatuses_SOME?: InputMaybe<StatusWhere>;
  igoComplete?: InputMaybe<Scalars["Boolean"]>;
  igoComplete_NOT?: InputMaybe<Scalars["Boolean"]>;
  igoRequestId?: InputMaybe<Scalars["String"]>;
  igoRequestId_CONTAINS?: InputMaybe<Scalars["String"]>;
  igoRequestId_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  igoRequestId_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  igoRequestId_NOT?: InputMaybe<Scalars["String"]>;
  igoRequestId_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  igoRequestId_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  igoRequestId_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  igoRequestId_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  igoRequestId_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  importDate?: InputMaybe<Scalars["String"]>;
  importDate_CONTAINS?: InputMaybe<Scalars["String"]>;
  importDate_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  importDate_IN?: InputMaybe<Array<Scalars["String"]>>;
  importDate_NOT?: InputMaybe<Scalars["String"]>;
  importDate_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  importDate_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  importDate_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  importDate_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  importDate_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  investigatorSampleId?: InputMaybe<Scalars["String"]>;
  investigatorSampleId_CONTAINS?: InputMaybe<Scalars["String"]>;
  investigatorSampleId_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  investigatorSampleId_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  investigatorSampleId_NOT?: InputMaybe<Scalars["String"]>;
  investigatorSampleId_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  investigatorSampleId_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  investigatorSampleId_NOT_IN?: InputMaybe<
    Array<InputMaybe<Scalars["String"]>>
  >;
  investigatorSampleId_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  investigatorSampleId_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  libraries?: InputMaybe<Scalars["String"]>;
  libraries_CONTAINS?: InputMaybe<Scalars["String"]>;
  libraries_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  libraries_IN?: InputMaybe<Array<Scalars["String"]>>;
  libraries_NOT?: InputMaybe<Scalars["String"]>;
  libraries_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  libraries_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  libraries_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  libraries_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  libraries_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  oncotreeCode?: InputMaybe<Scalars["String"]>;
  oncotreeCode_CONTAINS?: InputMaybe<Scalars["String"]>;
  oncotreeCode_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  oncotreeCode_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  oncotreeCode_NOT?: InputMaybe<Scalars["String"]>;
  oncotreeCode_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  oncotreeCode_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  oncotreeCode_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  oncotreeCode_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  oncotreeCode_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  preservation?: InputMaybe<Scalars["String"]>;
  preservation_CONTAINS?: InputMaybe<Scalars["String"]>;
  preservation_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  preservation_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  preservation_NOT?: InputMaybe<Scalars["String"]>;
  preservation_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  preservation_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  preservation_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  preservation_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  preservation_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  primaryId?: InputMaybe<Scalars["String"]>;
  primaryId_CONTAINS?: InputMaybe<Scalars["String"]>;
  primaryId_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  primaryId_IN?: InputMaybe<Array<Scalars["String"]>>;
  primaryId_NOT?: InputMaybe<Scalars["String"]>;
  primaryId_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  primaryId_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  primaryId_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  primaryId_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  primaryId_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  qcReports?: InputMaybe<Scalars["String"]>;
  qcReports_CONTAINS?: InputMaybe<Scalars["String"]>;
  qcReports_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  qcReports_IN?: InputMaybe<Array<Scalars["String"]>>;
  qcReports_NOT?: InputMaybe<Scalars["String"]>;
  qcReports_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  qcReports_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  qcReports_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  qcReports_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  qcReports_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  sampleClass?: InputMaybe<Scalars["String"]>;
  sampleClass_CONTAINS?: InputMaybe<Scalars["String"]>;
  sampleClass_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  sampleClass_IN?: InputMaybe<Array<Scalars["String"]>>;
  sampleClass_NOT?: InputMaybe<Scalars["String"]>;
  sampleClass_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  sampleClass_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  sampleClass_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  sampleClass_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  sampleClass_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  sampleName?: InputMaybe<Scalars["String"]>;
  sampleName_CONTAINS?: InputMaybe<Scalars["String"]>;
  sampleName_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  sampleName_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  sampleName_NOT?: InputMaybe<Scalars["String"]>;
  sampleName_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  sampleName_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  sampleName_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  sampleName_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  sampleName_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  sampleOrigin?: InputMaybe<Scalars["String"]>;
  sampleOrigin_CONTAINS?: InputMaybe<Scalars["String"]>;
  sampleOrigin_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  sampleOrigin_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  sampleOrigin_NOT?: InputMaybe<Scalars["String"]>;
  sampleOrigin_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  sampleOrigin_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  sampleOrigin_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  sampleOrigin_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  sampleOrigin_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  sampleType?: InputMaybe<Scalars["String"]>;
  sampleType_CONTAINS?: InputMaybe<Scalars["String"]>;
  sampleType_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  sampleType_IN?: InputMaybe<Array<Scalars["String"]>>;
  sampleType_NOT?: InputMaybe<Scalars["String"]>;
  sampleType_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  sampleType_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  sampleType_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  sampleType_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  sampleType_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  samplesHasMetadataAggregate?: InputMaybe<SampleMetadataSamplesHasMetadataAggregateInput>;
  samplesHasMetadataConnection_ALL?: InputMaybe<SampleMetadataSamplesHasMetadataConnectionWhere>;
  samplesHasMetadataConnection_NONE?: InputMaybe<SampleMetadataSamplesHasMetadataConnectionWhere>;
  samplesHasMetadataConnection_SINGLE?: InputMaybe<SampleMetadataSamplesHasMetadataConnectionWhere>;
  samplesHasMetadataConnection_SOME?: InputMaybe<SampleMetadataSamplesHasMetadataConnectionWhere>;
  /** Return SampleMetadata where all of the related Samples match this filter */
  samplesHasMetadata_ALL?: InputMaybe<SampleWhere>;
  /** Return SampleMetadata where none of the related Samples match this filter */
  samplesHasMetadata_NONE?: InputMaybe<SampleWhere>;
  /** Return SampleMetadata where one of the related Samples match this filter */
  samplesHasMetadata_SINGLE?: InputMaybe<SampleWhere>;
  /** Return SampleMetadata where some of the related Samples match this filter */
  samplesHasMetadata_SOME?: InputMaybe<SampleWhere>;
  sex?: InputMaybe<Scalars["String"]>;
  sex_CONTAINS?: InputMaybe<Scalars["String"]>;
  sex_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  sex_IN?: InputMaybe<Array<Scalars["String"]>>;
  sex_NOT?: InputMaybe<Scalars["String"]>;
  sex_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  sex_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  sex_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  sex_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  sex_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  species?: InputMaybe<Scalars["String"]>;
  species_CONTAINS?: InputMaybe<Scalars["String"]>;
  species_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  species_IN?: InputMaybe<Array<Scalars["String"]>>;
  species_NOT?: InputMaybe<Scalars["String"]>;
  species_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  species_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  species_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  species_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  species_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  tissueLocation?: InputMaybe<Scalars["String"]>;
  tissueLocation_CONTAINS?: InputMaybe<Scalars["String"]>;
  tissueLocation_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  tissueLocation_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  tissueLocation_NOT?: InputMaybe<Scalars["String"]>;
  tissueLocation_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  tissueLocation_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  tissueLocation_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  tissueLocation_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  tissueLocation_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  tubeId?: InputMaybe<Scalars["String"]>;
  tubeId_CONTAINS?: InputMaybe<Scalars["String"]>;
  tubeId_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  tubeId_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  tubeId_NOT?: InputMaybe<Scalars["String"]>;
  tubeId_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  tubeId_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  tubeId_NOT_IN?: InputMaybe<Array<InputMaybe<Scalars["String"]>>>;
  tubeId_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  tubeId_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  tumorOrNormal?: InputMaybe<Scalars["String"]>;
  tumorOrNormal_CONTAINS?: InputMaybe<Scalars["String"]>;
  tumorOrNormal_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  tumorOrNormal_IN?: InputMaybe<Array<Scalars["String"]>>;
  tumorOrNormal_NOT?: InputMaybe<Scalars["String"]>;
  tumorOrNormal_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  tumorOrNormal_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  tumorOrNormal_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  tumorOrNormal_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  tumorOrNormal_STARTS_WITH?: InputMaybe<Scalars["String"]>;
};

export type SampleOptions = {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more SampleSort objects to sort Samples by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<SampleSort>>;
};

export type SamplePatientPatientsHasSampleAggregationSelection = {
  __typename?: "SamplePatientPatientsHasSampleAggregationSelection";
  count: Scalars["Int"];
  node?: Maybe<SamplePatientPatientsHasSampleNodeAggregateSelection>;
};

export type SamplePatientPatientsHasSampleNodeAggregateSelection = {
  __typename?: "SamplePatientPatientsHasSampleNodeAggregateSelection";
  smilePatientId: StringAggregateSelectionNonNullable;
};

export type SamplePatientsHasSampleAggregateInput = {
  AND?: InputMaybe<Array<SamplePatientsHasSampleAggregateInput>>;
  OR?: InputMaybe<Array<SamplePatientsHasSampleAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<SamplePatientsHasSampleNodeAggregationWhereInput>;
};

export type SamplePatientsHasSampleConnectFieldInput = {
  connect?: InputMaybe<Array<PatientConnectInput>>;
  where?: InputMaybe<PatientConnectWhere>;
};

export type SamplePatientsHasSampleConnection = {
  __typename?: "SamplePatientsHasSampleConnection";
  edges: Array<SamplePatientsHasSampleRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type SamplePatientsHasSampleConnectionSort = {
  node?: InputMaybe<PatientSort>;
};

export type SamplePatientsHasSampleConnectionWhere = {
  AND?: InputMaybe<Array<SamplePatientsHasSampleConnectionWhere>>;
  OR?: InputMaybe<Array<SamplePatientsHasSampleConnectionWhere>>;
  node?: InputMaybe<PatientWhere>;
  node_NOT?: InputMaybe<PatientWhere>;
};

export type SamplePatientsHasSampleCreateFieldInput = {
  node: PatientCreateInput;
};

export type SamplePatientsHasSampleDeleteFieldInput = {
  delete?: InputMaybe<PatientDeleteInput>;
  where?: InputMaybe<SamplePatientsHasSampleConnectionWhere>;
};

export type SamplePatientsHasSampleDisconnectFieldInput = {
  disconnect?: InputMaybe<PatientDisconnectInput>;
  where?: InputMaybe<SamplePatientsHasSampleConnectionWhere>;
};

export type SamplePatientsHasSampleFieldInput = {
  connect?: InputMaybe<Array<SamplePatientsHasSampleConnectFieldInput>>;
  create?: InputMaybe<Array<SamplePatientsHasSampleCreateFieldInput>>;
};

export type SamplePatientsHasSampleNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<SamplePatientsHasSampleNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<SamplePatientsHasSampleNodeAggregationWhereInput>>;
  smilePatientId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  smilePatientId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  smilePatientId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  smilePatientId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  smilePatientId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  smilePatientId_EQUAL?: InputMaybe<Scalars["String"]>;
  smilePatientId_GT?: InputMaybe<Scalars["Int"]>;
  smilePatientId_GTE?: InputMaybe<Scalars["Int"]>;
  smilePatientId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  smilePatientId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  smilePatientId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  smilePatientId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  smilePatientId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  smilePatientId_LT?: InputMaybe<Scalars["Int"]>;
  smilePatientId_LTE?: InputMaybe<Scalars["Int"]>;
  smilePatientId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  smilePatientId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  smilePatientId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  smilePatientId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  smilePatientId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
};

export type SamplePatientsHasSampleRelationship = {
  __typename?: "SamplePatientsHasSampleRelationship";
  cursor: Scalars["String"];
  node: Patient;
};

export type SamplePatientsHasSampleUpdateConnectionInput = {
  node?: InputMaybe<PatientUpdateInput>;
};

export type SamplePatientsHasSampleUpdateFieldInput = {
  connect?: InputMaybe<Array<SamplePatientsHasSampleConnectFieldInput>>;
  create?: InputMaybe<Array<SamplePatientsHasSampleCreateFieldInput>>;
  delete?: InputMaybe<Array<SamplePatientsHasSampleDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<SamplePatientsHasSampleDisconnectFieldInput>>;
  update?: InputMaybe<SamplePatientsHasSampleUpdateConnectionInput>;
  where?: InputMaybe<SamplePatientsHasSampleConnectionWhere>;
};

export type SampleRelationInput = {
  hasMetadataSampleMetadata?: InputMaybe<
    Array<SampleHasMetadataSampleMetadataCreateFieldInput>
  >;
  patientsHasSample?: InputMaybe<
    Array<SamplePatientsHasSampleCreateFieldInput>
  >;
  requestsHasSample?: InputMaybe<
    Array<SampleRequestsHasSampleCreateFieldInput>
  >;
  sampleAliasesIsAlias?: InputMaybe<
    Array<SampleSampleAliasesIsAliasCreateFieldInput>
  >;
};

export type SampleRequestRequestsHasSampleAggregationSelection = {
  __typename?: "SampleRequestRequestsHasSampleAggregationSelection";
  count: Scalars["Int"];
  node?: Maybe<SampleRequestRequestsHasSampleNodeAggregateSelection>;
};

export type SampleRequestRequestsHasSampleNodeAggregateSelection = {
  __typename?: "SampleRequestRequestsHasSampleNodeAggregateSelection";
  dataAccessEmails: StringAggregateSelectionNonNullable;
  dataAnalystEmail: StringAggregateSelectionNonNullable;
  dataAnalystName: StringAggregateSelectionNonNullable;
  genePanel: StringAggregateSelectionNonNullable;
  igoProjectId: StringAggregateSelectionNonNullable;
  igoRequestId: StringAggregateSelectionNonNullable;
  investigatorEmail: StringAggregateSelectionNonNullable;
  investigatorName: StringAggregateSelectionNonNullable;
  labHeadEmail: StringAggregateSelectionNonNullable;
  labHeadName: StringAggregateSelectionNonNullable;
  libraryType: StringAggregateSelectionNullable;
  namespace: StringAggregateSelectionNonNullable;
  otherContactEmails: StringAggregateSelectionNonNullable;
  piEmail: StringAggregateSelectionNonNullable;
  projectManagerName: StringAggregateSelectionNonNullable;
  qcAccessEmails: StringAggregateSelectionNonNullable;
  requestJson: StringAggregateSelectionNonNullable;
  smileRequestId: StringAggregateSelectionNonNullable;
  strand: StringAggregateSelectionNullable;
};

export type SampleRequestsHasSampleAggregateInput = {
  AND?: InputMaybe<Array<SampleRequestsHasSampleAggregateInput>>;
  OR?: InputMaybe<Array<SampleRequestsHasSampleAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<SampleRequestsHasSampleNodeAggregationWhereInput>;
};

export type SampleRequestsHasSampleConnectFieldInput = {
  connect?: InputMaybe<Array<RequestConnectInput>>;
  where?: InputMaybe<RequestConnectWhere>;
};

export type SampleRequestsHasSampleConnection = {
  __typename?: "SampleRequestsHasSampleConnection";
  edges: Array<SampleRequestsHasSampleRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type SampleRequestsHasSampleConnectionSort = {
  node?: InputMaybe<RequestSort>;
};

export type SampleRequestsHasSampleConnectionWhere = {
  AND?: InputMaybe<Array<SampleRequestsHasSampleConnectionWhere>>;
  OR?: InputMaybe<Array<SampleRequestsHasSampleConnectionWhere>>;
  node?: InputMaybe<RequestWhere>;
  node_NOT?: InputMaybe<RequestWhere>;
};

export type SampleRequestsHasSampleCreateFieldInput = {
  node: RequestCreateInput;
};

export type SampleRequestsHasSampleDeleteFieldInput = {
  delete?: InputMaybe<RequestDeleteInput>;
  where?: InputMaybe<SampleRequestsHasSampleConnectionWhere>;
};

export type SampleRequestsHasSampleDisconnectFieldInput = {
  disconnect?: InputMaybe<RequestDisconnectInput>;
  where?: InputMaybe<SampleRequestsHasSampleConnectionWhere>;
};

export type SampleRequestsHasSampleFieldInput = {
  connect?: InputMaybe<Array<SampleRequestsHasSampleConnectFieldInput>>;
  create?: InputMaybe<Array<SampleRequestsHasSampleCreateFieldInput>>;
};

export type SampleRequestsHasSampleNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<SampleRequestsHasSampleNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<SampleRequestsHasSampleNodeAggregationWhereInput>>;
  dataAccessEmails_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  dataAccessEmails_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  dataAccessEmails_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  dataAccessEmails_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  dataAccessEmails_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  dataAccessEmails_EQUAL?: InputMaybe<Scalars["String"]>;
  dataAccessEmails_GT?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_GTE?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_LT?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_LTE?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  dataAccessEmails_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  dataAnalystEmail_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  dataAnalystEmail_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  dataAnalystEmail_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  dataAnalystEmail_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  dataAnalystEmail_EQUAL?: InputMaybe<Scalars["String"]>;
  dataAnalystEmail_GT?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_GTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_LT?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_LTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  dataAnalystEmail_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  dataAnalystName_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  dataAnalystName_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  dataAnalystName_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  dataAnalystName_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  dataAnalystName_EQUAL?: InputMaybe<Scalars["String"]>;
  dataAnalystName_GT?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_GTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_LT?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_LTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  dataAnalystName_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  genePanel_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  genePanel_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  genePanel_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  genePanel_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  genePanel_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  genePanel_EQUAL?: InputMaybe<Scalars["String"]>;
  genePanel_GT?: InputMaybe<Scalars["Int"]>;
  genePanel_GTE?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  genePanel_LT?: InputMaybe<Scalars["Int"]>;
  genePanel_LTE?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  igoProjectId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  igoProjectId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  igoProjectId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  igoProjectId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  igoProjectId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  igoProjectId_EQUAL?: InputMaybe<Scalars["String"]>;
  igoProjectId_GT?: InputMaybe<Scalars["Int"]>;
  igoProjectId_GTE?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LT?: InputMaybe<Scalars["Int"]>;
  igoProjectId_LTE?: InputMaybe<Scalars["Int"]>;
  igoProjectId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  igoProjectId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  igoProjectId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  igoProjectId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  igoProjectId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  igoRequestId_EQUAL?: InputMaybe<Scalars["String"]>;
  igoRequestId_GT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_GTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  investigatorEmail_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  investigatorEmail_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  investigatorEmail_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  investigatorEmail_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  investigatorEmail_EQUAL?: InputMaybe<Scalars["String"]>;
  investigatorEmail_GT?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_GTE?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_LT?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_LTE?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  investigatorEmail_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  investigatorName_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  investigatorName_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  investigatorName_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  investigatorName_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  investigatorName_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  investigatorName_EQUAL?: InputMaybe<Scalars["String"]>;
  investigatorName_GT?: InputMaybe<Scalars["Int"]>;
  investigatorName_GTE?: InputMaybe<Scalars["Int"]>;
  investigatorName_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  investigatorName_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  investigatorName_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  investigatorName_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  investigatorName_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  investigatorName_LT?: InputMaybe<Scalars["Int"]>;
  investigatorName_LTE?: InputMaybe<Scalars["Int"]>;
  investigatorName_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  investigatorName_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  investigatorName_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  investigatorName_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  investigatorName_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  labHeadEmail_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  labHeadEmail_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  labHeadEmail_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  labHeadEmail_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  labHeadEmail_EQUAL?: InputMaybe<Scalars["String"]>;
  labHeadEmail_GT?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_GTE?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_LT?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_LTE?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  labHeadEmail_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  labHeadName_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  labHeadName_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  labHeadName_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  labHeadName_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  labHeadName_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  labHeadName_EQUAL?: InputMaybe<Scalars["String"]>;
  labHeadName_GT?: InputMaybe<Scalars["Int"]>;
  labHeadName_GTE?: InputMaybe<Scalars["Int"]>;
  labHeadName_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  labHeadName_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  labHeadName_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  labHeadName_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  labHeadName_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  labHeadName_LT?: InputMaybe<Scalars["Int"]>;
  labHeadName_LTE?: InputMaybe<Scalars["Int"]>;
  labHeadName_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  labHeadName_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  labHeadName_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  labHeadName_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  labHeadName_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  libraryType_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  libraryType_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  libraryType_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  libraryType_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  libraryType_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  libraryType_EQUAL?: InputMaybe<Scalars["String"]>;
  libraryType_GT?: InputMaybe<Scalars["Int"]>;
  libraryType_GTE?: InputMaybe<Scalars["Int"]>;
  libraryType_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  libraryType_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  libraryType_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  libraryType_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  libraryType_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  libraryType_LT?: InputMaybe<Scalars["Int"]>;
  libraryType_LTE?: InputMaybe<Scalars["Int"]>;
  libraryType_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  libraryType_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  libraryType_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  libraryType_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  libraryType_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  namespace_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  namespace_EQUAL?: InputMaybe<Scalars["String"]>;
  namespace_GT?: InputMaybe<Scalars["Int"]>;
  namespace_GTE?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  namespace_LT?: InputMaybe<Scalars["Int"]>;
  namespace_LTE?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  otherContactEmails_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  otherContactEmails_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  otherContactEmails_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  otherContactEmails_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  otherContactEmails_EQUAL?: InputMaybe<Scalars["String"]>;
  otherContactEmails_GT?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_GTE?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_LT?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_LTE?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  otherContactEmails_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  piEmail_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  piEmail_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  piEmail_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  piEmail_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  piEmail_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  piEmail_EQUAL?: InputMaybe<Scalars["String"]>;
  piEmail_GT?: InputMaybe<Scalars["Int"]>;
  piEmail_GTE?: InputMaybe<Scalars["Int"]>;
  piEmail_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  piEmail_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  piEmail_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  piEmail_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  piEmail_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  piEmail_LT?: InputMaybe<Scalars["Int"]>;
  piEmail_LTE?: InputMaybe<Scalars["Int"]>;
  piEmail_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  piEmail_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  piEmail_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  piEmail_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  piEmail_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  projectManagerName_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  projectManagerName_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  projectManagerName_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  projectManagerName_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  projectManagerName_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  projectManagerName_EQUAL?: InputMaybe<Scalars["String"]>;
  projectManagerName_GT?: InputMaybe<Scalars["Int"]>;
  projectManagerName_GTE?: InputMaybe<Scalars["Int"]>;
  projectManagerName_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  projectManagerName_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  projectManagerName_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  projectManagerName_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  projectManagerName_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  projectManagerName_LT?: InputMaybe<Scalars["Int"]>;
  projectManagerName_LTE?: InputMaybe<Scalars["Int"]>;
  projectManagerName_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  projectManagerName_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  projectManagerName_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  projectManagerName_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  projectManagerName_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  qcAccessEmails_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  qcAccessEmails_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  qcAccessEmails_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  qcAccessEmails_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  qcAccessEmails_EQUAL?: InputMaybe<Scalars["String"]>;
  qcAccessEmails_GT?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_GTE?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_LT?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_LTE?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  qcAccessEmails_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  requestJson_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  requestJson_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  requestJson_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  requestJson_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  requestJson_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  requestJson_EQUAL?: InputMaybe<Scalars["String"]>;
  requestJson_GT?: InputMaybe<Scalars["Int"]>;
  requestJson_GTE?: InputMaybe<Scalars["Int"]>;
  requestJson_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  requestJson_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  requestJson_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  requestJson_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  requestJson_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  requestJson_LT?: InputMaybe<Scalars["Int"]>;
  requestJson_LTE?: InputMaybe<Scalars["Int"]>;
  requestJson_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  requestJson_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  requestJson_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  requestJson_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  requestJson_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  smileRequestId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  smileRequestId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  smileRequestId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  smileRequestId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  smileRequestId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  smileRequestId_EQUAL?: InputMaybe<Scalars["String"]>;
  smileRequestId_GT?: InputMaybe<Scalars["Int"]>;
  smileRequestId_GTE?: InputMaybe<Scalars["Int"]>;
  smileRequestId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  smileRequestId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  smileRequestId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  smileRequestId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  smileRequestId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  smileRequestId_LT?: InputMaybe<Scalars["Int"]>;
  smileRequestId_LTE?: InputMaybe<Scalars["Int"]>;
  smileRequestId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  smileRequestId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  smileRequestId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  smileRequestId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  smileRequestId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  strand_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  strand_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  strand_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  strand_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  strand_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  strand_EQUAL?: InputMaybe<Scalars["String"]>;
  strand_GT?: InputMaybe<Scalars["Int"]>;
  strand_GTE?: InputMaybe<Scalars["Int"]>;
  strand_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  strand_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  strand_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  strand_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  strand_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  strand_LT?: InputMaybe<Scalars["Int"]>;
  strand_LTE?: InputMaybe<Scalars["Int"]>;
  strand_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  strand_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  strand_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  strand_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  strand_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
};

export type SampleRequestsHasSampleRelationship = {
  __typename?: "SampleRequestsHasSampleRelationship";
  cursor: Scalars["String"];
  node: Request;
};

export type SampleRequestsHasSampleUpdateConnectionInput = {
  node?: InputMaybe<RequestUpdateInput>;
};

export type SampleRequestsHasSampleUpdateFieldInput = {
  connect?: InputMaybe<Array<SampleRequestsHasSampleConnectFieldInput>>;
  create?: InputMaybe<Array<SampleRequestsHasSampleCreateFieldInput>>;
  delete?: InputMaybe<Array<SampleRequestsHasSampleDeleteFieldInput>>;
  disconnect?: InputMaybe<Array<SampleRequestsHasSampleDisconnectFieldInput>>;
  update?: InputMaybe<SampleRequestsHasSampleUpdateConnectionInput>;
  where?: InputMaybe<SampleRequestsHasSampleConnectionWhere>;
};

export type SampleSampleAliasSampleAliasesIsAliasAggregationSelection = {
  __typename?: "SampleSampleAliasSampleAliasesIsAliasAggregationSelection";
  count: Scalars["Int"];
  node?: Maybe<SampleSampleAliasSampleAliasesIsAliasNodeAggregateSelection>;
};

export type SampleSampleAliasSampleAliasesIsAliasNodeAggregateSelection = {
  __typename?: "SampleSampleAliasSampleAliasesIsAliasNodeAggregateSelection";
  namespace: StringAggregateSelectionNonNullable;
  value: StringAggregateSelectionNonNullable;
};

export type SampleSampleAliasesIsAliasAggregateInput = {
  AND?: InputMaybe<Array<SampleSampleAliasesIsAliasAggregateInput>>;
  OR?: InputMaybe<Array<SampleSampleAliasesIsAliasAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<SampleSampleAliasesIsAliasNodeAggregationWhereInput>;
};

export type SampleSampleAliasesIsAliasConnectFieldInput = {
  connect?: InputMaybe<Array<SampleAliasConnectInput>>;
  where?: InputMaybe<SampleAliasConnectWhere>;
};

export type SampleSampleAliasesIsAliasConnection = {
  __typename?: "SampleSampleAliasesIsAliasConnection";
  edges: Array<SampleSampleAliasesIsAliasRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type SampleSampleAliasesIsAliasConnectionSort = {
  node?: InputMaybe<SampleAliasSort>;
};

export type SampleSampleAliasesIsAliasConnectionWhere = {
  AND?: InputMaybe<Array<SampleSampleAliasesIsAliasConnectionWhere>>;
  OR?: InputMaybe<Array<SampleSampleAliasesIsAliasConnectionWhere>>;
  node?: InputMaybe<SampleAliasWhere>;
  node_NOT?: InputMaybe<SampleAliasWhere>;
};

export type SampleSampleAliasesIsAliasCreateFieldInput = {
  node: SampleAliasCreateInput;
};

export type SampleSampleAliasesIsAliasDeleteFieldInput = {
  delete?: InputMaybe<SampleAliasDeleteInput>;
  where?: InputMaybe<SampleSampleAliasesIsAliasConnectionWhere>;
};

export type SampleSampleAliasesIsAliasDisconnectFieldInput = {
  disconnect?: InputMaybe<SampleAliasDisconnectInput>;
  where?: InputMaybe<SampleSampleAliasesIsAliasConnectionWhere>;
};

export type SampleSampleAliasesIsAliasFieldInput = {
  connect?: InputMaybe<Array<SampleSampleAliasesIsAliasConnectFieldInput>>;
  create?: InputMaybe<Array<SampleSampleAliasesIsAliasCreateFieldInput>>;
};

export type SampleSampleAliasesIsAliasNodeAggregationWhereInput = {
  AND?: InputMaybe<Array<SampleSampleAliasesIsAliasNodeAggregationWhereInput>>;
  OR?: InputMaybe<Array<SampleSampleAliasesIsAliasNodeAggregationWhereInput>>;
  namespace_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  namespace_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  namespace_EQUAL?: InputMaybe<Scalars["String"]>;
  namespace_GT?: InputMaybe<Scalars["Int"]>;
  namespace_GTE?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  namespace_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  namespace_LT?: InputMaybe<Scalars["Int"]>;
  namespace_LTE?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  namespace_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  value_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  value_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  value_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  value_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  value_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  value_EQUAL?: InputMaybe<Scalars["String"]>;
  value_GT?: InputMaybe<Scalars["Int"]>;
  value_GTE?: InputMaybe<Scalars["Int"]>;
  value_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  value_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  value_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  value_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  value_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  value_LT?: InputMaybe<Scalars["Int"]>;
  value_LTE?: InputMaybe<Scalars["Int"]>;
  value_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  value_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  value_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  value_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  value_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
};

export type SampleSampleAliasesIsAliasRelationship = {
  __typename?: "SampleSampleAliasesIsAliasRelationship";
  cursor: Scalars["String"];
  node: SampleAlias;
};

export type SampleSampleAliasesIsAliasUpdateConnectionInput = {
  node?: InputMaybe<SampleAliasUpdateInput>;
};

export type SampleSampleAliasesIsAliasUpdateFieldInput = {
  connect?: InputMaybe<Array<SampleSampleAliasesIsAliasConnectFieldInput>>;
  create?: InputMaybe<Array<SampleSampleAliasesIsAliasCreateFieldInput>>;
  delete?: InputMaybe<Array<SampleSampleAliasesIsAliasDeleteFieldInput>>;
  disconnect?: InputMaybe<
    Array<SampleSampleAliasesIsAliasDisconnectFieldInput>
  >;
  update?: InputMaybe<SampleSampleAliasesIsAliasUpdateConnectionInput>;
  where?: InputMaybe<SampleSampleAliasesIsAliasConnectionWhere>;
};

export type SampleSampleMetadataHasMetadataSampleMetadataAggregationSelection =
  {
    __typename?: "SampleSampleMetadataHasMetadataSampleMetadataAggregationSelection";
    count: Scalars["Int"];
    node?: Maybe<SampleSampleMetadataHasMetadataSampleMetadataNodeAggregateSelection>;
  };

export type SampleSampleMetadataHasMetadataSampleMetadataNodeAggregateSelection =
  {
    __typename?: "SampleSampleMetadataHasMetadataSampleMetadataNodeAggregateSelection";
    additionalProperties: StringAggregateSelectionNonNullable;
    baitSet: StringAggregateSelectionNullable;
    cfDNA2dBarcode: StringAggregateSelectionNullable;
    cmoInfoIgoId: StringAggregateSelectionNullable;
    cmoPatientId: StringAggregateSelectionNullable;
    cmoSampleIdFields: StringAggregateSelectionNonNullable;
    cmoSampleName: StringAggregateSelectionNullable;
    collectionYear: StringAggregateSelectionNonNullable;
    genePanel: StringAggregateSelectionNonNullable;
    igoRequestId: StringAggregateSelectionNullable;
    importDate: StringAggregateSelectionNonNullable;
    investigatorSampleId: StringAggregateSelectionNullable;
    libraries: StringAggregateSelectionNonNullable;
    oncotreeCode: StringAggregateSelectionNullable;
    preservation: StringAggregateSelectionNullable;
    primaryId: StringAggregateSelectionNonNullable;
    qcReports: StringAggregateSelectionNonNullable;
    sampleClass: StringAggregateSelectionNonNullable;
    sampleName: StringAggregateSelectionNullable;
    sampleOrigin: StringAggregateSelectionNullable;
    sampleType: StringAggregateSelectionNonNullable;
    sex: StringAggregateSelectionNonNullable;
    species: StringAggregateSelectionNonNullable;
    tissueLocation: StringAggregateSelectionNullable;
    tubeId: StringAggregateSelectionNullable;
    tumorOrNormal: StringAggregateSelectionNonNullable;
  };

/** Fields to sort Samples by. The order in which sorts are applied is not guaranteed when specifying many fields in one SampleSort object. */
export type SampleSort = {
  datasource?: InputMaybe<SortDirection>;
  revisable?: InputMaybe<SortDirection>;
  sampleCategory?: InputMaybe<SortDirection>;
  sampleClass?: InputMaybe<SortDirection>;
  smileSampleId?: InputMaybe<SortDirection>;
};

export type SampleUpdateInput = {
  datasource?: InputMaybe<Scalars["String"]>;
  hasMetadataSampleMetadata?: InputMaybe<
    Array<SampleHasMetadataSampleMetadataUpdateFieldInput>
  >;
  patientsHasSample?: InputMaybe<
    Array<SamplePatientsHasSampleUpdateFieldInput>
  >;
  requestsHasSample?: InputMaybe<
    Array<SampleRequestsHasSampleUpdateFieldInput>
  >;
  revisable?: InputMaybe<Scalars["Boolean"]>;
  sampleAliasesIsAlias?: InputMaybe<
    Array<SampleSampleAliasesIsAliasUpdateFieldInput>
  >;
  sampleCategory?: InputMaybe<Scalars["String"]>;
  sampleClass?: InputMaybe<Scalars["String"]>;
  smileSampleId?: InputMaybe<Scalars["String"]>;
};

export type SampleWhere = {
  AND?: InputMaybe<Array<SampleWhere>>;
  OR?: InputMaybe<Array<SampleWhere>>;
  datasource?: InputMaybe<Scalars["String"]>;
  datasource_CONTAINS?: InputMaybe<Scalars["String"]>;
  datasource_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  datasource_IN?: InputMaybe<Array<Scalars["String"]>>;
  datasource_NOT?: InputMaybe<Scalars["String"]>;
  datasource_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  datasource_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  datasource_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  datasource_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  datasource_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  hasMetadataSampleMetadataAggregate?: InputMaybe<SampleHasMetadataSampleMetadataAggregateInput>;
  hasMetadataSampleMetadataConnection_ALL?: InputMaybe<SampleHasMetadataSampleMetadataConnectionWhere>;
  hasMetadataSampleMetadataConnection_NONE?: InputMaybe<SampleHasMetadataSampleMetadataConnectionWhere>;
  hasMetadataSampleMetadataConnection_SINGLE?: InputMaybe<SampleHasMetadataSampleMetadataConnectionWhere>;
  hasMetadataSampleMetadataConnection_SOME?: InputMaybe<SampleHasMetadataSampleMetadataConnectionWhere>;
  /** Return Samples where all of the related SampleMetadata match this filter */
  hasMetadataSampleMetadata_ALL?: InputMaybe<SampleMetadataWhere>;
  /** Return Samples where none of the related SampleMetadata match this filter */
  hasMetadataSampleMetadata_NONE?: InputMaybe<SampleMetadataWhere>;
  /** Return Samples where one of the related SampleMetadata match this filter */
  hasMetadataSampleMetadata_SINGLE?: InputMaybe<SampleMetadataWhere>;
  /** Return Samples where some of the related SampleMetadata match this filter */
  hasMetadataSampleMetadata_SOME?: InputMaybe<SampleMetadataWhere>;
  patientsHasSampleAggregate?: InputMaybe<SamplePatientsHasSampleAggregateInput>;
  patientsHasSampleConnection_ALL?: InputMaybe<SamplePatientsHasSampleConnectionWhere>;
  patientsHasSampleConnection_NONE?: InputMaybe<SamplePatientsHasSampleConnectionWhere>;
  patientsHasSampleConnection_SINGLE?: InputMaybe<SamplePatientsHasSampleConnectionWhere>;
  patientsHasSampleConnection_SOME?: InputMaybe<SamplePatientsHasSampleConnectionWhere>;
  /** Return Samples where all of the related Patients match this filter */
  patientsHasSample_ALL?: InputMaybe<PatientWhere>;
  /** Return Samples where none of the related Patients match this filter */
  patientsHasSample_NONE?: InputMaybe<PatientWhere>;
  /** Return Samples where one of the related Patients match this filter */
  patientsHasSample_SINGLE?: InputMaybe<PatientWhere>;
  /** Return Samples where some of the related Patients match this filter */
  patientsHasSample_SOME?: InputMaybe<PatientWhere>;
  requestsHasSampleAggregate?: InputMaybe<SampleRequestsHasSampleAggregateInput>;
  requestsHasSampleConnection_ALL?: InputMaybe<SampleRequestsHasSampleConnectionWhere>;
  requestsHasSampleConnection_NONE?: InputMaybe<SampleRequestsHasSampleConnectionWhere>;
  requestsHasSampleConnection_SINGLE?: InputMaybe<SampleRequestsHasSampleConnectionWhere>;
  requestsHasSampleConnection_SOME?: InputMaybe<SampleRequestsHasSampleConnectionWhere>;
  /** Return Samples where all of the related Requests match this filter */
  requestsHasSample_ALL?: InputMaybe<RequestWhere>;
  /** Return Samples where none of the related Requests match this filter */
  requestsHasSample_NONE?: InputMaybe<RequestWhere>;
  /** Return Samples where one of the related Requests match this filter */
  requestsHasSample_SINGLE?: InputMaybe<RequestWhere>;
  /** Return Samples where some of the related Requests match this filter */
  requestsHasSample_SOME?: InputMaybe<RequestWhere>;
  revisable?: InputMaybe<Scalars["Boolean"]>;
  revisable_NOT?: InputMaybe<Scalars["Boolean"]>;
  sampleAliasesIsAliasAggregate?: InputMaybe<SampleSampleAliasesIsAliasAggregateInput>;
  sampleAliasesIsAliasConnection_ALL?: InputMaybe<SampleSampleAliasesIsAliasConnectionWhere>;
  sampleAliasesIsAliasConnection_NONE?: InputMaybe<SampleSampleAliasesIsAliasConnectionWhere>;
  sampleAliasesIsAliasConnection_SINGLE?: InputMaybe<SampleSampleAliasesIsAliasConnectionWhere>;
  sampleAliasesIsAliasConnection_SOME?: InputMaybe<SampleSampleAliasesIsAliasConnectionWhere>;
  /** Return Samples where all of the related SampleAliases match this filter */
  sampleAliasesIsAlias_ALL?: InputMaybe<SampleAliasWhere>;
  /** Return Samples where none of the related SampleAliases match this filter */
  sampleAliasesIsAlias_NONE?: InputMaybe<SampleAliasWhere>;
  /** Return Samples where one of the related SampleAliases match this filter */
  sampleAliasesIsAlias_SINGLE?: InputMaybe<SampleAliasWhere>;
  /** Return Samples where some of the related SampleAliases match this filter */
  sampleAliasesIsAlias_SOME?: InputMaybe<SampleAliasWhere>;
  sampleCategory?: InputMaybe<Scalars["String"]>;
  sampleCategory_CONTAINS?: InputMaybe<Scalars["String"]>;
  sampleCategory_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  sampleCategory_IN?: InputMaybe<Array<Scalars["String"]>>;
  sampleCategory_NOT?: InputMaybe<Scalars["String"]>;
  sampleCategory_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  sampleCategory_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  sampleCategory_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  sampleCategory_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  sampleCategory_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  sampleClass?: InputMaybe<Scalars["String"]>;
  sampleClass_CONTAINS?: InputMaybe<Scalars["String"]>;
  sampleClass_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  sampleClass_IN?: InputMaybe<Array<Scalars["String"]>>;
  sampleClass_NOT?: InputMaybe<Scalars["String"]>;
  sampleClass_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  sampleClass_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  sampleClass_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  sampleClass_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  sampleClass_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  smileSampleId?: InputMaybe<Scalars["String"]>;
  smileSampleId_CONTAINS?: InputMaybe<Scalars["String"]>;
  smileSampleId_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  smileSampleId_IN?: InputMaybe<Array<Scalars["String"]>>;
  smileSampleId_NOT?: InputMaybe<Scalars["String"]>;
  smileSampleId_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  smileSampleId_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  smileSampleId_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  smileSampleId_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  smileSampleId_STARTS_WITH?: InputMaybe<Scalars["String"]>;
};

export type SamplesConnection = {
  __typename?: "SamplesConnection";
  edges: Array<SampleEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export enum SortDirection {
  /** Sort by field values in ascending order. */
  Asc = "ASC",
  /** Sort by field values in descending order. */
  Desc = "DESC",
}

export type Status = {
  __typename?: "Status";
  requestMetadataHasStatus: Array<RequestMetadata>;
  requestMetadataHasStatusAggregate?: Maybe<StatusRequestMetadataRequestMetadataHasStatusAggregationSelection>;
  requestMetadataHasStatusConnection: StatusRequestMetadataHasStatusConnection;
  sampleMetadataHasStatus: Array<SampleMetadata>;
  sampleMetadataHasStatusAggregate?: Maybe<StatusSampleMetadataSampleMetadataHasStatusAggregationSelection>;
  sampleMetadataHasStatusConnection: StatusSampleMetadataHasStatusConnection;
  validationReport: Scalars["String"];
  validationStatus: Scalars["Boolean"];
};

export type StatusRequestMetadataHasStatusArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  options?: InputMaybe<RequestMetadataOptions>;
  where?: InputMaybe<RequestMetadataWhere>;
};

export type StatusRequestMetadataHasStatusAggregateArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  where?: InputMaybe<RequestMetadataWhere>;
};

export type StatusRequestMetadataHasStatusConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  directed?: InputMaybe<Scalars["Boolean"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<StatusRequestMetadataHasStatusConnectionSort>>;
  where?: InputMaybe<StatusRequestMetadataHasStatusConnectionWhere>;
};

export type StatusSampleMetadataHasStatusArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  options?: InputMaybe<SampleMetadataOptions>;
  where?: InputMaybe<SampleMetadataWhere>;
};

export type StatusSampleMetadataHasStatusAggregateArgs = {
  directed?: InputMaybe<Scalars["Boolean"]>;
  where?: InputMaybe<SampleMetadataWhere>;
};

export type StatusSampleMetadataHasStatusConnectionArgs = {
  after?: InputMaybe<Scalars["String"]>;
  directed?: InputMaybe<Scalars["Boolean"]>;
  first?: InputMaybe<Scalars["Int"]>;
  sort?: InputMaybe<Array<StatusSampleMetadataHasStatusConnectionSort>>;
  where?: InputMaybe<StatusSampleMetadataHasStatusConnectionWhere>;
};

export type StatusAggregateSelection = {
  __typename?: "StatusAggregateSelection";
  count: Scalars["Int"];
  validationReport: StringAggregateSelectionNonNullable;
};

export type StatusConnectInput = {
  requestMetadataHasStatus?: InputMaybe<
    Array<StatusRequestMetadataHasStatusConnectFieldInput>
  >;
  sampleMetadataHasStatus?: InputMaybe<
    Array<StatusSampleMetadataHasStatusConnectFieldInput>
  >;
};

export type StatusConnectWhere = {
  node: StatusWhere;
};

export type StatusCreateInput = {
  requestMetadataHasStatus?: InputMaybe<StatusRequestMetadataHasStatusFieldInput>;
  sampleMetadataHasStatus?: InputMaybe<StatusSampleMetadataHasStatusFieldInput>;
  validationReport: Scalars["String"];
  validationStatus: Scalars["Boolean"];
};

export type StatusDeleteInput = {
  requestMetadataHasStatus?: InputMaybe<
    Array<StatusRequestMetadataHasStatusDeleteFieldInput>
  >;
  sampleMetadataHasStatus?: InputMaybe<
    Array<StatusSampleMetadataHasStatusDeleteFieldInput>
  >;
};

export type StatusDisconnectInput = {
  requestMetadataHasStatus?: InputMaybe<
    Array<StatusRequestMetadataHasStatusDisconnectFieldInput>
  >;
  sampleMetadataHasStatus?: InputMaybe<
    Array<StatusSampleMetadataHasStatusDisconnectFieldInput>
  >;
};

export type StatusEdge = {
  __typename?: "StatusEdge";
  cursor: Scalars["String"];
  node: Status;
};

export type StatusOptions = {
  limit?: InputMaybe<Scalars["Int"]>;
  offset?: InputMaybe<Scalars["Int"]>;
  /** Specify one or more StatusSort objects to sort Statuses by. The sorts will be applied in the order in which they are arranged in the array. */
  sort?: InputMaybe<Array<StatusSort>>;
};

export type StatusRelationInput = {
  requestMetadataHasStatus?: InputMaybe<
    Array<StatusRequestMetadataHasStatusCreateFieldInput>
  >;
  sampleMetadataHasStatus?: InputMaybe<
    Array<StatusSampleMetadataHasStatusCreateFieldInput>
  >;
};

export type StatusRequestMetadataHasStatusAggregateInput = {
  AND?: InputMaybe<Array<StatusRequestMetadataHasStatusAggregateInput>>;
  OR?: InputMaybe<Array<StatusRequestMetadataHasStatusAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<StatusRequestMetadataHasStatusNodeAggregationWhereInput>;
};

export type StatusRequestMetadataHasStatusConnectFieldInput = {
  connect?: InputMaybe<Array<RequestMetadataConnectInput>>;
  where?: InputMaybe<RequestMetadataConnectWhere>;
};

export type StatusRequestMetadataHasStatusConnection = {
  __typename?: "StatusRequestMetadataHasStatusConnection";
  edges: Array<StatusRequestMetadataHasStatusRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type StatusRequestMetadataHasStatusConnectionSort = {
  node?: InputMaybe<RequestMetadataSort>;
};

export type StatusRequestMetadataHasStatusConnectionWhere = {
  AND?: InputMaybe<Array<StatusRequestMetadataHasStatusConnectionWhere>>;
  OR?: InputMaybe<Array<StatusRequestMetadataHasStatusConnectionWhere>>;
  node?: InputMaybe<RequestMetadataWhere>;
  node_NOT?: InputMaybe<RequestMetadataWhere>;
};

export type StatusRequestMetadataHasStatusCreateFieldInput = {
  node: RequestMetadataCreateInput;
};

export type StatusRequestMetadataHasStatusDeleteFieldInput = {
  delete?: InputMaybe<RequestMetadataDeleteInput>;
  where?: InputMaybe<StatusRequestMetadataHasStatusConnectionWhere>;
};

export type StatusRequestMetadataHasStatusDisconnectFieldInput = {
  disconnect?: InputMaybe<RequestMetadataDisconnectInput>;
  where?: InputMaybe<StatusRequestMetadataHasStatusConnectionWhere>;
};

export type StatusRequestMetadataHasStatusFieldInput = {
  connect?: InputMaybe<Array<StatusRequestMetadataHasStatusConnectFieldInput>>;
  create?: InputMaybe<Array<StatusRequestMetadataHasStatusCreateFieldInput>>;
};

export type StatusRequestMetadataHasStatusNodeAggregationWhereInput = {
  AND?: InputMaybe<
    Array<StatusRequestMetadataHasStatusNodeAggregationWhereInput>
  >;
  OR?: InputMaybe<
    Array<StatusRequestMetadataHasStatusNodeAggregationWhereInput>
  >;
  igoRequestId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  igoRequestId_EQUAL?: InputMaybe<Scalars["String"]>;
  igoRequestId_GT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_GTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  importDate_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  importDate_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  importDate_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  importDate_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  importDate_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  importDate_EQUAL?: InputMaybe<Scalars["String"]>;
  importDate_GT?: InputMaybe<Scalars["Int"]>;
  importDate_GTE?: InputMaybe<Scalars["Int"]>;
  importDate_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  importDate_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  importDate_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  importDate_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  importDate_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  importDate_LT?: InputMaybe<Scalars["Int"]>;
  importDate_LTE?: InputMaybe<Scalars["Int"]>;
  importDate_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  importDate_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  importDate_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  importDate_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  importDate_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  requestMetadataJson_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  requestMetadataJson_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  requestMetadataJson_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  requestMetadataJson_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  requestMetadataJson_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  requestMetadataJson_EQUAL?: InputMaybe<Scalars["String"]>;
  requestMetadataJson_GT?: InputMaybe<Scalars["Int"]>;
  requestMetadataJson_GTE?: InputMaybe<Scalars["Int"]>;
  requestMetadataJson_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  requestMetadataJson_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  requestMetadataJson_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  requestMetadataJson_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  requestMetadataJson_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  requestMetadataJson_LT?: InputMaybe<Scalars["Int"]>;
  requestMetadataJson_LTE?: InputMaybe<Scalars["Int"]>;
  requestMetadataJson_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  requestMetadataJson_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  requestMetadataJson_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  requestMetadataJson_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  requestMetadataJson_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
};

export type StatusRequestMetadataHasStatusRelationship = {
  __typename?: "StatusRequestMetadataHasStatusRelationship";
  cursor: Scalars["String"];
  node: RequestMetadata;
};

export type StatusRequestMetadataHasStatusUpdateConnectionInput = {
  node?: InputMaybe<RequestMetadataUpdateInput>;
};

export type StatusRequestMetadataHasStatusUpdateFieldInput = {
  connect?: InputMaybe<Array<StatusRequestMetadataHasStatusConnectFieldInput>>;
  create?: InputMaybe<Array<StatusRequestMetadataHasStatusCreateFieldInput>>;
  delete?: InputMaybe<Array<StatusRequestMetadataHasStatusDeleteFieldInput>>;
  disconnect?: InputMaybe<
    Array<StatusRequestMetadataHasStatusDisconnectFieldInput>
  >;
  update?: InputMaybe<StatusRequestMetadataHasStatusUpdateConnectionInput>;
  where?: InputMaybe<StatusRequestMetadataHasStatusConnectionWhere>;
};

export type StatusRequestMetadataRequestMetadataHasStatusAggregationSelection =
  {
    __typename?: "StatusRequestMetadataRequestMetadataHasStatusAggregationSelection";
    count: Scalars["Int"];
    node?: Maybe<StatusRequestMetadataRequestMetadataHasStatusNodeAggregateSelection>;
  };

export type StatusRequestMetadataRequestMetadataHasStatusNodeAggregateSelection =
  {
    __typename?: "StatusRequestMetadataRequestMetadataHasStatusNodeAggregateSelection";
    igoRequestId: StringAggregateSelectionNonNullable;
    importDate: StringAggregateSelectionNonNullable;
    requestMetadataJson: StringAggregateSelectionNonNullable;
  };

export type StatusSampleMetadataHasStatusAggregateInput = {
  AND?: InputMaybe<Array<StatusSampleMetadataHasStatusAggregateInput>>;
  OR?: InputMaybe<Array<StatusSampleMetadataHasStatusAggregateInput>>;
  count?: InputMaybe<Scalars["Int"]>;
  count_GT?: InputMaybe<Scalars["Int"]>;
  count_GTE?: InputMaybe<Scalars["Int"]>;
  count_LT?: InputMaybe<Scalars["Int"]>;
  count_LTE?: InputMaybe<Scalars["Int"]>;
  node?: InputMaybe<StatusSampleMetadataHasStatusNodeAggregationWhereInput>;
};

export type StatusSampleMetadataHasStatusConnectFieldInput = {
  connect?: InputMaybe<Array<SampleMetadataConnectInput>>;
  where?: InputMaybe<SampleMetadataConnectWhere>;
};

export type StatusSampleMetadataHasStatusConnection = {
  __typename?: "StatusSampleMetadataHasStatusConnection";
  edges: Array<StatusSampleMetadataHasStatusRelationship>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type StatusSampleMetadataHasStatusConnectionSort = {
  node?: InputMaybe<SampleMetadataSort>;
};

export type StatusSampleMetadataHasStatusConnectionWhere = {
  AND?: InputMaybe<Array<StatusSampleMetadataHasStatusConnectionWhere>>;
  OR?: InputMaybe<Array<StatusSampleMetadataHasStatusConnectionWhere>>;
  node?: InputMaybe<SampleMetadataWhere>;
  node_NOT?: InputMaybe<SampleMetadataWhere>;
};

export type StatusSampleMetadataHasStatusCreateFieldInput = {
  node: SampleMetadataCreateInput;
};

export type StatusSampleMetadataHasStatusDeleteFieldInput = {
  delete?: InputMaybe<SampleMetadataDeleteInput>;
  where?: InputMaybe<StatusSampleMetadataHasStatusConnectionWhere>;
};

export type StatusSampleMetadataHasStatusDisconnectFieldInput = {
  disconnect?: InputMaybe<SampleMetadataDisconnectInput>;
  where?: InputMaybe<StatusSampleMetadataHasStatusConnectionWhere>;
};

export type StatusSampleMetadataHasStatusFieldInput = {
  connect?: InputMaybe<Array<StatusSampleMetadataHasStatusConnectFieldInput>>;
  create?: InputMaybe<Array<StatusSampleMetadataHasStatusCreateFieldInput>>;
};

export type StatusSampleMetadataHasStatusNodeAggregationWhereInput = {
  AND?: InputMaybe<
    Array<StatusSampleMetadataHasStatusNodeAggregationWhereInput>
  >;
  OR?: InputMaybe<
    Array<StatusSampleMetadataHasStatusNodeAggregationWhereInput>
  >;
  additionalProperties_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  additionalProperties_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  additionalProperties_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  additionalProperties_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  additionalProperties_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  additionalProperties_EQUAL?: InputMaybe<Scalars["String"]>;
  additionalProperties_GT?: InputMaybe<Scalars["Int"]>;
  additionalProperties_GTE?: InputMaybe<Scalars["Int"]>;
  additionalProperties_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  additionalProperties_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  additionalProperties_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  additionalProperties_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  additionalProperties_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  additionalProperties_LT?: InputMaybe<Scalars["Int"]>;
  additionalProperties_LTE?: InputMaybe<Scalars["Int"]>;
  additionalProperties_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  additionalProperties_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  additionalProperties_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  additionalProperties_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  additionalProperties_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  baitSet_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  baitSet_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  baitSet_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  baitSet_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  baitSet_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  baitSet_EQUAL?: InputMaybe<Scalars["String"]>;
  baitSet_GT?: InputMaybe<Scalars["Int"]>;
  baitSet_GTE?: InputMaybe<Scalars["Int"]>;
  baitSet_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  baitSet_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  baitSet_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  baitSet_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  baitSet_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  baitSet_LT?: InputMaybe<Scalars["Int"]>;
  baitSet_LTE?: InputMaybe<Scalars["Int"]>;
  baitSet_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  baitSet_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  baitSet_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  baitSet_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  baitSet_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  cfDNA2dBarcode_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  cfDNA2dBarcode_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  cfDNA2dBarcode_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  cfDNA2dBarcode_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  cfDNA2dBarcode_EQUAL?: InputMaybe<Scalars["String"]>;
  cfDNA2dBarcode_GT?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_GTE?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_LT?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_LTE?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  cfDNA2dBarcode_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  cmoInfoIgoId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  cmoInfoIgoId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  cmoInfoIgoId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  cmoInfoIgoId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  cmoInfoIgoId_EQUAL?: InputMaybe<Scalars["String"]>;
  cmoInfoIgoId_GT?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_GTE?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_LT?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_LTE?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  cmoInfoIgoId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  cmoPatientId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  cmoPatientId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  cmoPatientId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  cmoPatientId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  cmoPatientId_EQUAL?: InputMaybe<Scalars["String"]>;
  cmoPatientId_GT?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_GTE?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_LT?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_LTE?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  cmoPatientId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  cmoSampleIdFields_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  cmoSampleIdFields_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  cmoSampleIdFields_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  cmoSampleIdFields_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  cmoSampleIdFields_EQUAL?: InputMaybe<Scalars["String"]>;
  cmoSampleIdFields_GT?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_GTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_LT?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_LTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  cmoSampleIdFields_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  cmoSampleName_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  cmoSampleName_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  cmoSampleName_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  cmoSampleName_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  cmoSampleName_EQUAL?: InputMaybe<Scalars["String"]>;
  cmoSampleName_GT?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_GTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_LT?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_LTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  cmoSampleName_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  collectionYear_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  collectionYear_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  collectionYear_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  collectionYear_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  collectionYear_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  collectionYear_EQUAL?: InputMaybe<Scalars["String"]>;
  collectionYear_GT?: InputMaybe<Scalars["Int"]>;
  collectionYear_GTE?: InputMaybe<Scalars["Int"]>;
  collectionYear_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  collectionYear_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  collectionYear_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  collectionYear_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  collectionYear_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  collectionYear_LT?: InputMaybe<Scalars["Int"]>;
  collectionYear_LTE?: InputMaybe<Scalars["Int"]>;
  collectionYear_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  collectionYear_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  collectionYear_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  collectionYear_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  collectionYear_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  genePanel_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  genePanel_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  genePanel_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  genePanel_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  genePanel_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  genePanel_EQUAL?: InputMaybe<Scalars["String"]>;
  genePanel_GT?: InputMaybe<Scalars["Int"]>;
  genePanel_GTE?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  genePanel_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  genePanel_LT?: InputMaybe<Scalars["Int"]>;
  genePanel_LTE?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  genePanel_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  igoRequestId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  igoRequestId_EQUAL?: InputMaybe<Scalars["String"]>;
  igoRequestId_GT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_GTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_LTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  igoRequestId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  importDate_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  importDate_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  importDate_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  importDate_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  importDate_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  importDate_EQUAL?: InputMaybe<Scalars["String"]>;
  importDate_GT?: InputMaybe<Scalars["Int"]>;
  importDate_GTE?: InputMaybe<Scalars["Int"]>;
  importDate_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  importDate_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  importDate_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  importDate_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  importDate_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  importDate_LT?: InputMaybe<Scalars["Int"]>;
  importDate_LTE?: InputMaybe<Scalars["Int"]>;
  importDate_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  importDate_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  importDate_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  importDate_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  importDate_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  investigatorSampleId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  investigatorSampleId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  investigatorSampleId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  investigatorSampleId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  investigatorSampleId_EQUAL?: InputMaybe<Scalars["String"]>;
  investigatorSampleId_GT?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_GTE?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_LT?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_LTE?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  investigatorSampleId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  libraries_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  libraries_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  libraries_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  libraries_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  libraries_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  libraries_EQUAL?: InputMaybe<Scalars["String"]>;
  libraries_GT?: InputMaybe<Scalars["Int"]>;
  libraries_GTE?: InputMaybe<Scalars["Int"]>;
  libraries_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  libraries_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  libraries_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  libraries_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  libraries_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  libraries_LT?: InputMaybe<Scalars["Int"]>;
  libraries_LTE?: InputMaybe<Scalars["Int"]>;
  libraries_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  libraries_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  libraries_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  libraries_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  libraries_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  oncotreeCode_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  oncotreeCode_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  oncotreeCode_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  oncotreeCode_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  oncotreeCode_EQUAL?: InputMaybe<Scalars["String"]>;
  oncotreeCode_GT?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_GTE?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_LT?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_LTE?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  oncotreeCode_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  preservation_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  preservation_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  preservation_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  preservation_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  preservation_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  preservation_EQUAL?: InputMaybe<Scalars["String"]>;
  preservation_GT?: InputMaybe<Scalars["Int"]>;
  preservation_GTE?: InputMaybe<Scalars["Int"]>;
  preservation_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  preservation_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  preservation_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  preservation_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  preservation_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  preservation_LT?: InputMaybe<Scalars["Int"]>;
  preservation_LTE?: InputMaybe<Scalars["Int"]>;
  preservation_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  preservation_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  preservation_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  preservation_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  preservation_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  primaryId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  primaryId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  primaryId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  primaryId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  primaryId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  primaryId_EQUAL?: InputMaybe<Scalars["String"]>;
  primaryId_GT?: InputMaybe<Scalars["Int"]>;
  primaryId_GTE?: InputMaybe<Scalars["Int"]>;
  primaryId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  primaryId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  primaryId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  primaryId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  primaryId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  primaryId_LT?: InputMaybe<Scalars["Int"]>;
  primaryId_LTE?: InputMaybe<Scalars["Int"]>;
  primaryId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  primaryId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  primaryId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  primaryId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  primaryId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  qcReports_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  qcReports_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  qcReports_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  qcReports_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  qcReports_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  qcReports_EQUAL?: InputMaybe<Scalars["String"]>;
  qcReports_GT?: InputMaybe<Scalars["Int"]>;
  qcReports_GTE?: InputMaybe<Scalars["Int"]>;
  qcReports_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  qcReports_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  qcReports_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  qcReports_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  qcReports_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  qcReports_LT?: InputMaybe<Scalars["Int"]>;
  qcReports_LTE?: InputMaybe<Scalars["Int"]>;
  qcReports_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  qcReports_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  qcReports_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  qcReports_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  qcReports_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  sampleClass_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  sampleClass_EQUAL?: InputMaybe<Scalars["String"]>;
  sampleClass_GT?: InputMaybe<Scalars["Int"]>;
  sampleClass_GTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleClass_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_LT?: InputMaybe<Scalars["Int"]>;
  sampleClass_LTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleClass_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleName_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  sampleName_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  sampleName_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  sampleName_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  sampleName_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  sampleName_EQUAL?: InputMaybe<Scalars["String"]>;
  sampleName_GT?: InputMaybe<Scalars["Int"]>;
  sampleName_GTE?: InputMaybe<Scalars["Int"]>;
  sampleName_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleName_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleName_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleName_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleName_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleName_LT?: InputMaybe<Scalars["Int"]>;
  sampleName_LTE?: InputMaybe<Scalars["Int"]>;
  sampleName_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleName_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleName_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleName_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleName_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  sampleOrigin_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  sampleOrigin_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  sampleOrigin_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  sampleOrigin_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  sampleOrigin_EQUAL?: InputMaybe<Scalars["String"]>;
  sampleOrigin_GT?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_GTE?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_LT?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_LTE?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleOrigin_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleType_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  sampleType_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  sampleType_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  sampleType_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  sampleType_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  sampleType_EQUAL?: InputMaybe<Scalars["String"]>;
  sampleType_GT?: InputMaybe<Scalars["Int"]>;
  sampleType_GTE?: InputMaybe<Scalars["Int"]>;
  sampleType_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleType_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleType_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleType_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleType_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  sampleType_LT?: InputMaybe<Scalars["Int"]>;
  sampleType_LTE?: InputMaybe<Scalars["Int"]>;
  sampleType_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sampleType_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  sampleType_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  sampleType_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  sampleType_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  sex_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  sex_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  sex_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  sex_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  sex_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  sex_EQUAL?: InputMaybe<Scalars["String"]>;
  sex_GT?: InputMaybe<Scalars["Int"]>;
  sex_GTE?: InputMaybe<Scalars["Int"]>;
  sex_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sex_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  sex_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  sex_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  sex_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  sex_LT?: InputMaybe<Scalars["Int"]>;
  sex_LTE?: InputMaybe<Scalars["Int"]>;
  sex_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  sex_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  sex_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  sex_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  sex_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  species_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  species_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  species_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  species_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  species_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  species_EQUAL?: InputMaybe<Scalars["String"]>;
  species_GT?: InputMaybe<Scalars["Int"]>;
  species_GTE?: InputMaybe<Scalars["Int"]>;
  species_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  species_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  species_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  species_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  species_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  species_LT?: InputMaybe<Scalars["Int"]>;
  species_LTE?: InputMaybe<Scalars["Int"]>;
  species_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  species_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  species_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  species_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  species_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  tissueLocation_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  tissueLocation_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  tissueLocation_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  tissueLocation_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  tissueLocation_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  tissueLocation_EQUAL?: InputMaybe<Scalars["String"]>;
  tissueLocation_GT?: InputMaybe<Scalars["Int"]>;
  tissueLocation_GTE?: InputMaybe<Scalars["Int"]>;
  tissueLocation_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  tissueLocation_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  tissueLocation_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  tissueLocation_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  tissueLocation_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  tissueLocation_LT?: InputMaybe<Scalars["Int"]>;
  tissueLocation_LTE?: InputMaybe<Scalars["Int"]>;
  tissueLocation_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  tissueLocation_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  tissueLocation_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  tissueLocation_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  tissueLocation_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  tubeId_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  tubeId_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  tubeId_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  tubeId_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  tubeId_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  tubeId_EQUAL?: InputMaybe<Scalars["String"]>;
  tubeId_GT?: InputMaybe<Scalars["Int"]>;
  tubeId_GTE?: InputMaybe<Scalars["Int"]>;
  tubeId_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  tubeId_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  tubeId_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  tubeId_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  tubeId_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  tubeId_LT?: InputMaybe<Scalars["Int"]>;
  tubeId_LTE?: InputMaybe<Scalars["Int"]>;
  tubeId_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  tubeId_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  tubeId_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  tubeId_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  tubeId_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_AVERAGE_EQUAL?: InputMaybe<Scalars["Float"]>;
  tumorOrNormal_AVERAGE_GT?: InputMaybe<Scalars["Float"]>;
  tumorOrNormal_AVERAGE_GTE?: InputMaybe<Scalars["Float"]>;
  tumorOrNormal_AVERAGE_LT?: InputMaybe<Scalars["Float"]>;
  tumorOrNormal_AVERAGE_LTE?: InputMaybe<Scalars["Float"]>;
  tumorOrNormal_EQUAL?: InputMaybe<Scalars["String"]>;
  tumorOrNormal_GT?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_GTE?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_LONGEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_LONGEST_GT?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_LONGEST_GTE?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_LONGEST_LT?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_LONGEST_LTE?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_LT?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_LTE?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_SHORTEST_EQUAL?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_SHORTEST_GT?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_SHORTEST_GTE?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_SHORTEST_LT?: InputMaybe<Scalars["Int"]>;
  tumorOrNormal_SHORTEST_LTE?: InputMaybe<Scalars["Int"]>;
};

export type StatusSampleMetadataHasStatusRelationship = {
  __typename?: "StatusSampleMetadataHasStatusRelationship";
  cursor: Scalars["String"];
  node: SampleMetadata;
};

export type StatusSampleMetadataHasStatusUpdateConnectionInput = {
  node?: InputMaybe<SampleMetadataUpdateInput>;
};

export type StatusSampleMetadataHasStatusUpdateFieldInput = {
  connect?: InputMaybe<Array<StatusSampleMetadataHasStatusConnectFieldInput>>;
  create?: InputMaybe<Array<StatusSampleMetadataHasStatusCreateFieldInput>>;
  delete?: InputMaybe<Array<StatusSampleMetadataHasStatusDeleteFieldInput>>;
  disconnect?: InputMaybe<
    Array<StatusSampleMetadataHasStatusDisconnectFieldInput>
  >;
  update?: InputMaybe<StatusSampleMetadataHasStatusUpdateConnectionInput>;
  where?: InputMaybe<StatusSampleMetadataHasStatusConnectionWhere>;
};

export type StatusSampleMetadataSampleMetadataHasStatusAggregationSelection = {
  __typename?: "StatusSampleMetadataSampleMetadataHasStatusAggregationSelection";
  count: Scalars["Int"];
  node?: Maybe<StatusSampleMetadataSampleMetadataHasStatusNodeAggregateSelection>;
};

export type StatusSampleMetadataSampleMetadataHasStatusNodeAggregateSelection =
  {
    __typename?: "StatusSampleMetadataSampleMetadataHasStatusNodeAggregateSelection";
    additionalProperties: StringAggregateSelectionNonNullable;
    baitSet: StringAggregateSelectionNullable;
    cfDNA2dBarcode: StringAggregateSelectionNullable;
    cmoInfoIgoId: StringAggregateSelectionNullable;
    cmoPatientId: StringAggregateSelectionNullable;
    cmoSampleIdFields: StringAggregateSelectionNonNullable;
    cmoSampleName: StringAggregateSelectionNullable;
    collectionYear: StringAggregateSelectionNonNullable;
    genePanel: StringAggregateSelectionNonNullable;
    igoRequestId: StringAggregateSelectionNullable;
    importDate: StringAggregateSelectionNonNullable;
    investigatorSampleId: StringAggregateSelectionNullable;
    libraries: StringAggregateSelectionNonNullable;
    oncotreeCode: StringAggregateSelectionNullable;
    preservation: StringAggregateSelectionNullable;
    primaryId: StringAggregateSelectionNonNullable;
    qcReports: StringAggregateSelectionNonNullable;
    sampleClass: StringAggregateSelectionNonNullable;
    sampleName: StringAggregateSelectionNullable;
    sampleOrigin: StringAggregateSelectionNullable;
    sampleType: StringAggregateSelectionNonNullable;
    sex: StringAggregateSelectionNonNullable;
    species: StringAggregateSelectionNonNullable;
    tissueLocation: StringAggregateSelectionNullable;
    tubeId: StringAggregateSelectionNullable;
    tumorOrNormal: StringAggregateSelectionNonNullable;
  };

/** Fields to sort Statuses by. The order in which sorts are applied is not guaranteed when specifying many fields in one StatusSort object. */
export type StatusSort = {
  validationReport?: InputMaybe<SortDirection>;
  validationStatus?: InputMaybe<SortDirection>;
};

export type StatusUpdateInput = {
  requestMetadataHasStatus?: InputMaybe<
    Array<StatusRequestMetadataHasStatusUpdateFieldInput>
  >;
  sampleMetadataHasStatus?: InputMaybe<
    Array<StatusSampleMetadataHasStatusUpdateFieldInput>
  >;
  validationReport?: InputMaybe<Scalars["String"]>;
  validationStatus?: InputMaybe<Scalars["Boolean"]>;
};

export type StatusWhere = {
  AND?: InputMaybe<Array<StatusWhere>>;
  OR?: InputMaybe<Array<StatusWhere>>;
  requestMetadataHasStatusAggregate?: InputMaybe<StatusRequestMetadataHasStatusAggregateInput>;
  requestMetadataHasStatusConnection_ALL?: InputMaybe<StatusRequestMetadataHasStatusConnectionWhere>;
  requestMetadataHasStatusConnection_NONE?: InputMaybe<StatusRequestMetadataHasStatusConnectionWhere>;
  requestMetadataHasStatusConnection_SINGLE?: InputMaybe<StatusRequestMetadataHasStatusConnectionWhere>;
  requestMetadataHasStatusConnection_SOME?: InputMaybe<StatusRequestMetadataHasStatusConnectionWhere>;
  /** Return Statuses where all of the related RequestMetadata match this filter */
  requestMetadataHasStatus_ALL?: InputMaybe<RequestMetadataWhere>;
  /** Return Statuses where none of the related RequestMetadata match this filter */
  requestMetadataHasStatus_NONE?: InputMaybe<RequestMetadataWhere>;
  /** Return Statuses where one of the related RequestMetadata match this filter */
  requestMetadataHasStatus_SINGLE?: InputMaybe<RequestMetadataWhere>;
  /** Return Statuses where some of the related RequestMetadata match this filter */
  requestMetadataHasStatus_SOME?: InputMaybe<RequestMetadataWhere>;
  sampleMetadataHasStatusAggregate?: InputMaybe<StatusSampleMetadataHasStatusAggregateInput>;
  sampleMetadataHasStatusConnection_ALL?: InputMaybe<StatusSampleMetadataHasStatusConnectionWhere>;
  sampleMetadataHasStatusConnection_NONE?: InputMaybe<StatusSampleMetadataHasStatusConnectionWhere>;
  sampleMetadataHasStatusConnection_SINGLE?: InputMaybe<StatusSampleMetadataHasStatusConnectionWhere>;
  sampleMetadataHasStatusConnection_SOME?: InputMaybe<StatusSampleMetadataHasStatusConnectionWhere>;
  /** Return Statuses where all of the related SampleMetadata match this filter */
  sampleMetadataHasStatus_ALL?: InputMaybe<SampleMetadataWhere>;
  /** Return Statuses where none of the related SampleMetadata match this filter */
  sampleMetadataHasStatus_NONE?: InputMaybe<SampleMetadataWhere>;
  /** Return Statuses where one of the related SampleMetadata match this filter */
  sampleMetadataHasStatus_SINGLE?: InputMaybe<SampleMetadataWhere>;
  /** Return Statuses where some of the related SampleMetadata match this filter */
  sampleMetadataHasStatus_SOME?: InputMaybe<SampleMetadataWhere>;
  validationReport?: InputMaybe<Scalars["String"]>;
  validationReport_CONTAINS?: InputMaybe<Scalars["String"]>;
  validationReport_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  validationReport_IN?: InputMaybe<Array<Scalars["String"]>>;
  validationReport_NOT?: InputMaybe<Scalars["String"]>;
  validationReport_NOT_CONTAINS?: InputMaybe<Scalars["String"]>;
  validationReport_NOT_ENDS_WITH?: InputMaybe<Scalars["String"]>;
  validationReport_NOT_IN?: InputMaybe<Array<Scalars["String"]>>;
  validationReport_NOT_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  validationReport_STARTS_WITH?: InputMaybe<Scalars["String"]>;
  validationStatus?: InputMaybe<Scalars["Boolean"]>;
  validationStatus_NOT?: InputMaybe<Scalars["Boolean"]>;
};

export type StatusesConnection = {
  __typename?: "StatusesConnection";
  edges: Array<StatusEdge>;
  pageInfo: PageInfo;
  totalCount: Scalars["Int"];
};

export type StringAggregateSelectionNonNullable = {
  __typename?: "StringAggregateSelectionNonNullable";
  longest: Scalars["String"];
  shortest: Scalars["String"];
};

export type StringAggregateSelectionNullable = {
  __typename?: "StringAggregateSelectionNullable";
  longest?: Maybe<Scalars["String"]>;
  shortest?: Maybe<Scalars["String"]>;
};

export type UpdateInfo = {
  __typename?: "UpdateInfo";
  bookmark?: Maybe<Scalars["String"]>;
  nodesCreated: Scalars["Int"];
  nodesDeleted: Scalars["Int"];
  relationshipsCreated: Scalars["Int"];
  relationshipsDeleted: Scalars["Int"];
};

export type UpdatePatientAliasesMutationResponse = {
  __typename?: "UpdatePatientAliasesMutationResponse";
  info: UpdateInfo;
  patientAliases: Array<PatientAlias>;
};

export type UpdatePatientsMutationResponse = {
  __typename?: "UpdatePatientsMutationResponse";
  info: UpdateInfo;
  patients: Array<Patient>;
};

export type UpdateProjectsMutationResponse = {
  __typename?: "UpdateProjectsMutationResponse";
  info: UpdateInfo;
  projects: Array<Project>;
};

export type UpdateRequestMetadataMutationResponse = {
  __typename?: "UpdateRequestMetadataMutationResponse";
  info: UpdateInfo;
  requestMetadata: Array<RequestMetadata>;
};

export type UpdateRequestsMutationResponse = {
  __typename?: "UpdateRequestsMutationResponse";
  info: UpdateInfo;
  requests: Array<Request>;
};

export type UpdateSampleAliasesMutationResponse = {
  __typename?: "UpdateSampleAliasesMutationResponse";
  info: UpdateInfo;
  sampleAliases: Array<SampleAlias>;
};

export type UpdateSampleMetadataMutationResponse = {
  __typename?: "UpdateSampleMetadataMutationResponse";
  info: UpdateInfo;
  sampleMetadata: Array<SampleMetadata>;
};

export type UpdateSamplesMutationResponse = {
  __typename?: "UpdateSamplesMutationResponse";
  info: UpdateInfo;
  samples: Array<Sample>;
};

export type UpdateStatusesMutationResponse = {
  __typename?: "UpdateStatusesMutationResponse";
  info: UpdateInfo;
  statuses: Array<Status>;
};

export type RequestsListQueryVariables = Exact<{
  options?: InputMaybe<RequestOptions>;
  where?: InputMaybe<RequestWhere>;
  requestsConnectionWhere2?: InputMaybe<RequestWhere>;
}>;

export type RequestsListQuery = {
  __typename?: "Query";
  requestsConnection: { __typename?: "RequestsConnection"; totalCount: number };
  requests: Array<{
    __typename?: "Request";
    igoRequestId: string;
    igoProjectId: string;
    genePanel: string;
    dataAnalystName: string;
    dataAnalystEmail: string;
    dataAccessEmails: string;
    bicAnalysis: boolean;
    investigatorEmail: string;
    investigatorName: string;
    isCmoRequest: boolean;
    labHeadEmail: string;
    labHeadName: string;
    libraryType?: string | null;
    otherContactEmails: string;
    piEmail: string;
    projectManagerName: string;
    qcAccessEmails: string;
    smileRequestId: string;
    hasSampleSamplesConnection: {
      __typename?: "RequestHasSampleSamplesConnection";
      totalCount: number;
    };
  }>;
};

export type RequestWithSamplesQueryVariables = Exact<{
  options?: InputMaybe<RequestOptions>;
  where?: InputMaybe<RequestWhere>;
  hasSampleSamplesWhere2?: InputMaybe<SampleWhere>;
  hasMetadataSampleMetadataWhere2?: InputMaybe<SampleMetadataWhere>;
  hasSampleSamplesConnectionWhere2?: InputMaybe<RequestHasSampleSamplesConnectionWhere>;
  hasMetadataSampleMetadataOptions2?: InputMaybe<SampleMetadataOptions>;
}>;

export type RequestWithSamplesQuery = {
  __typename?: "Query";
  requests: Array<{
    __typename?: "Request";
    igoRequestId: string;
    igoProjectId: string;
    genePanel: string;
    dataAnalystName: string;
    dataAnalystEmail: string;
    dataAccessEmails: string;
    bicAnalysis: boolean;
    investigatorEmail: string;
    investigatorName: string;
    isCmoRequest: boolean;
    labHeadEmail: string;
    labHeadName: string;
    libraryType?: string | null;
    otherContactEmails: string;
    piEmail: string;
    projectManagerName: string;
    qcAccessEmails: string;
    smileRequestId: string;
    hasSampleSamples: Array<{
      __typename?: "Sample";
      smileSampleId: string;
      sampleCategory: string;
      sampleClass: string;
      datasource: string;
      revisable: boolean;
      hasMetadataSampleMetadata: Array<{
        __typename?: "SampleMetadata";
        cmoSampleName?: string | null;
        igoComplete?: boolean | null;
        importDate: string;
        investigatorSampleId?: string | null;
        primaryId: string;
        sampleClass: string;
        cmoPatientId?: string | null;
        cmoSampleIdFields: string;
        sampleName?: string | null;
        preservation?: string | null;
        tumorOrNormal: string;
        oncotreeCode?: string | null;
        collectionYear: string;
        sampleOrigin?: string | null;
        tissueLocation?: string | null;
        sex: string;
        libraries: string;
        sampleType: string;
        species: string;
        genePanel: string;
      }>;
      patientsHasSample: Array<{
        __typename?: "Patient";
        smilePatientId: string;
        patientAliasesIsAlias: Array<{
          __typename?: "PatientAlias";
          namespace: string;
          value?: string | null;
        }>;
      }>;
    }>;
    hasSampleSamplesConnection: {
      __typename?: "RequestHasSampleSamplesConnection";
      totalCount: number;
    };
  }>;
};

export type RequestPartsFragment = {
  __typename?: "Request";
  igoRequestId: string;
  igoProjectId: string;
  genePanel: string;
  dataAnalystName: string;
  dataAnalystEmail: string;
  dataAccessEmails: string;
  bicAnalysis: boolean;
  investigatorEmail: string;
  investigatorName: string;
  isCmoRequest: boolean;
  labHeadEmail: string;
  labHeadName: string;
  libraryType?: string | null;
  otherContactEmails: string;
  piEmail: string;
  projectManagerName: string;
  qcAccessEmails: string;
  smileRequestId: string;
};

export type SampleMetadataFieldsFragment = {
  __typename?: "SampleMetadata";
  cmoSampleName?: string | null;
  igoComplete?: boolean | null;
  importDate: string;
  investigatorSampleId?: string | null;
  primaryId: string;
  sampleClass: string;
  cmoPatientId?: string | null;
  cmoSampleIdFields: string;
  sampleName?: string | null;
  preservation?: string | null;
  tumorOrNormal: string;
  oncotreeCode?: string | null;
  collectionYear: string;
  sampleOrigin?: string | null;
  tissueLocation?: string | null;
  sex: string;
  libraries: string;
  sampleType: string;
  species: string;
  genePanel: string;
};

export type SamplesQueryVariables = Exact<{
  where?: InputMaybe<SampleWhere>;
  hasMetadataSampleMetadataWhere2?: InputMaybe<SampleMetadataWhere>;
  hasMetadataSampleMetadataOptions2?: InputMaybe<SampleMetadataOptions>;
}>;

export type SamplesQuery = {
  __typename?: "Query";
  samples: Array<{
    __typename?: "Sample";
    smileSampleId: string;
    revisable: boolean;
    sampleCategory: string;
    sampleClass: string;
    datasource: string;
    hasMetadataSampleMetadata: Array<{
      __typename?: "SampleMetadata";
      cmoSampleName?: string | null;
      igoComplete?: boolean | null;
      importDate: string;
      investigatorSampleId?: string | null;
      primaryId: string;
      sampleClass: string;
      cmoPatientId?: string | null;
      cmoSampleIdFields: string;
      sampleName?: string | null;
      preservation?: string | null;
      tumorOrNormal: string;
      oncotreeCode?: string | null;
      collectionYear: string;
      sampleOrigin?: string | null;
      tissueLocation?: string | null;
      sex: string;
      libraries: string;
      sampleType: string;
      species: string;
      genePanel: string;
    }>;
  }>;
};

export type UpdateSamplesMutationVariables = Exact<{
  where?: InputMaybe<SampleWhere>;
  update?: InputMaybe<SampleUpdateInput>;
  connect?: InputMaybe<SampleConnectInput>;
}>;

export type UpdateSamplesMutation = {
  __typename?: "Mutation";
  updateSamples: {
    __typename?: "UpdateSamplesMutationResponse";
    samples: Array<{
      __typename?: "Sample";
      smileSampleId: string;
      revisable: boolean;
      datasource: string;
      sampleCategory: string;
      sampleClass: string;
      hasMetadataSampleMetadata: Array<{
        __typename?: "SampleMetadata";
        cmoSampleName?: string | null;
        igoComplete?: boolean | null;
        importDate: string;
        investigatorSampleId?: string | null;
        primaryId: string;
        sampleClass: string;
        cmoPatientId?: string | null;
        cmoSampleIdFields: string;
        sampleName?: string | null;
        preservation?: string | null;
        tumorOrNormal: string;
        oncotreeCode?: string | null;
        collectionYear: string;
        sampleOrigin?: string | null;
        tissueLocation?: string | null;
        sex: string;
        libraries: string;
        sampleType: string;
        species: string;
        genePanel: string;
      }>;
    }>;
  };
};

export const RequestPartsFragmentDoc = gql`
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
export const SampleMetadataFieldsFragmentDoc = gql`
  fragment SampleMetadataFields on SampleMetadata {
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
`;
export const RequestsListDocument = gql`
  query RequestsList(
    $options: RequestOptions
    $where: RequestWhere
    $requestsConnectionWhere2: RequestWhere
  ) {
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
  ${RequestPartsFragmentDoc}
`;
export type RequestsListQueryResult = Apollo.QueryResult<
  RequestsListQuery,
  RequestsListQueryVariables
>;
export const RequestWithSamplesDocument = gql`
  query RequestWithSamples(
    $options: RequestOptions
    $where: RequestWhere
    $hasSampleSamplesWhere2: SampleWhere
    $hasMetadataSampleMetadataWhere2: SampleMetadataWhere
    $hasSampleSamplesConnectionWhere2: RequestHasSampleSamplesConnectionWhere
    $hasMetadataSampleMetadataOptions2: SampleMetadataOptions
  ) {
    requests(where: $where, options: $options) {
      ...RequestParts
      hasSampleSamples(where: $hasSampleSamplesWhere2) {
        smileSampleId
        sampleCategory
        sampleClass
        datasource
        revisable
        hasMetadataSampleMetadata(
          where: $hasMetadataSampleMetadataWhere2
          options: $hasMetadataSampleMetadataOptions2
        ) {
          ...SampleMetadataFields
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
  ${RequestPartsFragmentDoc}
  ${SampleMetadataFieldsFragmentDoc}
`;
export type RequestWithSamplesQueryResult = Apollo.QueryResult<
  RequestWithSamplesQuery,
  RequestWithSamplesQueryVariables
>;
export const SamplesDocument = gql`
  query Samples(
    $where: SampleWhere
    $hasMetadataSampleMetadataWhere2: SampleMetadataWhere
    $hasMetadataSampleMetadataOptions2: SampleMetadataOptions
  ) {
    samples(where: $where) {
      smileSampleId
      revisable
      sampleCategory
      sampleClass
      datasource
      hasMetadataSampleMetadata(
        where: $hasMetadataSampleMetadataWhere2
        options: $hasMetadataSampleMetadataOptions2
      ) {
        ...SampleMetadataFields
      }
    }
  }
  ${SampleMetadataFieldsFragmentDoc}
`;
export type SamplesQueryResult = Apollo.QueryResult<
  SamplesQuery,
  SamplesQueryVariables
>;
export const UpdateSamplesDocument = gql`
  mutation UpdateSamples(
    $where: SampleWhere
    $update: SampleUpdateInput
    $connect: SampleConnectInput
  ) {
    updateSamples(where: $where, update: $update, connect: $connect) {
      samples {
        smileSampleId
        revisable
        datasource
        sampleCategory
        sampleClass
        hasMetadataSampleMetadata {
          ...SampleMetadataFields
        }
      }
    }
  }
  ${SampleMetadataFieldsFragmentDoc}
`;
export type UpdateSamplesMutationFn = Apollo.MutationFunction<
  UpdateSamplesMutation,
  UpdateSamplesMutationVariables
>;
export type UpdateSamplesMutationResult =
  Apollo.MutationResult<UpdateSamplesMutation>;
export type UpdateSamplesMutationOptions = Apollo.BaseMutationOptions<
  UpdateSamplesMutation,
  UpdateSamplesMutationVariables
>;
