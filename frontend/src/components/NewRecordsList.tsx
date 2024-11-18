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
import SamplesList, { SampleContext } from "./SamplesList";
import {
  DashboardRecordFilter,
  DashboardRecordSort,
  PatientIdsTriplet,
  QueryDashboardCohortsArgs,
  QueryDashboardPatientsArgs,
  QueryDashboardRequestsArgs,
} from "../generated/graphql";
import { defaultColDef } from "../shared/helpers";
import { ErrorMessage, Toolbar } from "../shared/tableElements";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { BreadCrumb } from "../shared/components/BreadCrumb";
import { Title } from "../shared/components/Title";
import { parseUserSearchVal } from "../utils/parseSearchQueries";

const CACHE_BLOCK_SIZE = 100; // number of rows to fetch at a time
const MAX_ROWS_EXPORT = 10000;

interface INewRecordsListProps {
  columnDefs: ColDef[];
  dataName: DataName;
  enableInfiniteScroll?: boolean;
  lazyRecordsQuery: typeof useHookLazyGeneric;
  defaultSort: DashboardRecordSort;
  userSearchVal: string;
  setUserSearchVal: Dispatch<SetStateAction<string>>;
  setCustomSearchStates?: Dispatch<SetStateAction<PatientIdsTriplet[]>>;
  searchInterceptor?: (userSearchVal: string) => Promise<string[]>;
  showDownloadModal: boolean;
  setShowDownloadModal: Dispatch<SetStateAction<boolean>>;
  handleDownload: (recordCount: number) => void;
  samplesColDefs: ColDef[];
  sampleContext?: SampleContext;
  userEmail?: string | null;
  setUserEmail?: Dispatch<SetStateAction<string | null>>;
  customToolbarUI?: JSX.Element;
}

export default function NewRecordsList({
  columnDefs,
  dataName,
  enableInfiniteScroll = true,
  lazyRecordsQuery,
  defaultSort,
  userSearchVal,
  setUserSearchVal,
  setCustomSearchStates,
  searchInterceptor,
  showDownloadModal,
  setShowDownloadModal,
  handleDownload,
  samplesColDefs,
  sampleContext,
  userEmail,
  setUserEmail,
  customToolbarUI,
}: INewRecordsListProps) {
  const [showClosingWarning, setShowClosingWarning] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const gridRef = useRef<AgGridReactType>(null);
  const navigate = useNavigate();
  const params = useParams();

  const [, { error, data, fetchMore, refetch }] = lazyRecordsQuery({
    variables: {
      searchVals: [],
      sort: defaultSort,
      limit: CACHE_BLOCK_SIZE,
      offset: 0,
    },
  });

  const dataNameCapitalized = buildSentenceCaseString(dataName);
  const recordsQueryName = `dashboard${dataNameCapitalized}`;
  const recordCountQueryName = `dashboard${dataNameCapitalized.slice(
    0,
    -1
  )}Count`;
  const recordCount = data?.[recordCountQueryName]?.totalCount;

  const getServerSideDatasource = useCallback(
    ({ searchVals }) => {
      return {
        getRows: async (params: IServerSideGetRowsParams) => {
          let filters: DashboardRecordFilter[] | undefined;
          const filterModel = params.request.filterModel;
          if (filterModel && Object.keys(filterModel).length > 0) {
            filters = Object.entries(filterModel).map(([key, value]) => ({
              field: key,
              // Flexibly handle AG Grid's `any` type for filter settings by JSON.parse() this string value,
              // then check the field name before consuming it at the GraphQL server (see https://stackoverflow.com/a/45601881)
              filter: JSON.stringify(value),
            }));
          } else {
            filters = undefined; // all filter values are selected
          }

          const fetchInput = {
            searchVals,
            sort: params.request.sortModel[0] || defaultSort,
            filters,
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
                rowCount: result.data[recordCountQueryName].totalCount,
              });
            })
            .catch((error) => {
              console.error(error);
              params.fail();
            });
        },
      };
    },
    [defaultSort, refetch, fetchMore, recordsQueryName, recordCountQueryName]
  );

  async function refreshData(userSearchVal: string) {
    const extraSearchVals = searchInterceptor
      ? await searchInterceptor(userSearchVal)
      : [];
    const searchVals = [
      ...parseUserSearchVal(userSearchVal),
      ...extraSearchVals,
    ];
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

  return (
    <Container fluid>
      <BreadCrumb currPageTitle={dataName} />
      <Title text={dataName} />

      {showDownloadModal && (
        <DownloadModal
          loader={async () => {
            // Using fetchMore instead of refetch to avoid overriding the cached variables
            const { data } = await fetchMore({
              variables: {
                offset: 0,
                limit: MAX_ROWS_EXPORT,
              },
            });
            return buildTsvString(
              data[recordsQueryName],
              columnDefs,
              gridRef.current?.columnApi?.getAllGridColumns()
            );
          }}
          onComplete={() => setShowDownloadModal(false)}
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
                    sampleContext={sampleContext}
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
        setCustomSearchStates={setCustomSearchStates}
        onSearch={async (userSearchVal) => refreshData(userSearchVal)}
        matchingResultsCount={`${
          recordCount !== undefined ? recordCount.toLocaleString() : "Loading"
        } matching ${dataName}`}
        onDownload={() => handleDownload(recordCount)}
        customUIRight={customToolbarUI}
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
              serverSideInfiniteScroll={enableInfiniteScroll}
              cacheBlockSize={CACHE_BLOCK_SIZE}
              columnDefs={columnDefs}
              debug={false}
              context={{
                navigateFunction: navigate,
              }}
              defaultColDef={defaultColDef}
              onGridReady={(params) => {
                params.api.sizeColumnsToFit();
              }}
              onFirstDataRendered={(params) => {
                params.columnApi.autoSizeAllColumns();
              }}
              enableRangeSelection={true}
              onGridColumnsChanged={() => refreshData(userSearchVal)}
            />
          </div>
        )}
      </AutoSizer>
    </Container>
  );
}
