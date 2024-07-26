import fetch from "node-fetch";
import NodeCache from "node-cache";
import { driver } from "../schemas/neo4j";

export type OncotreeTumorType = {
  children: Record<string, unknown>;
  code: string;
  color: string;
  externalReferences: Record<string, unknown>;
  history: string[];
  level: number;
  mainType: string;
  name: string;
  parent: string;
  precursors: string[];
  revocations: string[];
  tissue: string;
};

export type CachedOncotreeData =
  | Pick<OncotreeTumorType, "name" | "mainType">
  | undefined;

export async function fetchOncotreeData() {
  try {
    const response = await fetch(`https://oncotree.mskcc.org/api/tumorTypes`, {
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch the Oncotree API");
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return null;
  }
}

export async function updateOncotreeCache(
  oncotreeData: OncotreeTumorType[],
  oncotreeCache: NodeCache
) {
  // Restructure data for node-cache to store multiple k-v pairs in one go
  const parsedData = oncotreeData.map((obj) => {
    return {
      key: obj.code,
      val: {
        name: obj.name,
        mainType: obj.mainType,
      } as CachedOncotreeData,
    };
  });

  // Add to cache codes found in Neo4j but not in the Oncotree db.
  // This helps us distinguish between new codes in SMILE vs. codes not found in Oncotree db,
  // preventing unnecessary API calls
  const existingCodes = await getOncotreeCodesFromNeo4j();
  const fetchedCodes = new Set(parsedData.map((obj) => obj.key));
  if (existingCodes) {
    for (const existingCode of existingCodes) {
      if (!fetchedCodes.has(existingCode)) {
        parsedData.push({
          key: existingCode,
          val: {
            name: "N/A",
            mainType: "N/A",
          } as CachedOncotreeData,
        });
      }
    }
  }

  oncotreeCache.mset(parsedData);
}

async function getOncotreeCodesFromNeo4j() {
  const session = driver.session();
  try {
    const result = await session.writeTransaction((tx) =>
      tx.run(`
        MATCH (s:SampleMetadata) RETURN DISTINCT s.oncotreeCode AS oncotreeCode
      `)
    );
    return new Set(
      result.records.map((record) => record.get("oncotreeCode")).filter(Boolean)
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
  } finally {
    await session.close();
  }
}
