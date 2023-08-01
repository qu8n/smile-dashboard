import AutoSizer from "react-virtualized-auto-sizer";
import { Button, Col, Container, Form, Row, Modal } from "react-bootstrap";
import React, { FunctionComponent, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import classNames from "classnames";
import { DownloadModal } from "./DownloadModal";
import Spinner from "react-spinkit";
import { CSVFormulate } from "../lib/CSVExport";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import styles from "./records.module.scss";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { ColDef, IServerSideGetRowsParams } from "ag-grid-community";
import { useHookGeneric } from "../shared/types";
import { SamplesList } from "./SamplesList";
import { SampleWhere } from "../generated/graphql";
import { defaultRecordsColDef } from "../shared/helpers";
import InfoIcon from "@material-ui/icons/InfoOutlined";
import { Tooltip } from "@material-ui/core";

export interface IRecordsListProps {
  lazyRecordsQuery: typeof useHookGeneric;
  nodeName: string;
  totalCountNodeName: string;
  pageRoute: string;
  searchTerm: string;
  colDefs: ColDef[];
  conditionBuilder: (val: string) => Record<string, any>[];
  sampleQueryParamValue: string | undefined;
  sampleQueryParamFieldName: string;
  searchVariables: SampleWhere;
}

const RecordsList: FunctionComponent<IRecordsListProps> = ({
  lazyRecordsQuery,
  nodeName,
  totalCountNodeName,
  pageRoute,
  searchTerm,
  colDefs,
  conditionBuilder,
  sampleQueryParamValue,
  sampleQueryParamFieldName,
  searchVariables,
}) => {
  const [val, setVal] = useState("");
  const [searchVal, setSearchVal] = useState("");
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [showClosingWarning, setShowClosingWarning] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const navigate = useNavigate();

  // note that we aren't using initial fetch
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [initialFetch, { loading, error, data, fetchMore, refetch }] =
    lazyRecordsQuery({
      variables: {
        options: { limit: 20, offset: 0 },
      },
    });

  const datasource = useMemo(() => {
    return {
      // called by the grid when more rows are required
      getRows: (params: IServerSideGetRowsParams) => {
        const fetchInput = {
          where: {
            OR: conditionBuilder(searchVal),
          },
          [`${nodeName}ConnectionWhere2`]: {
            OR: conditionBuilder(searchVal),
          },
          options: {
            offset: params.request.startRow,
            limit: params.request.endRow,
            sort: params.request.sortModel.map((sortModel) => {
              return { [sortModel.colId]: sortModel.sort?.toUpperCase() };
            }),
          },
        };

        // if this is NOT first call, use refetch
        // (which is analogous in this case to the original fetch)
        const thisFetch =
          params.request.startRow! === 0
            ? refetch(fetchInput)
            : fetchMore({
                variables: fetchInput,
              });

        return thisFetch.then((d: any) => {
          params.success({
            rowData: d.data[nodeName],
            rowCount: d.data?.[totalCountNodeName]?.totalCount,
          });
        });
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchVal]);

  if (loading)
    return (
      <div className={"centralSpinner"}>
        <Spinner fadeIn={"none"} color={"lightblue"} name="ball-grid-pulse" />
      </div>
    );

  if (error) return <p>Error :(</p>;

  const remoteCount = data?.[totalCountNodeName]?.totalCount;

  const handleClose = () => {
    if (unsavedChanges) {
      setShowClosingWarning(true);
    } else {
      navigate(pageRoute);
    }
  };

  return (
    <Container fluid>
      {showDownloadModal && (
        <DownloadModal
          loader={() => {
            return fetchMore({
              variables: {
                where: {
                  OR: conditionBuilder(val),
                },
                options: {
                  offset: 0,
                  limit: undefined,
                },
              },
            }).then(({ data }: any) => {
              return CSVFormulate(data[nodeName], colDefs);
            });
          }}
          onComplete={() => setShowDownloadModal(false)}
          exportFileName={`${nodeName}.tsv`}
        />
      )}

      {showClosingWarning && (
        <Modal
          show={true}
          centered
          onHide={() => setShowClosingWarning(false)}
          className={styles.overlay}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              Are you sure?
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              You have unsaved changes. Are you sure you want to exit this view?
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button
              className={"btn btn-secondary"}
              onClick={() => setShowClosingWarning(false)}
            >
              Cancel
            </Button>
            <Button
              className={"btn btn-danger"}
              onClick={() => {
                setShowClosingWarning(false);
                setUnsavedChanges(false);
                navigate(pageRoute);
              }}
            >
              Continue Exiting
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {sampleQueryParamValue && (
        <AutoSizer>
          {({ height, width }) => (
            <Modal show={true} dialogClassName="modal-90w" onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{`Viewing ${sampleQueryParamValue}`}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div style={{ height: 600 }}>
                  <SamplesList
                    height={height * 11}
                    searchVariables={searchVariables}
                    setUnsavedChanges={setUnsavedChanges}
                    exportFileName={`${sampleQueryParamFieldName}_${sampleQueryParamValue}.tsv`}
                    sampleQueryParamFieldName={sampleQueryParamFieldName}
                    sampleQueryParamValue={sampleQueryParamValue}
                  />
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

        <Col md="auto">
          <Form.Control
            className={"d-inline-block"}
            style={{ width: "300px" }}
            type="search"
            placeholder={"Search " + searchTerm}
            aria-label="Search"
            defaultValue={val}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                setSearchVal(val);
              }
            }}
            onInput={(event) => {
              const newVal = event.currentTarget.value;
              if (newVal === "") {
                setSearchVal("");
              }
              setVal(newVal);
            }}
          />
        </Col>

        <Col md="auto" style={{ marginLeft: -15 }}>
          <Tooltip
            title={
              <span style={{ fontSize: 12 }}>
                After inputting your search query, click on &quot;Search&quot;
                or press &quot;Enter&quot; to get your results. To bulk search,
                input a list of values separated by spaces or commas (e.g.
                &quot;value1 value2 value3&quot;)
              </span>
            }
          >
            <InfoIcon style={{ fontSize: 18, color: "grey" }} />
          </Tooltip>
        </Col>

        <Col md="auto" style={{ marginLeft: -15 }}>
          <Button
            onClick={() => {
              setSearchVal(val);
            }}
            className={"btn btn-secondary"}
            size={"sm"}
          >
            Search
          </Button>
        </Col>

        <Col md="auto">
          {remoteCount?.toLocaleString()} matching{" "}
          {remoteCount > 1 ? searchTerm : searchTerm.slice(0, -1)}
        </Col>

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
              columnDefs={colDefs}
              serverSideDatasource={datasource}
              serverSideInfiniteScroll={true}
              cacheBlockSize={20}
              debug={false}
              context={{
                navigateFunction: navigate,
              }}
              defaultColDef={defaultRecordsColDef}
              onGridReady={(params) => {
                params.api.sizeColumnsToFit();
              }}
              onFirstDataRendered={(params) => {
                params.columnApi.autoSizeAllColumns();
              }}
              enableRangeSelection={true}
            />
          </div>
        )}
      </AutoSizer>
    </Container>
  );
};

export default RecordsList;
