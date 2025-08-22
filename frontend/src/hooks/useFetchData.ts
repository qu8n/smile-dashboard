import { RefObject, useCallback, useMemo, useState } from "react";
import {
  AgGridSortDirection,
  DashboardRecordColumnFilter,
  DashboardRecordContext,
  DashboardRecordSort,
  DashboardRequestsDocument,
} from "../generated/graphql";
import { parseUserSearchVal } from "../utils/parseSearchQueries";
import {
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from "ag-grid-community";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { usePhiEnabled } from "../contexts/PhiEnabledContext";
import { LazyQueryHookOptions, useLazyQuery } from "@apollo/client";
import { CACHE_BLOCK_SIZE } from "../configs/shared";

function useHookLazyGeneric(baseOptions?: LazyQueryHookOptions<any, any>) {
  const options = { ...({} as const), ...baseOptions };
  return useLazyQuery<any, any>(DashboardRequestsDocument, options);
}

interface UseFetchDataParams {
  useRecordsLazyQuery: typeof useHookLazyGeneric;
  queryName: string;
  initialSortFieldName: string;
  gridRef: RefObject<AgGridReactType>;
  userSearchVal: string;
  recordContexts?: Array<DashboardRecordContext>;
  pollInterval?: number;
}

export function useFetchData({
  useRecordsLazyQuery,
  queryName,
  initialSortFieldName,
  gridRef,
  userSearchVal,
  recordContexts = [],
  pollInterval = 0, // 0 means no polling
}: UseFetchDataParams) {
  // Manage our own loading state becase the lazy query's provided `loading` state
  // does not toggle to `true` as `setServerSideDatasource` is running
  const [isLoading, setIsLoading] = useState(false);
  const { phiEnabled } = usePhiEnabled();

  const defaultSort: DashboardRecordSort = useMemo(
    () => ({
      colId: initialSortFieldName,
      sort: AgGridSortDirection.Desc,
    }),
    [initialSortFieldName]
  );

  const [
    ,
    { error, data, fetchMore, refetch, startPolling: poll, stopPolling },
  ] = useRecordsLazyQuery({
    variables: {
      searchVals: [],
      recordContexts,
      sort: defaultSort,
      limit: CACHE_BLOCK_SIZE,
      offset: 0,
    },
    pollInterval,
  });

  // Start poll using the same interval throughout the page
  function startPolling() {
    poll(pollInterval);
  }

  const recordCount: number = data?.[queryName][0]?._total || 0;
  const uniqueSampleCount: number =
    data?.[queryName][0]?._uniqueSampleCount || 0;

  const buildServerSideDatasource = useCallback(
    (userSearchVal) => {
      return {
        getRows: async (params: IServerSideGetRowsParams) => {
          setIsLoading(true);

          const variables = {
            searchVals: parseUserSearchVal(userSearchVal),
            recordContexts,
            sort: params.request.sortModel[0] || defaultSort,
            limit: CACHE_BLOCK_SIZE,
            offset: params.request.startRow ?? 0,
            columnFilters: getColumnFilters(params),
            phiEnabled,
          };

          const thisFetch =
            params.request.startRow === 0
              ? refetch(variables)
              : fetchMore({ variables });

          return thisFetch
            .then((result) => {
              params.success({
                rowData: result.data[queryName],
                rowCount: result.data[queryName][0]?._total || 0,
              });
            })
            .catch((error) => {
              console.error(error);
              params.fail();
            })
            .finally(() => {
              setIsLoading(false);
            });
        },
      } as IServerSideDatasource;
    },
    [refetch, fetchMore, defaultSort, queryName, recordContexts, phiEnabled]
  );

  /**
   * Call to update the data shown in the grid. It will often be used without a
   * parameter, in which case it will use the current `userSearchVal` state.
   *
   * Call this function with a parameter when we need to update `userSearchVal`
   * and refresh the grid at the same time, such as when the user clears
   * the search bar input: we can't simply update `userSearchVal` state to ""
   * and call refreshData() without a parameter, because the state update is
   * asynchronous and won't be reflected in time.
   */
  function refreshData(searchVal: string = userSearchVal) {
    stopPolling();
    const newDatasource = buildServerSideDatasource(searchVal);
    gridRef.current?.api.setServerSideDatasource(newDatasource);
    startPolling();
  }

  return {
    refreshData,
    recordCount,
    uniqueSampleCount,
    isLoading,
    error,
    data,
    fetchMore,
    startPolling,
    stopPolling,
  };
}

function getColumnFilters(
  params: IServerSideGetRowsParams
): Array<DashboardRecordColumnFilter> | undefined {
  const filterModel = params.request.filterModel;
  if (!filterModel || Object.keys(filterModel).length === 0) {
    // All filter values are selected
    return undefined;
  }
  return Object.entries(filterModel).map(([field, value]) => ({
    field,
    // Flexibly handle AG Grid's `any` type for filter settings by JSON.parse() this string value,
    // then check the field name before consuming it at the GraphQL server (see https://stackoverflow.com/a/45601881)
    filter: JSON.stringify(value),
  }));
}
