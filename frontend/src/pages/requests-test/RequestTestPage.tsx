import { useRef, useState } from "react";
import { DataGrid } from "../../components/DataGrid";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { AlertModal } from "../../components/AlertModal";
import { useFetchData } from "../../hooks/useFetchData";
import { useDashboardSamplesLazyQuery } from "../../generated/graphql";
import { Heading } from "../../shared/components/Heading";
import { Toolbarr } from "../../shared/components/Toolbarr";
import { SearchBar } from "../../shared/components/SearchBar";
import { filterButtonOptions } from "./config";
import { Col } from "react-bootstrap";
import { FilterButtons } from "../../components/FilterButtons";
import { ErrorMessage } from "../../components/ErrorMessage";

const POLLING_INTERVAL = 5000; // 5s
const RECORD_NAME = "samples";
const QUERY_NAME = "dashboardSamples";
const INITIAL_SORT_FIELD_NAME = "importDate";

// PLAN: re-create the samples page, then modify it to fit the requests page
export default function SamplesTestPage() {
  const [userSearchVal, setUserSearchVal] = useState<string>("");
  const [alertContent, setAlertContent] = useState<string | null>(null);
  const [filterButton, setFilterButton] = useState("All");

  const gridRef = useRef<AgGridReactType>(null);
  const { refreshData, recordCount, error } = useFetchData({
    useRecordsLazyQuery: useDashboardSamplesLazyQuery,
    contexts: filterButtonOptions.get(filterButton)?.contexts,
    queryName: QUERY_NAME,
    initialSortFieldName: INITIAL_SORT_FIELD_NAME,
    gridRef,
    pollInterval: POLLING_INTERVAL,
    userSearchVal,
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

        <Col className="mx-auto">
          <SearchBar
            recordName={RECORD_NAME}
            userSearchVal={userSearchVal}
            setUserSearchVal={setUserSearchVal}
            handleSearch={refreshData}
            recordCount={recordCount}
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
    </>
  );
}
