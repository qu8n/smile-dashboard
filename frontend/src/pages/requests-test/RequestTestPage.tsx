import { useRef, useState } from "react";
import { DataGrid } from "../../components/DataGrid";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { AlertModal } from "../../components/AlertModal";
import { sampleColDefs } from "../../shared/helpers";
import { useFetchData } from "../../hooks/useFetchData";
import { useDashboardSamplesLazyQuery } from "../../generated/graphql";
import { Heading } from "../../shared/components/Heading";

const POLLING_INTERVAL = 5000; // 5s

// PLAN: re-create the samples page, then modify it to fit the requests page
export default function SamplesTestPage() {
  const [userSearchVal, setUserSearchVal] = useState<string>("");
  const [alertContent, setAlertContent] = useState<string | null>(null);

  const gridRef = useRef<AgGridReactType>(null);
  const { refreshData, error, data, fetchMore, startPolling, stopPolling } =
    useFetchData({
      useRecordsLazyQuery: useDashboardSamplesLazyQuery,
      initialSortFieldName: "importDate",
      queryName: "dashboardSamples",
      gridRef,
      pollInterval: POLLING_INTERVAL,
      userSearchVal,
    });

  // const params = useParams();
  // const hasParams = Object.keys(params).length > 0;

  if (error) {
    return (
      <div>
        <p>There was an error loading data. Please try refreshing the page.</p>
        <p>If the error persists, contact SMILE team and share this error:</p>
        <i>
          {error.name} - {error.message}
        </i>
      </div>
    );
  }

  return (
    <>
      <Heading>Samples</Heading>
      <DataGrid
        gridRef={gridRef}
        setAlertContent={setAlertContent}
        columnDefs={sampleColDefs}
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
