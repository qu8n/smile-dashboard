## Description

<Include a summary of the changes. Please also include relevant motivation and context. List any external dependencies that are required for this change, like new environment variables.>

[#<Related ticket number>](<Zenhub link>)

## Manual testing checklist

Check off items under the affected features below.

### Frontend

#### Searching & filtering

- [ ] Searching for a single term or multiple terms returns relevant results
- [ ] Searching in PHI mode returns results with PHI columns
- [ ] Filtering columns returns the results matching the filter
- [ ] [Samples page] Filtering by All, WES, and ACCESS/CMO-CH returns the expected results

#### Downloading

Confirm that these download actions return a TSV file with the expected columns and record count:

- [ ] Clicking "Download as TSV"
- [ ] Searching for some terms then clicking "Download as TSV"
- [ ] Filtering a column then clicking "Download as TSV"
- [ ] Search in PHI mode then clicking "Download as TSV"
- [ ] Clicking the dropdown download option <download option name>

#### AG Grid interactions

- [ ] [Samples page] Editing a cell updates the value as expected
- [ ] [Samples page] Pasting data into the grid works as expected
- [ ] Editing a cell in a non-editable row/column is prevented
- [ ] Column sorting in ascending and descending order works as expected
- [ ] PHI columns are visible only when PHI mode is enabled and search terms are present

#### Modals and popups

- [ ] [Samples page] Cell changes confirmation modal appears and works as expected
- [ ] [Requests page] Validation errors are displayed in the Record Validation modal
- [ ] Warning modals appear when expected and can be dismissed (e.g. PHI warning when first logged in)

### Backend

#### Schema changes

Schema changes in [typeDefs.ts](./graphql-server/src/utils/typeDefs.ts) are reflected in the following:

- [ ] The queries defined in [operations.graphql](./graphql/operations.graphql)
- [ ] The GraphQL types that are auto-generated via `yarn run codegen`
- [ ] When applicable, ensure that newly added fields are searchable (i.e. added to the "searchable fields" list for a given query)
