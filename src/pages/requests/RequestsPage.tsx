import "./requests.scss";
import { useRequestsListQuery } from "../../generated/graphql";
import { makeAutoObservable } from "mobx";
import { InfiniteLoader, Table, Column, AutoSizer } from "react-virtualized";
import { Button, Col, Container, Form, Row, Modal } from "react-bootstrap";
import "react-virtualized/styles.css";
import React, { useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import _ from "lodash";
import classNames from "classnames";
import { buildRequestTableColumns, StaticTableColumns } from "./helpers";
import { RequestSummary } from "./RequestSummary";
import { DownloadModal } from "../../components/DownloadModal";
import Spinner from "react-spinkit";
import { CSVFormulate } from "../../lib/CSVExport";

function createStore() {
  return makeAutoObservable({
    filter: "",
    selectedRequest: "",
    showRequestDetails: false
  });
}

const store = createStore();

export const RequestsPage: React.FunctionComponent = props => {
  return <Requests />;
};

export default RequestsPage;

const Requests = () => {
  const [val, setVal] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<any>(null);
  const [prom, setProm] = useState<any>(Promise.resolve());
  const navigate = useNavigate();
  const params = useParams();

  const RequestTableColumns = buildRequestTableColumns(navigate);

  const filterField = "requestJson_CONTAINS";

  const { loading, error, data, refetch, fetchMore } = useRequestsListQuery({
    variables: {
      where: {
        [filterField]: store.filter
      },
      requestsConnectionWhere2: {
        [filterField]: store.filter
      },
      options: { limit: 20, offset: 0 }
    }
  });

  if (loading)
    return (
      <div className={"centralSpinner"}>
        <Spinner fadeIn={"none"} color={"lightblue"} name="ball-grid-pulse" />
      </div>
    );

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

  function loadAllRows(fetchMore: any, filter: string) {
    return () => {
      return fetchMore({
        variables: {
          where: {
            [filterField]: filter
          },
          options: {
            offset: 0,
            limit: undefined
          }
        }
      });
    };
  }

  function isRowLoaded({ index }) {
    return index < data!.requests.length;
  }

  function rowGetter({ index }) {
    if (!data!.requests[index]) {
      return "";
    }
    return data!.requests[index];
  }

  function onRowClick(info) {
    store.selectedRequest = info.rowData.igoRequestId;
    store.showRequestDetails = true;
  }

  const title = params.requestId
    ? `Viewing Request ${params.requestId}`
    : "Requests";

  const remoteCount = data!.requestsConnection.totalCount;

  return (
    <Container fluid>
      {showDownloadModal && (
        <DownloadModal
          loader={() => {
            return loadAllRows(fetchMore, val)().then(({ data }) => {
              return CSVFormulate(data.requests, StaticTableColumns);
            });
          }}
          onComplete={() => setShowDownloadModal(false)}
        />
      )}

      <Row className="pagetitle">
        <Col>
          <nav>
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/">Home</a>
              </li>
              <li className="breadcrumb-item active">
                <NavLink to={"/requests"}>Requests</NavLink>
              </li>
              {params.requestId && (
                <li className="breadcrumb-item active">{params.requestId}</li>
              )}
            </ol>
          </nav>
          <h1>{title}</h1>
        </Col>
      </Row>

      {params.requestId && (
        <Modal
          show={true}
          dialogClassName="modal-90w"
          onHide={() => navigate("/requests")}
        >
          <Modal.Header closeButton>
            <Modal.Title>Viewing {params.requestId}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <RequestSummary props={params} />
            </div>
          </Modal.Body>
        </Modal>
      )}

      <Row
        className={classNames(
          "d-flex justify-content-between align-items-center"
        )}
      >
        <Col></Col>
        <Col className={"text-end"}>
          <Form.Control
            className={"d-inline-block"}
            style={{ width: "300px" }}
            type="search"
            placeholder="Search Requests"
            aria-label="Search"
            value={val}
            onInput={event => {
              const value = event.currentTarget.value;

              if (value !== null) {
                setVal(value);
              }

              if (typingTimeout) {
                clearTimeout(typingTimeout);
              }

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
                setTypingTimeout(to);
              });
            }}
          />
        </Col>

        <Col className={"text-start"}>{remoteCount} matching requests</Col>

        <Col className={"text-end"}>
          <Button
            onClick={() => {
              setShowDownloadModal(true);
            }}
          >
            Generate Report
          </Button>
        </Col>
      </Row>

      <Row>
        <InfiniteLoader
          isRowLoaded={isRowLoaded}
          loadMoreRows={params => {
            return loadMoreRows(params, fetchMore);
          }}
          rowCount={remoteCount}
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
                  rowCount={remoteCount}
                  onRowsRendered={onRowsRendered}
                  rowGetter={rowGetter}
                  onRowClick={onRowClick}
                  onRowDoubleClick={info => {
                    store.showRequestDetails = false;
                  }}
                >
                  {RequestTableColumns.map(col => {
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
