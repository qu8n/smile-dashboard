import { useQuery } from "@apollo/client";
import { Edit } from "@material-ui/icons";
import "./RecentDeliveries.css";
import { RecentDeliveriesQueryDocument } from "../../generated/graphql";
import { observer } from "mobx-react";
import { makeAutoObservable } from "mobx";
import { InfiniteLoader, Table, Column, AutoSizer } from "react-virtualized";
import { Button, Col, Container, Form, InputGroup, Row } from "react-bootstrap";
import { RequestSummary } from "../requestView/RequestSummary";
import "react-virtualized/styles.css";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function createStore() {
  return makeAutoObservable({
    filter: "",
    selectedRequest: "",
    showRequestDetails: false
  });
}

const store = createStore();

export const RecentDeliveriesPage: React.FunctionComponent = props => {
  return (
    <Container
      style={{
        marginBottom: "20px",
        marginTop: "20px"
      }}
    >
      <RecentDeliveriesObserverable />
    </Container>
  );
};

export default RecentDeliveriesPage;

const RecentDeliveriesObserverable = () => {
  const [val, setVal] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  const { loading, error, data, refetch, fetchMore } = useQuery(
    RecentDeliveriesQueryDocument,
    {
      variables: {
        where: {
          requestJson_CONTAINS: store.filter
        },
        requestsConnectionWhere2: {
          requestJson_CONTAINS: store.filter
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

  function onRowClick(info) {
    console.log(info.rowData.igoRequestId);
    store.selectedRequest = info.rowData.igoRequestId;
    store.showRequestDetails = true;
  }

  const remoteRowCount = data.requestsConnection.totalCount;
  // notes: cellrenderer gets rowData (sample properties)
  // todo: add prop that we can call setState for to put us in "editing mode"
  const RecentDeliveriesColumns = [
    {
      headerRender: () => {
        return <Edit />;
      },
      cellRenderer: arg => {
        return (
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={() => {
              navigate("./" + arg.rowData.igoRequestId);
            }}
          >
            Edit
          </Button>
        );
      }
    },
    {
      dataKey: "igoRequestId",
      label: "IGO Request ID",
      sortable: true,
      filterable: true
    },
    {
      dataKey: "igoProjectId",
      label: "IGO Project ID",
      sortable: true,
      filterable: true
    },
    {
      dataKey: "projectManagerName",
      label: "Project Manager Name",
      sortable: true,
      filterable: true
    },
    {
      dataKey: "investigatorName",
      label: "Investigator Name",
      sortable: true,
      filterable: true
    },
    {
      dataKey: "investigatorEmail",
      label: "Investigator Email",
      sortable: true,
      filterable: true
    },
    {
      dataKey: "dataAnalystName",
      label: "Data Analyst Name",
      sortable: true,
      filterable: true
    },
    {
      dataKey: "dataAnalystEmail",
      label: "Data Analyst Email",
      sortable: true,
      filterable: true
    },
    {
      dataKey: "genePanel",
      label: "Gene Panel",
      sortable: true,
      filterable: true
    }
  ];

  // this is control logic
  if (params.requestId) {
    return <RequestSummary props={params} />;
  }

  // notes:
  // form can go in another component
  // def put the table in another component (from infinite loader --> through table)
  // todo: sample-level detail editing mode (<path>/sampleId/edit <-- edit would indicate mode we're in)

  return (
    <Row
      id="recentDeliveriesRow"
      style={{ flexDirection: "column", display: "flex" }}
    >
      <InputGroup>
        <Form>
          <Form.Group as={Col}>
            <Form.Control
              style={{ height: "40px", width: "300px" }}
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={val}
              onInput={event => {
                const value = String(
                  ((event.currentTarget as unknown) as HTMLInputElement).value
                );
                if (value !== null) {
                  setVal(value);
                }
              }}
            />
          </Form.Group>
        </Form>
        <Button
          style={{ height: "40px", width: "80px" }}
          variant="primary"
          size="sm"
          onClick={() => {
            refetch({
              where: {
                requestJson_CONTAINS: val
              },
              requestsConnectionWhere2: {
                requestJson_CONTAINS: val
              },
              options: { limit: 20, offset: 0 }
            });
          }}
        >
          Filter
        </Button>
      </InputGroup>
      <hr />
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
                height={540}
                headerHeight={60}
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
                      headerRenderer={col.headerRender}
                      label={col.label}
                      dataKey={`${col.dataKey}`}
                      cellRenderer={col.cellRenderer}
                      width={width / RecentDeliveriesColumns.length}
                    />
                  );
                })}
              </Table>
            )}
          </AutoSizer>
        )}
      </InfiniteLoader>
    </Row>
  );
};
