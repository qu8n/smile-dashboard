import { GraphQLOptionsArg, GraphQLWhereArg, OGM } from "@neo4j/graphql-ogm";
import { ApolloServerContext } from "./servers";
//import { SamplesQueryResult } from "./dataloader";
import { runQuery } from "../schemas/neo4j";

const MAX_ROWS = 500;

export async function querySamplesList(
  ogm: OGM,
  where: GraphQLWhereArg,
  options: GraphQLOptionsArg //,
  //ontext: ApolloServerContext
  //): Promise<SamplesQueryResult> {
) {
  var startTime = performance.now();
  // TODO I think the where has the oncotree stuff
  try {
    // Call sampleDashboardQuery with appropriate arguments
    const samples = await runQuery.sampleDashboardQuery(null, {
      limit: options?.limit || MAX_ROWS,
    }); //, context);

    var endTime = performance.now();
    console.log(`Query took ${(endTime - startTime) / 1000} seconds`);

    return {
      totalCount: samples ? samples.length : 0,
      data: samples
        ? samples.slice(0, (options?.limit as number) || MAX_ROWS)
        : [],
    };
  } catch (error) {
    console.error("Error running query:", error);
    throw new Error("Failed to fetch samples");
  }
}
