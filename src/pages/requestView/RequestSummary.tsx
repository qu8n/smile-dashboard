import React from "react";
import { RequestSummaryQueryDocument } from "../../generated/graphql";
import { useQuery } from "@apollo/client";
import { InfiniteLoader, Table, Column, AutoSizer } from "react-virtualized";
import { Row } from "react-bootstrap";
import { observer } from "mobx-react";
import "react-virtualized/styles.css";

const RequestSummary = observer(({ props }) => {
  const { loading, error, data, fetchMore } = useQuery(
    RequestSummaryQueryDocument,
    {
      variables: {
        where: {
          igoRequestId_CONTAINS: props.requestId
        },
        options: {
          offset: 0,
          limit: 50
        },
        hasMetadataSampleMetadataOptions2: {
          sort: [
            {
              importDate: "DESC"
            }
          ],
          limit: 1
        }
      }
    }
  );

  if (loading) return <Row />;
  if (error) return <Row>Error loading request details / request samples</Row>;

  function loadMoreRows({ startIndex, stopIndex }, fetchMore: any) {
    return fetchMore({
      variables: {
        options: {
          offset: startIndex,
          limit: stopIndex
        }
      }
    });
  }

  function isRowLoaded({ index }) {
    return index < data.requests[0].hasSampleSamples.length;
  }

  function rowGetter({ index }) {
    if (!data.requests[0].hasSampleSamples[index]) {
      return "";
    }
    return data.requests[0].hasSampleSamples[index]
      .hasMetadataSampleMetadata[0];
  }

  const remoteRowCount = data.requests[0].hasSampleSamplesConnection.totalCount;

  return (
    <InfiniteLoader
      isRowLoaded={isRowLoaded}
      loadMoreRows={params => {
        return loadMoreRows(params, fetchMore);
      }}
      rowCount={remoteRowCount}
    >
      {({ onRowsRendered, registerChild }) => (
        <AutoSizer>
          {({ width }) => (
            <Table
              className="table"
              ref={registerChild}
              width={width}
              height={450}
              headerHeight={50}
              rowHeight={40}
              rowCount={remoteRowCount}
              onRowsRendered={onRowsRendered}
              rowGetter={rowGetter}
            >
              {SampleDetailsColumns.map(col => {
                return (
                  <Column
                    label={col.label}
                    dataKey={`${col.dataKey}`}
                    width={width / SampleDetailsColumns.length}
                  />
                );
              })}
            </Table>
          )}
        </AutoSizer>
      )}
    </InfiniteLoader>
  );
});

export { RequestSummary };

const SampleDetailsColumns = [
  {
    dataKey: "cmoSampleName",
    label: "CMO Sample Label"
  },
  {
    dataKey: "investigatorSampleId",
    label: "Investigator Sample ID"
  },
  {
    dataKey: "cmoPatientId",
    label: "CMO Patient ID"
  },
  {
    dataKey: "primaryId",
    label: "Primary ID"
  },
  {
    dataKey: "cmoSampleName",
    label: "CMO Sample Name"
  },
  {
    dataKey: "preservation",
    label: "Preservation"
  },
  {
    dataKey: "tumorOrNormal",
    label: "Tumor Or Normal"
  },
  {
    dataKey: "sampleClass",
    label: "Sample Class"
  },
  {
    dataKey: "oncotreeCode",
    label: "Oncotree Code"
  },
  {
    dataKey: "collectionYear",
    label: "Collection Year"
  },
  {
    dataKey: "sampleOrigin",
    label: "Sample Origin"
  },
  {
    dataKey: "tissueLocation",
    label: "Tissue Location"
  },
  {
    dataKey: "sex",
    label: "Sex"
  }
];
