import { useQuery } from "@apollo/client";
import "./RecentDeliveries.css";
import {
  Request,
  RecentDeliveriesQueryDocument
} from "../../generated/graphql";
import { observer } from "mobx-react";
import { makeAutoObservable } from "mobx";
import { InfiniteLoader, Table, Column } from "react-virtualized";
import { Container, Form, InputGroup, Row } from "react-bootstrap";
import { TableCell } from "@material-ui/core";
import { RequestSummaryObservable } from "../requestView/RequestSummary";

function createStore() {
  return makeAutoObservable({
    filter: "",
    selectedRequest: "",
    showRequestDetails: false
  });
}

const store = createStore();

export const RecentDeliveriesPage: React.FunctionComponent = props => {
  function requestDetailsComponent() {
    console.log("selectedRequest=", store.selectedRequest);
    if (store.showRequestDetails) {
      return (
        <Row style={{ flexDirection: "column", display: "flex" }}>
          select request to render component
        </Row>
      );
    } else {
      return <RequestSummaryObservable props={store} />;
    }
  }
  console.log(store);
  return (
    <Container style={{ marginBottom: "80px", marginTop: "80px" }}>
      <RecentDeliveriesObserverable />
      <hr />
      {requestDetailsComponent()}
    </Container>
  );
};

export default RecentDeliveriesPage;

const RecentDeliveriesObserverable = observer(() => {
  const { loading, error, data, refetch, fetchMore } = useQuery(
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

  function onRowClick(info) {
    console.log(info.rowData.igoRequestId);
    store.selectedRequest = info.rowData.igoRequestId;
    store.showRequestDetails = true;
    console.log("onRowClick(), selectedRequest = ", store.selectedRequest);
  }

  const remoteRowCount = data.requestsConnection.totalCount;

  return (
    <Row style={{}}>
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
            onRowClick={onRowClick}
            onRowDoubleClick={info => {
              store.showRequestDetails = false;
            }}
          >
            {RecentDeliveriesColumns.map(col => {
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
