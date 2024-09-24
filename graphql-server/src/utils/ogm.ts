import { runQuery } from "../schemas/neo4j";
import NodeCache from "node-cache";

export async function querySamplesList(
  searchVals: string[],
  oncotreeCache: NodeCache,
  addlOncotreeCodes: string[]
) {
  try {
    const samples = await runQuery.sampleDashboardQuery(
      searchVals,
      oncotreeCache,
      addlOncotreeCodes
    );
    return samples;
  } catch (error) {
    console.error("Error running query:", error);
    throw new Error("Failed to fetch samples");
  }
}
