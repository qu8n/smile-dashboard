import { useQuery } from "@apollo/client";
import "./RecentDeliveries.css";
import {
  Request,
  RecentDeliveriesQueryDocument
} from "../../generated/graphql";
import { observer } from "mobx-react";
import { useEffect, useMemo } from "react";
import { makeAutoObservable, observable } from "mobx";
import { InfiniteLoader, Table, Column, AutoSizer } from "react-virtualized";
import { Container, Form, InputGroup } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { TableCell } from "@material-ui/core";

export const RecentDeliveriesPage: React.FunctionComponent = props => {
  return (
    <Container>
      <RecentDeliveriesObserverable />
    </Container>
  );
};

export default RecentDeliveriesPage;

function createStore() {
  return makeAutoObservable({
    filter: "",
    rowHeight: 0,
    loadedData: []
  });
}

const store = createStore();

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
                style={{ display: "inline-block" }}
                ref={registerChild}
                width={width}
                height={270}
                headerHeight={50}
                rowHeight={40}
                rowCount={remoteRowCount}
                onRowsRendered={onRowsRendered}
                rowGetter={rowGetter}
              >
                <Column
                  headerRenderer={({ dataKey }) => {
                    return (
                      <TableCell component="div" variant="head" height={50}>
                        {dataKey}
                      </TableCell>
                    );
                  }}
                  cellRenderer={({
                    cellData,
                    columnIndex = null,
                    rowIndex
                  }) => {
                    return (
                      <TableCell component="div" variant="body" height={50}>
                        {cellData || "loading"}
                      </TableCell>
                    );
                  }}
                  headerStyle={{ display: "inline-block", fontWeight: 500 }}
                  style={{ display: "inline-block" }}
                  label="IGO Request ID"
                  dataKey="igoRequestId"
                  width={width / 2}
                />

                <Column
                  headerRenderer={({ dataKey }) => {
                    return (
                      <TableCell component="div" variant="head">
                        {dataKey}
                      </TableCell>
                    );
                  }}
                  cellRenderer={({
                    cellData,
                    columnIndex = null,
                    rowIndex
                  }) => {
                    return (
                      <TableCell
                        component="div"
                        variant="body"
                        style={{ height: 50 }}
                        height={50}
                      >
                        {cellData || "loading"}
                      </TableCell>
                    );
                  }}
                  headerStyle={{ display: "inline-block" }}
                  style={{ display: "inline-block" }}
                  label="Project Manager Name"
                  dataKey="projectManagerName"
                  width={width / 2}
                />
              </Table>
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
      {/* </tbody>
      </table> */}
      {/* <RecentDeliveriesTable data={filteredRequests} /> */}
    </Container>
  );
});

const columns = [
  {
    selector: (d: Request) => d.igoRequestId,
    dataKey: "igoRequestId",
    headerName: "IGO RequestID",
    sortable: true,
    filterable: true,
    width: 50
  },
  {
    selector: (d: Request) => d.projectManagerName,
    dataKey: "projectManagerName",
    headerName: "Project Manager Name",
    sortable: true,
    filterable: true,
    width: 50
  }
];

const RecentDeliveriesColumns = [
  {
    priority: 1,
    selector: (d: Request) => d.igoRequestId,
    dataField: "igoRequestId",
    name: "IGO Request ID",
    sortable: true,
    filterable: true
  },
  {
    selector: (d: Request) => d.projectManagerName,
    dataField: "projectManagerName",
    name: "Project Manager Name",
    sortable: true,
    filterable: true
  }
];
