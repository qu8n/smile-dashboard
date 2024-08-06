import AutoSizer from "react-virtualized-auto-sizer";
import { Button, Container, Modal } from "react-bootstrap";
import { Dispatch, SetStateAction, useCallback, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DownloadModal } from "./DownloadModal";
import { buildTsvString } from "../utils/stringBuilders";
import { AgGridReact } from "ag-grid-react";
import { useState } from "react";
import styles from "./records.module.scss";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "ag-grid-enterprise";
import {
  ColDef,
  IServerSideDatasource,
  IServerSideGetRowsParams,
  IServerSideGetRowsRequest,
} from "ag-grid-community";
import { DataName, useHookLazyGeneric } from "../shared/types";
import SamplesList from "./SamplesList";
import { Sample, SampleWhere, SortDirection } from "../generated/graphql";
import { defaultColDef } from "../shared/helpers";
import { PatientIdsTriplet } from "../pages/patients/PatientsPage";
import { ErrorMessage, LoadingSpinner, Toolbar } from "../shared/tableElements";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { BreadCrumb } from "../shared/components/BreadCrumb";
import { Title } from "../shared/components/Title";

interface IRecordsListProps {
  colDefs: ColDef[];
  dataName: DataName;
  enableInfiniteScroll?: boolean;
  lazyRecordsQuery: typeof useHookLazyGeneric;
  lazyRecordsQueryAddlVariables?: Record<string, any>;
  prepareDataForAgGrid?: (
    data: any,
    filterModel: IServerSideGetRowsRequest["filterModel"],
    sortModel?: { [key: string]: SortDirection }[] | undefined
  ) => any;
  queryFilterWhereVariables: (
    parsedSearchVals: string[]
  ) => Record<string, any>[];
  defaultSort?: { [key: string]: SortDirection }[];
  userSearchVal: string;
  setUserSearchVal: Dispatch<SetStateAction<string>>;
  parsedSearchVals: string[];
  setParsedSearchVals: Dispatch<SetStateAction<string[]>>;
  handleSearch: () => void;
  showDownloadModal: boolean;
  setShowDownloadModal: Dispatch<SetStateAction<boolean>>;
  handleDownload: () => void;
  samplesColDefs: ColDef[];
  samplesParentWhereVariables: SampleWhere;
  samplesRefetchWhereVariables: (
    samplesParsedSearchVals: string[]
  ) => SampleWhere;
  sampleKeyForUpdate?: keyof Sample;
  userEmail?: string | null;
  setUserEmail?: Dispatch<SetStateAction<string | null>>;
  setCustomSearchVals?: Dispatch<SetStateAction<PatientIdsTriplet[]>>;
  customToolbarUI?: JSX.Element;
}

export default function RecordsList({
  colDefs,
  dataName,
  enableInfiniteScroll = true,
  lazyRecordsQuery,
  lazyRecordsQueryAddlVariables,
  prepareDataForAgGrid,
  queryFilterWhereVariables,
  defaultSort,
  userSearchVal,
  setUserSearchVal,
  parsedSearchVals,
  setParsedSearchVals,
  handleSearch,
  showDownloadModal,
  setShowDownloadModal,
  handleDownload,
  samplesColDefs,
  samplesParentWhereVariables,
  samplesRefetchWhereVariables,
  sampleKeyForUpdate,
  userEmail,
  setUserEmail,
  customToolbarUI,
  setCustomSearchVals,
}: IRecordsListProps) {
  const [showClosingWarning, setShowClosingWarning] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [filterModel, setFilterModel] = useState<Record<string, any>>({});
  const [rowCount, setRowCount] = useState<number>(0);
  const [uniqueSampleCount, setUniqueSampleCount] = useState<number>(0);

  const grid = useRef<AgGridReactType>(null);
  const navigate = useNavigate();
  const params = useParams();

  // note that we aren't using initial fetch
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [initialFetch, { loading, error, data, fetchMore, refetch }] =
    lazyRecordsQuery({
      variables: {
        options: {
          limit: 20,
          offset: 0,
          sort: defaultSort,
        },
        ...lazyRecordsQueryAddlVariables,
      },
    });

  const totalCountNodeName = `${dataName}Connection`;

  const getSortModel = useCallback(() => {
    const sortModel = grid.current?.columnApi
      ?.getColumnState()
      .filter(({ sort }) => sort)
      .map(({ colId, sort }) => ({
        [colId]: sort?.toUpperCase() as SortDirection,
      }));
    if (sortModel && sortModel.length > 0) {
      return sortModel;
    }
    return defaultSort;
  }, [defaultSort]);

  const datasource: IServerSideDatasource = useMemo(() => {
    return {
      // called by the grid when more rows are required
      getRows: (params: IServerSideGetRowsParams) => {
        const fetchInput = {
          where: {
            OR: queryFilterWhereVariables(parsedSearchVals),
          },
          options: {
            offset: params.request.startRow,
            limit: params.request.endRow,
            sort: getSortModel(),
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

        return thisFetch.then((d) => {
          let agGridData = d.data;
          if (prepareDataForAgGrid) {
            agGridData = prepareDataForAgGrid(d.data, filterModel);
          }

          if ("uniqueSampleCount" in agGridData) {
            setUniqueSampleCount(agGridData.uniqueSampleCount);
          }
          setRowCount(agGridData[totalCountNodeName].totalCount);

          params.success({
            rowData: agGridData[dataName],
            rowCount: agGridData[totalCountNodeName].totalCount,
          });
        });
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedSearchVals, filterModel]);

  if (loading) return <LoadingSpinner />;

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
            const sortModel = getSortModel();

            const { data } = await fetchMore({
              variables: {
                where: {
                  OR: queryFilterWhereVariables(parsedSearchVals),
                },
                options: {
                  offset: 0,
                  limit: undefined,
                  sort: sortModel,
                },
              },
            });

            let agGridData = data;
            if (prepareDataForAgGrid) {
              agGridData = prepareDataForAgGrid(data, filterModel, sortModel);
            }

            return buildTsvString(agGridData[dataName], colDefs);
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
                    parentWhereVariables={samplesParentWhereVariables}
                    refetchWhereVariables={samplesRefetchWhereVariables}
                    setUnsavedChanges={setUnsavedChanges}
                    sampleKeyForUpdate={sampleKeyForUpdate}
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
        handleSearch={handleSearch}
        clearUserSearchVal={() => {
          setCustomSearchVals && setCustomSearchVals([]);
          setParsedSearchVals([]);
        }}
        matchingResultsCount={`${rowCount?.toLocaleString()} matching ${
          rowCount !== 1 ? dataName : dataName.slice(0, -1)
        }${
          enableInfiniteScroll
            ? ""
            : ` (${uniqueSampleCount.toLocaleString()} unique ${
                uniqueSampleCount !== 1 ? "samples" : "sample"
              })`
        }`}
        handleDownload={handleDownload}
        customUIRight={customToolbarUI}
      />

      <AutoSizer>
        {({ width }) => (
          <div
            className={`ag-theme-alpine ${styles.tableHeight}`}
            style={{ width: width }}
          >
            <AgGridReact
              ref={grid}
              rowModelType={"serverSide"}
              columnDefs={colDefs}
              serverSideDatasource={datasource}
              serverSideInfiniteScroll={enableInfiniteScroll}
              cacheBlockSize={20}
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
              onFilterChanged={(params) => {
                setFilterModel(params.api.getFilterModel());
              }}
            />
          </div>
        )}
      </AutoSizer>
    </Container>
  );
}
