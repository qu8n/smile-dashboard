import { OGM } from "@neo4j/graphql-ogm";
import { includeCancerTypeFieldsInSearch } from "./oncotree";
import { querySamplesList } from "./ogm";
import DataLoader from "dataloader";
import { SamplesListQuery, SampleWhere } from "../generated/graphql";
import NodeCache from "node-cache";

type SamplesQueryResult = {
  totalCount: number;
  data: SamplesListQuery["samples"];
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
export function createSamplesLoader(ogm: OGM, oncotreeCache: NodeCache) {
  return new DataLoader<SampleWhere, SamplesQueryResult>(async (keys) => {
    const customWhere = includeCancerTypeFieldsInSearch(keys[0], oncotreeCache);
    const result = await querySamplesList(ogm, customWhere);
    return keys.map(() => result);
  });
}
