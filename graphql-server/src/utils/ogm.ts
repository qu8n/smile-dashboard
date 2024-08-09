import { GraphQLOptionsArg, GraphQLWhereArg, OGM } from "@neo4j/graphql-ogm";

export async function querySamplesList(
  ogm: OGM,
  where: GraphQLWhereArg,
  options: GraphQLOptionsArg
) {
  return await ogm.model("Sample").find({
    where: where,
    options: options,
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
}
