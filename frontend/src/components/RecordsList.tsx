import AutoSizer from "react-virtualized-auto-sizer";
import { Button, Container, Modal } from "react-bootstrap";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DownloadModal } from "./DownloadModal";
import { CSVFormulate } from "../utils/CSVExport";
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
import { Sample, SampleWhere } from "../generated/graphql";
import {
  defaultColDef,
  prepareSampleMetadataForAgGrid,
} from "../shared/helpers";
import { PatientIdsTriplet } from "../pages/patients/PatientsPage";
import { ErrorMessage, LoadingSpinner, Toolbar } from "../shared/tableElements";

interface IRecordsListProps {
  colDefs: ColDef[];
  dataName: DataName;
  lazyRecordsQuery: typeof useHookLazyGeneric;
  lazyRecordsQueryAddlVariables?: Record<string, any>;
  prepareDataForAgGrid?: (
    data: any,
    filterModel: IServerSideGetRowsRequest["filterModel"]
  ) => any;
  queryFilterWhereVariables: (
    parsedSearchVals: string[]
  ) => Record<string, any>[];
  userSearchVal: string;
  setUserSearchVal: Dispatch<SetStateAction<string>>;
  parsedSearchVals: string[];
  setParsedSearchVals: Dispatch<SetStateAction<string[]>>;
  handleSearch: () => void;
  showDownloadModal: boolean;
  setShowDownloadModal: Dispatch<SetStateAction<boolean>>;
  handleDownload: () => void;
  samplesQueryParam: string | undefined;
  prepareSamplesDataForAgGrid?: (samples: Sample[]) => any[];
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
  lazyRecordsQuery,
  lazyRecordsQueryAddlVariables,
  prepareDataForAgGrid,
  queryFilterWhereVariables,
  userSearchVal,
  setUserSearchVal,
  parsedSearchVals,
  setParsedSearchVals,
  handleSearch,
  showDownloadModal,
  setShowDownloadModal,
  handleDownload,
  samplesQueryParam,
  prepareSamplesDataForAgGrid = prepareSampleMetadataForAgGrid,
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

  const navigate = useNavigate();

  // note that we aren't using initial fetch
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [initialFetch, { loading, error, data, fetchMore, refetch }] =
    lazyRecordsQuery({
      variables: {
        options: { limit: 20, offset: 0 },
        ...lazyRecordsQueryAddlVariables,
      },
    });

  const totalCountNodeName = `${dataName}Connection`;

  const datasource: IServerSideDatasource = useMemo(() => {
    return {
      // called by the grid when more rows are required
      getRows: (params: IServerSideGetRowsParams) => {
        const noFilter = Object.keys(filterModel).length === 0;

        const fetchInput = {
          where: {
            OR: queryFilterWhereVariables(parsedSearchVals),
          },
          [`${dataName}ConnectionWhere2`]: {
            OR: queryFilterWhereVariables(parsedSearchVals),
          },
          options: {
            // Removing offset and limit leads to a full data fetch, but
            // it enables us to perform complex filtering on the client side
            offset: noFilter ? params.request.startRow : undefined,
            limit: noFilter ? params.request.endRow : undefined,
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

        return thisFetch.then((d) => {
          let data = d.data;
          if (prepareDataForAgGrid)
            data = prepareDataForAgGrid(data, filterModel);
          setRowCount(data[totalCountNodeName].totalCount);
          params.success({
            rowData: data[dataName],
            rowCount: data[totalCountNodeName].totalCount,
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
      {showDownloadModal && (
        <DownloadModal
          loader={() => {
            return fetchMore({
              variables: {
                where: {
                  OR: queryFilterWhereVariables(parsedSearchVals),
                },
                options: {
                  offset: 0,
                  limit: undefined,
                },
              },
            }).then(({ data }: any) => {
              return CSVFormulate(data[dataName], colDefs);
            });
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

      {samplesQueryParam && (
        <AutoSizer>
          {({ height, width }) => (
            <Modal show={true} dialogClassName="modal-90w" onHide={handleClose}>
              <Modal.Header closeButton>
                <Modal.Title>{`Viewing ${samplesQueryParam}`}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className={styles.popupHeight}>
                  <SamplesList
                    columnDefs={samplesColDefs}
                    prepareDataForAgGrid={prepareSamplesDataForAgGrid}
                    parentWhereVariables={samplesParentWhereVariables}
                    refetchWhereVariables={samplesRefetchWhereVariables}
                    setUnsavedChanges={setUnsavedChanges}
                    exportFileName={`${samplesQueryParam}.tsv`}
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
          rowCount > 1 ? dataName : dataName.slice(0, -1)
        }`}
        handleDownload={handleDownload}
        customUI={customToolbarUI}
      />

      <AutoSizer>
        {({ width }) => (
          <div
            className={`ag-theme-alpine ${styles.tableHeight}`}
            style={{ width: width }}
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
