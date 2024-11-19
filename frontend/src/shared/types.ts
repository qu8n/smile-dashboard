import * as Apollo from "@apollo/client";
import { DashboardRequestsDocument } from "../generated/graphql";

const defaultOptions = {} as const;

export function useHookLazyGeneric(
  baseOptions?: Apollo.LazyQueryHookOptions<any, any>
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<any, any>(DashboardRequestsDocument, options);
}

export type DataName = "requests" | "patients" | "cohorts" | "samples";
