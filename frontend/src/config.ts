/**
 * Placeholder values for the variable parts of route paths.
 * When a page uses one of these params, they're captured from the URL in these
 * variables.
 * For example, in the route `/requests/<igoRequestId>` like `/requests/12345`,
 * the component can access the `12345` value as follows:
 * ```tsx
 * const { igoRequestId } = useParams();
 * ```
 */
export const ROUTE_PARAMS = {
  requests: "igoRequestId",
  patients: "patientId",
  cohorts: "cohortId",
} as const;
