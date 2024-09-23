import { OGM } from "@neo4j/graphql-ogm";
import { includeCancerTypeFieldsInSearch } from "./oncotree";
import { querySamplesList } from "./ogm";
import DataLoader from "dataloader";
import { SamplesListQuery } from "../generated/graphql";
import NodeCache from "node-cache";

type SamplesQueryResult = {
  totalCount: number;
  //data: SamplesListQuery["samples"];
  data: any;
};

/**
 * Create a DataLoader instance that batches the child queries (e.g. `samples` and
 * `samplesConnection` child queries of SamplesList query) and then caches the results
 * of those child queries within the same frontend request.
 *
 * This enables the SamplesList query to make a single trip to the database.
 * Without this, we would make two trips, one via the `samples` child query and one
 * via the `samplesConnection` child query.
 */
// export function createSamplesLoader(ogm: OGM, oncotreeCache: NodeCache) {
//   return new DataLoader<any, SamplesQueryResult>(async (keys) => {
//     // Both the args passed into samplesLoader.load() of the `samples` and
//     // `samplesConnection` are batched together in the `keys` array, and
//     // only one of them contains the `options` field
//     const args = keys.find((key) => key?.options);
//     const customWhere = includeCancerTypeFieldsInSearch(
//       args?.where,
//       oncotreeCache
//     );
//     const result = await querySamplesList(ogm, customWhere, args?.options);
//     return keys.map(() => result);
//   });
// }
