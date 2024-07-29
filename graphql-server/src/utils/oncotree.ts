import fetch from "node-fetch";
import NodeCache from "node-cache";
import { driver } from "../schemas/neo4j";
import { props } from "./constants";

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
    const response = await fetch(props.oncotree_api, {
      headers: {
        Accept: "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch the Oncotree API: ${response.statusText}`
      );
    }
    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("Unknown error occurred while fetching Oncotree data");
    }
    return null;
  }
}

export async function updateOncotreeCache(
  oncotreeData: OncotreeTumorType[],
  oncotreeCache: NodeCache
) {
  // Restructure data for node-cache to store multiple k-v pairs in one go with mset()
  const parsedData = oncotreeData.map((obj) => {
    return {
      key: obj.code,
      val: {
        name: obj.name,
        mainType: obj.mainType,
      } as CachedOncotreeData,
    };
  });

  // Cache codes found in Neo4j but not from Oncotree API (likely due to codes to being renamed).
  // Otherwise, we'll continously fetch the Oncotree API for non-existent codes without stopping
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
