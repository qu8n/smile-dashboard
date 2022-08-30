import React from "react";
import { RequestSummaryQueryDocument } from "../../generated/graphql";
import { useQuery } from "@apollo/client";
import { InfiniteLoader, Table, Column } from "react-virtualized";
import { Row } from "react-bootstrap";
import { observer } from "mobx-react";
import { makeAutoObservable } from "mobx";
import { TableCell } from "@material-ui/core";

function createStore() {
  return makeAutoObservable({
    selectedRequest: ""
  });
}

const store = createStore();

export const RequestSummary: React.FunctionComponent = props => {
  return <RequestSummaryObservable props={props} />;
};

const RequestSummaryObservable = observer(({ props }) => {
  const { loading, error, data, fetchMore, refetch } = useQuery(
    RequestSummaryQueryDocument,
    {
      variables: {
        where: {
          igoRequestId_CONTAINS: props.selectedRequest
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

  function headerRenderer({ dataKey }) {
    return <TableCell>{dataKey}</TableCell>;
  }

  function cellRenderer({ cellData }) {
    return (
      <TableCell align="right" padding="normal">
        {cellData || ""}
      </TableCell>
    );
  }

  const remoteRowCount = data.requests[0].hasSampleSamplesConnection.totalCount;

  if (!props.selectedRequest) {
    return <Row />;
  }
  return (
    <Row style={{ marginTop: "20px" }}>
      <div>
        <h3>Displaying Request: {props.selectedRequest}</h3>
      </div>
      <InfiniteLoader
        isRowLoaded={isRowLoaded}
        loadMoreRows={params => {
          return loadMoreRows(params, fetchMore);
        }}
        rowCount={remoteRowCount}
      >
        {({ onRowsRendered, registerChild }) => (
          <Table
            className="table"
            style={{}}
            ref={registerChild}
            width={1100}
            height={270}
            headerHeight={50}
            rowHeight={40}
            rowCount={remoteRowCount}
            onRowsRendered={onRowsRendered}
            rowGetter={rowGetter}
          >
            {SampleDetailsColumns.map(col => {
              return (
                <Column
                  headerRenderer={headerRenderer}
                  cellRenderer={({
                    cellData,
                    columnIndex = null,
                    rowIndex
                  }) => {
                    return cellRenderer({ cellData });
                  }}
                  headerStyle={{ display: "inline-block" }}
                  style={{ display: "inline-block" }}
                  label={col.label}
                  dataKey={`${col.dataKey}`}
                  width={1100 / 8}
                />
              );
            })}
          </Table>
        )}
      </InfiniteLoader>
    </Row>
  );
});

export { RequestSummaryObservable };

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
