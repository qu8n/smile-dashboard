import { GraphQLWhereArg, OGM } from "@neo4j/graphql-ogm";
import { sortArrayByNestedField } from "./flattening";
import { SortDirection } from "../generated/graphql";

const MAX_ROWS = 500;

export async function querySamplesList(ogm: OGM, where: GraphQLWhereArg) {
  const samples = await ogm.model("Sample").find({
    where: where,
    selectionSet: `{
      datasource
      revisable
      sampleCategory
      sampleClass
      smileSampleId
      hasMetadataSampleMetadata {
        additionalProperties
        baitSet
        cfDNA2dBarcode
        cmoInfoIgoId
        cmoPatientId
        cmoSampleIdFields
        cmoSampleName
        collectionYear
        genePanel
        igoComplete
        igoRequestId
        importDate
        investigatorSampleId
        libraries
        oncotreeCode
        preservation
        primaryId
        qcReports
        sampleClass
        sampleName
        sampleOrigin
        sampleType
        sex
        species
        tissueLocation
        tubeId
        tumorOrNormal
        hasStatusStatuses {
          validationReport
          validationStatus
        }
      }
      requestsHasSample {
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
      patientsHasSample {
        smilePatientId
        patientAliasesIsAlias {
          namespace
          value
        }
      }
      cohortsHasCohortSample {
        cohortId
        hasCohortCompleteCohortCompletes {
          date
        }
      }
      hasTempoTempos {
        smileTempoId
        billed
        billedBy
        costCenter
        custodianInformation
        accessLevel
        hasEventBamCompletes {
          date
          status
        }
        hasEventMafCompletes {
          date
          normalPrimaryId
          status
        }
        hasEventQcCompletes {
          date
          reason
          result
          status
        }
      }
    }`,
  });

  await sortArrayByNestedField(
    samples,
    "Sample",
    "importDate",
    SortDirection.Desc
  );

  return {
    totalCount: samples.length,
    data: samples.slice(0, MAX_ROWS),
  };
}
