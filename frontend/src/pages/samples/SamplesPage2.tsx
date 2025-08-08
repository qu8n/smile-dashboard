import { useRef, useState } from "react";
import { DataGrid } from "../../components/DataGrid";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { AlertModal } from "../../components/AlertModal";
import { useFetchData } from "../../hooks/useFetchData";
import {
  DashboardSample,
  useDashboardSamplesLazyQuery,
} from "../../generated/graphql";
import { Heading } from "../../shared/components/Heading";
import { Toolbarr } from "../../shared/components/Toolbarr";
import { SearchBar } from "../../shared/components/SearchBar";
import { buildDownloadOptions, filterButtonOptions } from "./config";
import { Col, Form } from "react-bootstrap";
// TODO: use react bootsrap components instead of Material UI
// OverlayTrigger
import { Tooltip } from "@material-ui/core";
import { FilterButtons } from "../../components/FilterButtons";
import { ErrorMessage } from "../../components/ErrorMessage";
import { DownloadButton } from "../../shared/components/DownloadButton";
import { DownloadModal2 } from "../../components/DownloadModal2";
import { useDownload } from "../../hooks/useDownload";
import InfoIcon from "@material-ui/icons/InfoOutlined";

const POLLING_INTERVAL = 5000; // 5s
const RECORD_NAME = "samples";
const QUERY_NAME = "dashboardSamples";
const INITIAL_SORT_FIELD_NAME = "importDate";

// TODO: re-create the samples page, then modify it to fit the requests page
export function SamplesPage2() {
  const [userSearchVal, setUserSearchVal] = useState<string>("");
  const [alertContent, setAlertContent] = useState<string | null>(null);
  const [filterButton, setFilterButton] = useState("All");

  const gridRef = useRef<AgGridReactType<DashboardSample>>(null);

  const { refreshData, recordCount, loading, error, fetchMore } = useFetchData({
    useRecordsLazyQuery: useDashboardSamplesLazyQuery,
    contexts: filterButtonOptions.get(filterButton)?.contexts,
    queryName: QUERY_NAME,
    initialSortFieldName: INITIAL_SORT_FIELD_NAME,
    gridRef,
    pollInterval: POLLING_INTERVAL,
    userSearchVal,
  });

  const { isDownloading, handleDownload, getRenderedData } =
    useDownload<DashboardSample>({
      gridRef,
      recordName: RECORD_NAME,
      fetchMore,
      userSearchVal,
      recordCount,
      queryName: QUERY_NAME,
    });

  const downloadOptions = buildDownloadOptions({
    getRenderedData,
    currentColumnDefs: filterButtonOptions.get(filterButton)!.columnDefs,
  });

  if (error) {
    return <ErrorMessage error={error} />;
  }

  return (
    <>
      <Heading>Samples</Heading>
      <Toolbarr>
        <Col>
          <FilterButtons
            filterButton={filterButton}
            setFilterButton={setFilterButton}
            filterButtonOptions={filterButtonOptions}
          >
            These tabs filter the data and relevant columns displayed in the
            table. "All" shows all samples, whereas "WES" and "ACCESS/CMO-CH"
            show only whole exome and MSK-ACCESS/CMO-CH samples, respectively.
          </FilterButtons>
        </Col>

        <Col md="auto" className="d-flex mx-auto gap-2">
          <SearchBar
            userSearchVal={userSearchVal}
            setUserSearchVal={setUserSearchVal}
            handleSearch={refreshData}
            recordCount={recordCount}
            loading={loading}
          />

          <div className="vr" />

          {/* <Form> */}
          {/*   <Form.Check */}
          {/*     type="switch" */}
          {/*     id="custom-switch" */}
          {/*     label="PHI-enabled" */}
          {/*     checked={phiEnabled} */}
          {/*     onChange={(e) => { */}
          {/*       const isPhiEnabled = e.target.checked; */}
          {/*       setPhiEnabled(isPhiEnabled); */}
          {/*       if (isPhiEnabled) { */}
          {/*         setColDefs(sampleColDefsWithPhiCols); */}
          {/*         setColumnDefsForExport(sampleColDefsWithPhiCols); */}
          {/*       } else { */}
          {/*         setColDefs(columnDefs); */}
          {/*         setColumnDefsForExport(columnDefs); */}
          {/*       } */}
          {/*       refreshData(userSearchVal); */}
          {/*     }} */}
          {/*   /> */}
          {/* </Form> */}
          {/**/}
          {/* <Tooltip */}
          {/*   title={ */}
          {/*     <span style={{ fontSize: 12 }}> */}
          {/*       Turn on this switch to return each sample's sequencing date */}
          {/*       in the results. Note that this mode only returns the */}
          {/*       sequencing date matching specific DMP Sample IDs entered in */}
          {/*       the search bar. When turning on this switch for the first */}
          {/*       time, you will be prompted to log in. */}
          {/*     </span> */}
          {/*   } */}
          {/* > */}
          {/*   <InfoIcon style={{ fontSize: 18, color: "grey" }} /> */}
          {/* </Tooltip> */}
          {/**/}
        </Col>

        <Col className="text-end">
          <DownloadButton
            downloadOptions={downloadOptions}
            handleDownload={handleDownload}
          />
        </Col>
      </Toolbarr>

      <DataGrid
        gridRef={gridRef}
        setAlertContent={setAlertContent}
        columnDefs={filterButtonOptions.get(filterButton)!.columnDefs}
        handleGridColumnsChanged={refreshData}
      />

      <AlertModal
        show={!!alertContent}
        onHide={() => setAlertContent(null)}
        title={"Warning"}
        content={alertContent}
      />

      <DownloadModal2 show={isDownloading} />
    </>
  );
}
