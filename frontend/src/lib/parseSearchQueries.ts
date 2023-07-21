export function parseSearchQueries(value: string): string[] {
  const queries = value
    .split(/[\s,]+/) // split on whitespaces and commas
    .map((query) => query.trim())
    .filter(Boolean); // remove empty strings (e.g. when `value` is `123,,456`)
  const uniqueQueries = Array.from(new Set(queries));
  return uniqueQueries;
}
