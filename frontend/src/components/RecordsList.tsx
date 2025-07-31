import AutoSizer from "react-virtualized-auto-sizer";
import { Button, Container, Modal } from "react-bootstrap";
import { Dispatch, SetStateAction, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DownloadModal } from "./DownloadModal";
import {
  buildSentenceCaseString,
  buildTsvString,
} from "../utils/stringBuilders";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import styles from "./records.module.scss";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import { ColDef, IServerSideGetRowsParams } from "ag-grid-community";
import { DataName, useHookLazyGeneric } from "../shared/types";
import SamplesList from "./SamplesList";
import {
  DashboardRecordSort,
  DashboardSamplesQueryVariables,
  QueryDashboardCohortsArgs,
  QueryDashboardPatientsArgs,
  QueryDashboardRequestsArgs,
} from "../generated/graphql";
import {
  CACHE_BLOCK_SIZE,
  defaultColDef,
  getColumnFilters,
  IExportDropdownItem,
} from "../shared/helpers";
import { ErrorMessage, Toolbar } from "../shared/components/Toolbar";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { BreadCrumb } from "../shared/components/BreadCrumb";
import { Title } from "../shared/components/Title";
import { parseUserSearchVal } from "../utils/parseSearchQueries";

interface IRecordsListProps {
  columnDefs: ColDef[];
  dataName: DataName;
  useRecordsLazyQuery: typeof useHookLazyGeneric;
  phiEnabled?: boolean;
  defaultSort: DashboardRecordSort;
  userSearchVal: string;
  setUserSearchVal: Dispatch<SetStateAction<string>>;
  showDownloadModal: boolean;
  setShowDownloadModal: Dispatch<SetStateAction<boolean>>;
  handleDownload: () => void;
  samplesColDefs: ColDef[];
  sampleContexts?: DashboardSamplesQueryVariables["contexts"];
  userEmail: string | null;
  setUserEmail: Dispatch<SetStateAction<string | null>>;
  customToolbarUI?: JSX.Element;
  addlExportDropdownItems?: IExportDropdownItem[];
}

