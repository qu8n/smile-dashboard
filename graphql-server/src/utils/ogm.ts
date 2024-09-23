import { GraphQLOptionsArg, GraphQLWhereArg, OGM } from "@neo4j/graphql-ogm";
import { ApolloServerContext } from "./servers";
//import { SamplesQueryResult } from "./dataloader";
import { runQuery } from "../schemas/neo4j";
import NodeCache from "node-cache";

const MAX_ROWS = 500;

export async function querySamplesList(
  searchVals: string[],
  oncotreeCache: NodeCache
  // ogm?: OGM,
  // where?: GraphQLWhereArg,
  // options?: GraphQLOptionsArg //,
  //ontext: ApolloServerContext
  //): Promise<SamplesQueryResult> {
) {
  var startTime = performance.now();
  // TODO I think the where has the oncotree stuff
  try {
    // Call sampleDashboardQuery with appropriate arguments
    const samples = await runQuery.sampleDashboardQuery(
      searchVals,
      oncotreeCache
    );

    var endTime = performance.now();
    console.log(`Query took ${(endTime - startTime) / 1000} seconds`);

    return samples;
  } catch (error) {
    console.error("Error running query:", error);
    throw new Error("Failed to fetch samples");
  }
}
