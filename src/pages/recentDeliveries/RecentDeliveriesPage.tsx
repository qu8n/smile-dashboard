import { useQuery } from "@apollo/client";
import "./RecentDeliveries.css";
import {
  Request,
  RecentDeliveriesQueryDocument
} from "../../generated/graphql";
import { observer } from "mobx-react";
import { makeAutoObservable } from "mobx";
import { InfiniteLoader, Table, Column, AutoSizer } from "react-virtualized";
import { Container, Form, InputGroup } from "react-bootstrap";
import { TableCell } from "@material-ui/core";

function createStore() {
  return makeAutoObservable({
    filter: "",
    rowHeight: 0,
    loadedData: []
  });
}

const store = createStore();

export const RecentDeliveriesPage: React.FunctionComponent = props => {
  return (
    <Container>
      <RecentDeliveriesObserverable />
    </Container>
  );
};

export default RecentDeliveriesPage;

const RecentDeliveriesObserverable = observer(() => {
  const { client, loading, error, data, refetch, fetchMore } = useQuery(
    RecentDeliveriesQueryDocument,
    {
      variables: {
        where: {
          igoRequestId_CONTAINS: store.filter
        },
        requestsConnectionWhere2: {
          igoRequestId_CONTAINS: store.filter
        },
        options: { limit: 20, offset: 0 }
      }
    }
  );

  if (loading) return <p>Loading requests...</p>;
  if (error) return <p>Error :(</p>;

  function loadMoreRows({ startIndex, stopIndex }, fetchMore: any) {
    return fetchMore({
      variables: {
        // where: {
        //   igoRequestId_CONTAINS: store.filter
        // },
        options: {
          offset: startIndex,
          limit: stopIndex
        }
      }
    });
  }

  function isRowLoaded({ index }) {
    return index < data.requests.length;
  }

  function rowGetter({ index }) {
    if (!data.requests[index]) {
      return "";
    }
    return data.requests[index];
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

  const remoteRowCount = data.requestsConnection.totalCount;

  return (
    <Container>
      <InputGroup>
        <Form className="d-flex">
          <Form.Group>
            <Form.Control
              type="search"
              placeholder="Search"
              aria-label="Search"
              onInput={event => {
                const value = String(
                  ((event.currentTarget as unknown) as HTMLInputElement).value
                );
                if (value !== null) {
                  store.filter = value;
                  refetch({
                    where: {
                      igoRequestId_CONTAINS: store.filter
                    },
                    requestsConnectionWhere2: {
                      igoRequestId_CONTAINS: store.filter
                    },
                    options: { limit: 20, offset: 0 }
                  });
                }
              }}
            />
          </Form.Group>
        </Form>
      </InputGroup>
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
                style={{ display: "inline-block", border: "none" }}
                ref={registerChild}
                width={width + 100}
                height={270}
                headerHeight={50}
                rowHeight={40}
                rowCount={remoteRowCount}
                onRowsRendered={onRowsRendered}
                rowGetter={rowGetter}
              >
                {RecentDeliveriesColumns.map(col => {
                  console.log("column ", col);
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
                      width={(width + 100) / 8}
                    />
                  );
                })}
              </Table>
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    </Container>
  );
});

const RecentDeliveriesColumns = [
  {
    selector: (d: Request) => d.igoRequestId,
    dataKey: "igoRequestId",
    label: "IGO Request ID",
    sortable: true,
    filterable: true
  },
  {
    selector: (d: Request) => d.igoProjectId,
    dataKey: "igoProjectId",
    label: "IGO Project ID",
    sortable: true,
    filterable: true
  },
  {
    selector: (d: Request) => d.projectManagerName,
    dataKey: "projectManagerName",
    label: "Project Manager Name",
    sortable: true,
    filterable: true
  },
  {
    selector: (d: Request) => d.investigatorName,
    dataKey: "investigatorName",
    label: "Investigator Name",
    sortable: true,
    filterable: true
  },
  {
    selector: (d: Request) => d.investigatorEmail,
    dataKey: "investigatorEmail",
    label: "Investigator Email",
    sortable: true,
    filterable: true
  },
  {
    selector: (d: Request) => d.dataAnalystName,
    dataKey: "dataAnalystName",
    label: "Data Analyst Name",
    sortable: true,
    filterable: true
  },
  {
    selector: (d: Request) => d.dataAnalystEmail,
    dataKey: "dataAnalystEmail",
    label: "Data Analyst Email",
    sortable: true,
    filterable: true
  },
  {
    selector: (d: Request) => d.genePanel,
    dataKey: "genePanel",
    label: "Gene Panel",
    sortable: true,
    filterable: true
  }
];
