import "./requests.scss";
import { useRequestsListLazyQuery } from "../../generated/graphql";
import { makeAutoObservable } from "mobx";
import AutoSizer from "react-virtualized-auto-sizer";
import { Button, Col, Container, Form, Row, Modal } from "react-bootstrap";
import React, { FunctionComponent, useEffect, useMemo } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import classNames from "classnames";
import { buildRequestTableColumns, RequestsListColumns } from "./helpers";
import { RequestSamples } from "./RequestSamples";
import { DownloadModal } from "../../components/DownloadModal";
import Spinner from "react-spinkit";
import { CSVFormulate } from "../../lib/CSVExport";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { IServerSideGetRowsParams } from "ag-grid-community";

function requestFilterWhereVariables(value: string) {
  return [
    { igoProjectId_CONTAINS: value },
    { igoRequestId_CONTAINS: value },
    { genePanel_CONTAINS: value },
    { dataAnalystEmail_CONTAINS: value },
    { dataAnalystName_CONTAINS: value },
    { investigatorEmail_CONTAINS: value },
    { investigatorName_CONTAINS: value },
    { labHeadEmail_CONTAINS: value },
    { libraryType_CONTAINS: value },
    { labHeadName_CONTAINS: value },
    { namespace_CONTAINS: value },
    { piEmail_CONTAINS: value },
    { otherContactEmails_CONTAINS: value },
    { projectManagerName_CONTAINS: value },
    { qcAccessEmails_CONTAINS: value }
  ];
}

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

const createDatasource = (refetch: any, fetchMore: any, val: string) => {
  return {
    // called by the grid when more rows are required

    getRows: (params: IServerSideGetRowsParams) => {
      const fetchInput = {
        where: {
          OR: requestFilterWhereVariables(val)
        },
        requestsConnectionWhere2: {
          OR: requestFilterWhereVariables(val)
        },
        options: {
          offset: params.request.startRow,
          limit: params.request.endRow,
          sort: params.request.sortModel.map((sortModel: any) => {
            return { [sortModel.colId]: sortModel.sort?.toUpperCase() };
          })
        }
      };

      // if this is NOT first call, use refetch
      // (which is analogous in this case to the original fetch
      const thisFetch =
        params.request.startRow! === 0
          ? refetch(fetchInput).then((d: any) => {
              params.success({
                rowData: d.data.requests,
                rowCount: d.data.requestsConnection.totalCount
              });
            })
          : fetchMore({
              variables: fetchInput
            });

      return thisFetch.then((d: any) => {
        params.success({
          rowData: d.data.requests,
          rowCount: d.data.requestsConnection.totalCount
        });
      });
    }
  };
};

const Requests: FunctionComponent = () => {
  const [val, setVal] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<any>(null);
  const [prom, setProm] = useState<any>(Promise.resolve());
  const navigate = useNavigate();
  const params = useParams();

  // not we aren't using initial fetch
  const [
    initialFetch,
    { loading, error, data, fetchMore, refetch }
  ] = useRequestsListLazyQuery({
    variables: {
      options: { limit: 20, offset: 0 }
    }
  });

  const datasource = useMemo(() => createDatasource(refetch, fetchMore, val), [
    val
  ]);

  if (loading)
    return (
      <div className={"centralSpinner"}>
        <Spinner fadeIn={"none"} color={"lightblue"} name="ball-grid-pulse" />
      </div>
    );

  if (error) return <p>Error :(</p>;

  const title = params.requestId
    ? `Viewing Request ${params.requestId}`
    : "Requests";

  const remoteCount = data?.requestsConnection.totalCount;

  return (
    <Container fluid>
      {showDownloadModal && (
        <DownloadModal
          loader={() => {
            return fetchMore({
              variables: {
                where: {
                  OR: requestFilterWhereVariables(val)
                },
                options: {
                  offset: 0,
                  limit: undefined
                }
              }
            }).then(({ data }) => {
              return CSVFormulate(data.requests, RequestsListColumns);
            });
          }}
          onComplete={() => setShowDownloadModal(false)}
          exportFilename={"requests.tsv"}
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
        <AutoSizer>
          {({ height, width }) => (
            <Modal
              show={true}
              dialogClassName="modal-90w"
              onHide={() => navigate("/requests")}
            >
              <Modal.Header closeButton>
                <Modal.Title>Viewing {params.requestId}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div style={{ height: height * 4 }}>
                  <RequestSamples height={height * 4 - 50} params={params} />
                </div>
              </Modal.Body>
            </Modal>
          )}
        </AutoSizer>
      )}

      <Row
        className={classNames(
          "d-flex justify-content-between align-items-center",
          "tableControlsRow"
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
            defaultValue={val}
            onInput={event => {
              const value = event.currentTarget.value;

              if (typingTimeout) {
                clearTimeout(typingTimeout);
              }

              const to = setTimeout(() => {
                setVal(value);
              }, 500);
              setTypingTimeout(to);
            }}
          />
        </Col>

        <Col className={"text-start"}>{remoteCount} matching requests</Col>

        <Col className={"text-end"}>
          <Button
            onClick={() => {
              setShowDownloadModal(true);
            }}
            size={"sm"}
          >
            Generate Report
          </Button>
        </Col>
      </Row>
      <AutoSizer>
        {({ width }) => (
          <div
            className="ag-theme-alpine"
            style={{ height: 540, width: width }}
          >
            <AgGridReact
              rowModelType={"serverSide"}
              columnDefs={buildRequestTableColumns(navigate)}
              serverSideDatasource={datasource}
              serverSideInfiniteScroll={true}
              cacheBlockSize={20}
              debug={true}
            />
          </div>
        )}
      </AutoSizer>
    </Container>
  );
};
