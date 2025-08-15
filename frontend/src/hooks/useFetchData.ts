import { RefObject, useCallback, useMemo, useState } from "react";
import {
  AgGridSortDirection,
  DashboardRecordColumnFilter,
  DashboardRecordSort,
  DashboardRequestsDocument,
  DashboardSamplesQueryVariables,
} from "../generated/graphql";
import { parseUserSearchVal } from "../utils/parseSearchQueries";
import {
  IServerSideDatasource,
  IServerSideGetRowsParams,
} from "ag-grid-community";
import { AgGridReact as AgGridReactType } from "ag-grid-react/lib/agGridReact";
import { usePhiEnabled } from "../contexts/PhiEnabledContext";
import { LazyQueryHookOptions, useLazyQuery } from "@apollo/client";
import { CACHE_BLOCK_SIZE } from "../config";

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
  contexts?: DashboardSamplesQueryVariables["contexts"];
  pollInterval?: number;
}

export function useFetchData({
  useRecordsLazyQuery,
  queryName,
  initialSortFieldName,
  gridRef,
  userSearchVal,
  contexts = [],
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
      contexts,
      sort: defaultSort,
      limit: CACHE_BLOCK_SIZE,
      offset: 0,
      phiEnabled,
    },
    pollInterval,
  });

  // Start poll using the same interval throughout the page
  function startPolling() {
    poll(pollInterval);
  }

  const recordCount: number = data?.[queryName][0]?._total || 0;

  const buildServerSideDatasource = useCallback(
    (userSearchVal) => {
      return {
        getRows: async (params: IServerSideGetRowsParams) => {
          setIsLoading(true);

          const variables = {
            searchVals: parseUserSearchVal(userSearchVal),
            contexts,
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
    [refetch, fetchMore, defaultSort, queryName, contexts, phiEnabled]
  );

  function refreshData() {
    stopPolling();
    const newDatasource = buildServerSideDatasource(userSearchVal);
    gridRef.current?.api.setServerSideDatasource(newDatasource);
    startPolling();
  }

  return {
    refreshData,
    recordCount,
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