export default function RecordsList({
  columnDefs,
  dataName,
  useRecordsLazyQuery,
  phiEnabled = false,
  defaultSort,
  userSearchVal,
  setUserSearchVal,
  showDownloadModal,
  setShowDownloadModal,
  handleDownload,
  samplesColDefs,
  sampleContexts,
  userEmail,
  setUserEmail,
  customToolbarUI,
  addlExportDropdownItems,
}: IRecordsListProps) {
  const [showClosingWarning, setShowClosingWarning] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [, setColumnDefsForExport] = useState<ColDef[]>(columnDefs);
  const [selectedExportItem, setSelectedExportItem] =
    useState<IExportDropdownItem | null>(null);

  const gridRef = useRef<AgGridReactType>(null);
  const navigate = useNavigate();
  const params = useParams();

  const [, { error, data, fetchMore, refetch }] = useRecordsLazyQuery({
    variables: {
      searchVals: [],
      sort: defaultSort,
      limit: CACHE_BLOCK_SIZE,
      offset: 0,
      phiEnabled,
    },
  });

  const dataNameCapitalized = buildSentenceCaseString(dataName);
  const recordsQueryName = `dashboard${dataNameCapitalized}`;
  const recordCount = data?.[recordsQueryName][0]?._total || 0;
  const uniqueSampleCount =
    data?.[recordsQueryName][0]?._uniqueSampleCount || 0;

  const getServerSideDatasource = useCallback(
    ({ searchVals }) => {
      return {
        getRows: async (params: IServerSideGetRowsParams) => {
          const fetchInput = {
            searchVals,
            sort: params.request.sortModel[0] || defaultSort,
            columnFilters: getColumnFilters(params),
            offset: params.request.startRow ?? 0,
            limit: CACHE_BLOCK_SIZE,
          } as
            | QueryDashboardRequestsArgs
            | QueryDashboardPatientsArgs
            | QueryDashboardCohortsArgs;

          const thisFetch =
            params.request.startRow === 0
              ? refetch(fetchInput)
              : fetchMore({
                  variables: fetchInput,
                });

          return thisFetch
            .then((result) => {
              params.success({
                rowData: result.data[recordsQueryName],
                rowCount: result.data?.[recordsQueryName][0]?._total || 0,
              });
            })
            .catch((error) => {
              console.error(error);
              params.fail();
            });
        },
      };
    },
    [defaultSort, refetch, fetchMore, recordsQueryName]
  );

  async function refreshData(userSearchVal: string) {
    const searchVals = parseUserSearchVal(userSearchVal);
    const newDatasource = getServerSideDatasource({ searchVals });
    gridRef.current?.api.setServerSideDatasource(newDatasource); // triggers a refresh
  }

  if (error) return <ErrorMessage error={error} />;

  const handleClose = () => {
    if (unsavedChanges) {
      setShowClosingWarning(true);
    } else {
      navigate(`/${dataName}`);
    }
  };

  async function getExportLoader() {
    if (selectedExportItem && selectedExportItem.customLoader) {
      const data = await selectedExportItem.customLoader!();
      return buildTsvString(
        data,
        selectedExportItem.columnDefs,
        gridRef.current?.columnApi?.getAllGridColumns()
      );
    }
    const { data } = await fetchMore({
      variables: {
        searchVals: parseUserSearchVal(userSearchVal),
        offset: 0,
        limit: recordCount,
      },
    });
    return buildTsvString(
      data[recordsQueryName],
      columnDefs,
      gridRef.current?.columnApi?.getAllGridColumns()
    );
  }

  return (
    <Container fluid>
      <BreadCrumb currPageTitle={dataName} />
      <Title text={dataName} />

      {showDownloadModal && (
        <DownloadModal
          loader={getExportLoader}
          onComplete={() => {
            setShowDownloadModal(false);
            setColumnDefsForExport(columnDefs);
            setSelectedExportItem(null);
          }}
          exportFileName={`${dataName}.tsv`}
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
                navigate(`/${dataName}`);
              }}
            >
              Continue Exiting
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      {Object.keys(params).length !== 0 && (
        <AutoSizer>
          {({ height, width }) => (
            <Modal show={true} dialogClassName="modal-90w" onHide={handleClose}>
              <Modal.Header closeButton />
              <Modal.Body>
                <div className={styles.popupHeight}>
                  <SamplesList
                    columnDefs={samplesColDefs}
                    parentDataName={dataName}
                    sampleContexts={sampleContexts}
                    setUnsavedChanges={setUnsavedChanges}
                    userEmail={userEmail}
                    setUserEmail={setUserEmail}
                  />
                </div>
              </Modal.Body>
            </Modal>
          )}
        </AutoSizer>
      )}

      <Toolbar
        dataName={dataName}
        userSearchVal={userSearchVal}
        setUserSearchVal={setUserSearchVal}
        onSearch={async (userSearchVal) => refreshData(userSearchVal)}
        matchingResultsCount={`${
          recordCount !== undefined ? recordCount?.toLocaleString() : "Loading"
        } matching ${dataName} ${
          uniqueSampleCount
            ? `(${uniqueSampleCount.toLocaleString()} unique samples)`
            : ""
        }`}
        onDownload={() => handleDownload()}
        customUIRight={customToolbarUI}
        addlExportDropdownItems={addlExportDropdownItems}
        setColumnDefsForExport={setColumnDefsForExport}
        setSelectedExportItem={setSelectedExportItem}
      />

      <AutoSizer>
        {({ width }) => (
          <div
            className={`ag-theme-alpine ${styles.tableHeight}`}
            style={{ width: width }}
          >
            <AgGridReact
              ref={gridRef}
              rowModelType="serverSide"
              serverSideInfiniteScroll={true}
              cacheBlockSize={CACHE_BLOCK_SIZE}
              columnDefs={columnDefs}
              defaultColDef={defaultColDef}
              enableRangeSelection={true}
              onGridReady={(params) => params.api.sizeColumnsToFit()}
              onFirstDataRendered={(params) =>
                params.columnApi.autoSizeAllColumns()
              }
              onGridColumnsChanged={() => refreshData(userSearchVal)}
              context={{
                navigateFunction: navigate,
              }}
              debug={false}
            />
          </div>
        )}
      </AutoSizer>
    </Container>
  );
}
