import NodeCache from "node-cache";

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

export function setOncotreeCache(
  data: OncotreeTumorType[],
  oncotreeCache: NodeCache
) {
  // Restructure data for node-cache to store multiple k-v pairs in one go
  const parsedData = data.map((obj) => {
    return {
      key: obj.code,
      val: {
        name: obj.name,
        mainType: obj.mainType,
      } as CachedOncotreeData,
    };
  });
  oncotreeCache.mset(parsedData);
}
