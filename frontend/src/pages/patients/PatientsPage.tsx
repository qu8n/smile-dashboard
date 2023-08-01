import {
  PatientAliasWhere,
  SampleWhere,
  usePatientsListLazyQuery,
} from "../../generated/graphql";
import React from "react";
import { PatientsListColumns } from "../../shared/helpers";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import RecordsList from "../../components/RecordsList";
import { useParams } from "react-router-dom";
import PageHeader from "../../shared/components/PageHeader";
import { parseSearchQueries } from "../../lib/parseSearchQueries";

function patientAliasFilterWhereVariables(value: string): PatientAliasWhere[] {
  const uniqueQueries = parseSearchQueries(value);

  if (uniqueQueries.length > 1) {
    return [
      { value_IN: uniqueQueries },
      { namespace_IN: uniqueQueries },
      {
        isAliasPatients_SOME: {
          hasSampleSamples_SOME: {
            hasMetadataSampleMetadata_SOME: {
              cmoSampleName_IN: uniqueQueries,
            },
          },
        },
      },
      {
        isAliasPatients_SOME: {
          hasSampleSamples_SOME: {
            hasMetadataSampleMetadata_SOME: {
              primaryId_IN: uniqueQueries,
            },
          },
        },
      },
    ];
  } else {
    return [
      { value_CONTAINS: uniqueQueries[0] },
      { namespace_CONTAINS: uniqueQueries[0] },
      {
        isAliasPatients_SOME: {
          hasSampleSamples_SOME: {
            hasMetadataSampleMetadata_SOME: {
              cmoSampleName_CONTAINS: uniqueQueries[0],
            },
          },
        },
      },
      {
        isAliasPatients_SOME: {
          hasSampleSamples_SOME: {
            hasMetadataSampleMetadata_SOME: {
              primaryId_CONTAINS: uniqueQueries[0],
            },
          },
        },
      },
    ];
  }
}

export const PatientsPage: React.FunctionComponent = (props) => {
  const params = useParams();

  const pageRoute = "/patients";
  const sampleQueryParamFieldName = "cmoPatientId";

  return (
    <>
      <PageHeader pageTitle={"patients"} pageRoute={pageRoute} />

      <RecordsList
        lazyRecordsQuery={usePatientsListLazyQuery}
        nodeName="patientAliases"
        totalCountNodeName="patientAliasesConnection"
        pageRoute={pageRoute}
        searchTerm="patients"
        colDefs={PatientsListColumns}
        conditionBuilder={patientAliasFilterWhereVariables}
        sampleQueryParamFieldName={sampleQueryParamFieldName}
        sampleQueryParamValue={params[sampleQueryParamFieldName]}
        searchVariables={
          {
            OR: [
              {
                patientsHasSampleConnection_SOME: {
                  node: {
                    patientAliasesIsAlias_SOME: {
                      value: params[sampleQueryParamFieldName],
                    },
                  },
                },
              },
            ],
          } as SampleWhere
        }
      />
    </>
  );
};

export default PatientsPage;
