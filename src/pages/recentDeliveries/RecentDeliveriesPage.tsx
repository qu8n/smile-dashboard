import { useQuery } from "@apollo/client";
import { Edit } from "@material-ui/icons";
import "./RecentDeliveries.css";
import { RecentDeliveriesQueryDocument } from "../../generated/graphql";
import { observer } from "mobx-react-lite";
import { makeAutoObservable } from "mobx";
import { InfiniteLoader, Table, Column, AutoSizer } from "react-virtualized";
import {
  Badge,
  Button,
  Col,
  Container,
  Form,
  InputGroup,
  Row
} from "react-bootstrap";
import { RequestSummary } from "../requestView/RequestSummary";
import "react-virtualized/styles.css";
import React, { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import _ from "lodash";
import classNames from "classnames";

function createStore() {
  return makeAutoObservable({
    filter: "",
    selectedRequest: "",
    showRequestDetails: false
  });
}

const store = createStore();

export const RecentDeliveriesPage: React.FunctionComponent = props => {
  return <RecentDeliveriesObserverable />;
};

export default RecentDeliveriesPage;

const RecentDeliveriesObserverable = () => {
  const [val, setVal] = useState("");

  const [timeO, setTime0] = useState<any>(null);

  const [prom, setProm] = useState<any>(Promise.resolve());

  const navigate = useNavigate();
  const params = useParams();

  const filterField = "requestJson_CONTAINS";

  const { loading, error, data, refetch, fetchMore } = useQuery(
    RecentDeliveriesQueryDocument,
    {
      variables: {
        where: {
          [filterField]: store.filter
        },
        requestsConnectionWhere2: {
          [filterField]: store.filter
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
      filterable: true,
      width: 200
    },
    {
      dataKey: "investigatorName",
      label: "Investigator Name",
      sortable: true,
      filterable: true,
      width: 200
    },
    {
      dataKey: "investigatorEmail",
      label: "Investigator Email",
      sortable: true,
      filterable: true,
      width: 200
    },
    {
      dataKey: "dataAnalystName",
      label: "Data Analyst Name",
      sortable: true,
      filterable: true,
      width: 200
    },
    {
      dataKey: "dataAnalystEmail",
      label: "Data Analyst Email",
      sortable: true,
      filterable: true,
      width: 200
    },
    {
      dataKey: "genePanel",
      label: "Gene Panel",
      sortable: true,
      filterable: true
    }
  ];

  // notes:
  // form can go in another component
  // def put the table in another component (from infinite loader --> through table)
  // todo: sample-level detail editing mode (<path>/sampleId/edit <-- edit would indicate mode we're in)

  return (
    <Container fluid>
      <Row className="pagetitle">
        <Col>
          <h1>Requests</h1>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">Home</a>
              </li>
              <li className="breadcrumb-item active">
                <NavLink to={"/recentDeliveries"}>Requests</NavLink>
              </li>
              {params.requestId && (
                <li className="breadcrumb-item active">{params.requestId}</li>
              )}
            </ol>
          </nav>
        </Col>
      </Row>

      {params.requestId && (
        <Row>
          <RequestSummary props={params} />
        </Row>
      )}

      <Row
        className={classNames(
          "d-flex justify-content-between align-items-center",
          { "d-none": params.requestId }
        )}
      >
        <Col>
          <Form.Control
            style={{ width: "300px" }}
            type="search"
            placeholder="Search Requests"
            aria-label="Search"
            value={val}
            onInput={event => {
              const value = String(
                ((event.currentTarget as unknown) as HTMLInputElement).value
              );
              if (value !== null) {
                setVal(value);
              }

              if (timeO) {
                clearTimeout(timeO);
              }

              // there will always be a promise so
              // wait until it's resolved
              prom.then(() => {
                const to = setTimeout(() => {
                  const rf = refetch({
                    where: {
                      [filterField]: value
                    },
                    requestsConnectionWhere2: {
                      [filterField]: value
                    },
                    options: { limit: 20, offset: 0 }
                  });
                  setProm(rf);
                }, 500);
                setTime0(to);
              });
            }}
          />
        </Col>
        <Col className={"text-center"}>{remoteRowCount} matching requests</Col>
        <Col className={"text-end"}></Col>
      </Row>
      <Row className={classNames({ "d-none": params.requestId })}>
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
                        width={col.width || 100}
                      />
                    );
                  })}
                </Table>
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      </Row>
    </Container>
  );
};
