import fetch from "node-fetch";
import NodeCache from "node-cache";
import { props } from "./constants";
import { neo4jDriver } from "./servers";
import {
  buildSamplesQueryBody,
  buildSamplesQueryFinal,
  queryDashboardSamples,
  querySelectSampleDataForCacheUpdate,
  SampleDataForCacheUpdate,
} from "../schemas/queries/samples";
import {
  DashboardRecordSort,
  DashboardSample,
  DashboardSampleInput,
} from "../generated/graphql";

export const ONCOTREE_CACHE_KEY = "oncotree";
export const SAMPLES_CACHE_KEY = "samples";

const ONCOTREE_CACHE_TTL = 86400; // 1 day
const SAMPLES_CACHE_TTL = 3600; // 1 hour

// Variables to keep in sync with the frontend
const CACHE_BLOCK_SIZE = 500; // from helpers.tsx
const SAMPLES_DEFAULT_SORT = {
  colId: "importDate",
  sort: "desc",
} as DashboardRecordSort; // from SamplesList.tsx
const WES_SAMPLE_CONTEXT = [
  {
    fieldName: "genePanel",
    values: [
      "Agilent_51MB",
      "Agilent_v4_51MB_Human",
      "CustomCapture",
      "IDT_Exome_v1_FP",
      "IDT_Exome_V1_IMPACT468",
      "WES_Human",
      "WholeExomeSequencing",
    ],
  },
]; // from SamplesPage.tsx

const MAX_RETRIES_UPON_FALSE_SAMPLE_STATUS = 3;
const RETRY_INTERVAL_UPON_FALSE_SAMPLE_STATUS = 3000; // 3s

export type OncotreeCache = Record<string, { name: string; mainType: string }>; // key = Oncotree code
export type SamplesCache = Record<string, DashboardSample[]>; // key = full Cypher query

/**
 * Source: https://oncotree.mskcc.org/#/home?tab=api
 */
export type OncotreeApiTumorType = {
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

export async function initializeInMemoryCache() {
  const inMemoryCache = new NodeCache();

  // Warm up the cache
  await updateOncotreeCache(inMemoryCache);
  await updateSamplesCache(inMemoryCache);
  logCacheStats(inMemoryCache);

  // Add cache item expiration handlers
  // (node-cache checks for expired items and runs this event listener every 10m by default)
  inMemoryCache.on("expired", async (key) => {
    if (key === ONCOTREE_CACHE_KEY) {
      await updateOncotreeCache(inMemoryCache);
    }
    if (key === SAMPLES_CACHE_KEY) {
      await updateSamplesCache(inMemoryCache);
    }
  });

  return inMemoryCache;
}

export async function updateOncotreeCache(inMemoryCache: NodeCache) {
  const oncotreeApiData = await fetchOncotreeApiData();
  if (!oncotreeApiData) return;

  const oncotreeCache = oncotreeApiData.reduce((acc, tumor) => {
    acc[tumor.code] = { name: tumor.name, mainType: tumor.mainType };
    return acc;
  }, {} as OncotreeCache);

  // Add to cache the oncotree codes found in Neo4j but not in Oncotree API's response
  // (These codes are likely old codes that have been renamed in the Oncotree database)
  const oncotreeCodesInNeo4j = await getOncotreeCodesFromNeo4j();
  oncotreeCodesInNeo4j?.forEach((code) => {
    if (!oncotreeCache.hasOwnProperty(code)) {
      oncotreeCache[code] = { name: "N/A", mainType: "N/A" };
    }
  });

  inMemoryCache.set(ONCOTREE_CACHE_KEY, oncotreeCache, ONCOTREE_CACHE_TTL);
}

async function fetchOncotreeApiData() {
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
    return (await response.json()) as Promise<OncotreeApiTumorType[]>;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    } else {
      console.error("Unknown error occurred while fetching Oncotree data");
    }
    return null;
  }
}

async function getOncotreeCodesFromNeo4j() {
  const session = neo4jDriver.session();
  try {
    const result = await session.run(`
      MATCH (sm:SampleMetadata)
      RETURN DISTINCT sm.oncotreeCode AS oncotreeCode
    `);
    return result.records
      .map((record) => record.get("oncotreeCode"))
      .filter(Boolean) as string[];
  } catch (error) {
    if (error instanceof Error) {
      console.error(error.message);
    }
    return [];
  } finally {
    await session.close();
  }
}

async function updateSamplesCache(inMemoryCache: NodeCache) {
  console.info("Querying and caching select samples data...");

  // Build query bodies for all samples and WES samples queries of Samples page
  const allSamplesQueryBody = buildSamplesQueryBody({
    searchVals: [],
    contexts: undefined,
    filters: undefined,
    addlOncotreeCodes: [],
  });
  const wesSamplesQueryBody = buildSamplesQueryBody({
    searchVals: [],
    contexts: WES_SAMPLE_CONTEXT,
    filters: undefined,
    addlOncotreeCodes: [],
  });

  // Run these queries concurrently to reduce server startup time
  const oncotreeCache = inMemoryCache.get(ONCOTREE_CACHE_KEY) as OncotreeCache;
  const allSamplesQueryPromises = buildSamplesQueryPromise({
    queryBody: allSamplesQueryBody,
    oncotreeCache,
  });
  const wesSamplesQueryPromises = buildSamplesQueryPromise({
    queryBody: wesSamplesQueryBody,
    oncotreeCache,
  });

  try {
    const queryResults = await Promise.all([
      allSamplesQueryPromises,
      wesSamplesQueryPromises,
    ]);

    // Add all samples query results to cache
    const samplesCache: SamplesCache = {};
    queryResults.forEach((result) => {
      if (result) {
        Object.assign(samplesCache, result);
      }
    });

    // Refresh the samples cache
    inMemoryCache.set(SAMPLES_CACHE_KEY, samplesCache, SAMPLES_CACHE_TTL);
  } catch (error) {
    console.error(
      "Error executing queries during the samples cache update:",
      error
    );
  }
}

function buildSamplesQueryPromise({
  queryBody,
  oncotreeCache,
}: {
  queryBody: string;
  oncotreeCache: OncotreeCache;
}): Promise<Record<string, DashboardSample[]> | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const samplesCypherQuery = buildSamplesQueryFinal({
        queryBody,
        sort: SAMPLES_DEFAULT_SORT,
        limit: CACHE_BLOCK_SIZE,
        offset: 0,
      });
      const queryResult = await queryDashboardSamples({
        samplesCypherQuery,
        oncotreeCache,
      });
      resolve(queryResult ? { [samplesCypherQuery]: queryResult } : null);
    } catch (error) {
      reject(error);
    }
  });
}

export async function updateCacheWithNewSampleUpdates(
  newDashboardSamples: DashboardSampleInput[],
  inMemoryCache: NodeCache
) {
  const samplesCache = inMemoryCache.get(SAMPLES_CACHE_KEY) as SamplesCache;
  const cachedSamples = Object.values(samplesCache).flat();

  // Early return if no samples in the cache are receiving updates
  const cachedPrimaryIds = new Set(cachedSamples.map((s) => s.primaryId));
  const cacheNeedsUpdate = newDashboardSamples.some((s) =>
    cachedPrimaryIds.has(s.primaryId)
  );
  if (!cacheNeedsUpdate) {
    console.info(
      "Skipping cache update because updated dashboard samples are not in cache."
    );
    return;
  }

  // Create a map out of newDashboardSamples for quick lookup by primaryId
  const newSamplesByPrimaryId = newDashboardSamples.reduce(
    (accumulator, newDashboardSample) => {
      accumulator[newDashboardSample.primaryId] = newDashboardSample;
      return accumulator;
    },
    {} as Record<string, DashboardSampleInput> // key = primaryId
  );

  console.info(
    "Getting select latest data for updated samples to update the samples cache..."
  );
  let sampleDataForCacheUpdate: SampleDataForCacheUpdate = {};
  for (let retry = 0; retry < MAX_RETRIES_UPON_FALSE_SAMPLE_STATUS; retry++) {
    await new Promise((resolve) =>
      setTimeout(resolve, RETRY_INTERVAL_UPON_FALSE_SAMPLE_STATUS)
    );
    sampleDataForCacheUpdate = await querySelectSampleDataForCacheUpdate(
      Object.keys(newSamplesByPrimaryId)
    );
    const hasFalseRevisable = Object.values(sampleDataForCacheUpdate).some(
      ({ revisable }) => revisable === false
    );
    if (!hasFalseRevisable) {
      break;
    } else {
      if (retry < MAX_RETRIES_UPON_FALSE_SAMPLE_STATUS - 1) {
        console.info(
          `Detected a sample with 'revisable' == false. ` +
            `Refetching from Neo4j in ${
              RETRY_INTERVAL_UPON_FALSE_SAMPLE_STATUS / 1000
            } seconds...`
        );
      } else {
        console.info(
          "Max retries attempted. Leaving sample(s) in cache with 'revisable' == false..."
        );
      }
    }
  }

  for (const sample of cachedSamples) {
    if (newSamplesByPrimaryId.hasOwnProperty(sample.primaryId)) {
      // Update the fields of any samples in cache that were changed in newDashboardSamples
      const newDashboardSample = newSamplesByPrimaryId[sample.primaryId];
      for (const field of newDashboardSample.changedFieldNames) {
        if (field in sample && field in newDashboardSample) {
          (sample as any)[field] =
            newDashboardSample[field as keyof DashboardSampleInput];
        }
      }
      // Update select fields of samples in cache with the latest data from Neo4j
      const latestSampleData = sampleDataForCacheUpdate[sample.primaryId];
      for (const [field, value] of Object.entries(latestSampleData)) {
        (sample as any)[field] = value;
      }
    }
  }

  // Re-sort the samples in cache to match frontend's optimistc update flow in SamplesList.tsx
  Object.keys(samplesCache).forEach((cachedSamplesQuery) => {
    samplesCache[cachedSamplesQuery].sort((a, b) => {
      return (
        new Date(b.importDate).getTime() - new Date(a.importDate).getTime()
      );
    });
  });

  // Refresh the samples cache
  inMemoryCache.set(SAMPLES_CACHE_KEY, samplesCache, SAMPLES_CACHE_TTL);
  console.info("Updated the samples cache with dashboard updates.");
}

function logCacheStats(inMemoryCache: NodeCache) {
  const stats = inMemoryCache.getStats();
  console.info(
    `Cache stats: ${stats.keys} keys (${inMemoryCache.keys().join(", ")}), ${
      stats.hits
    } hits, ` +
      `${stats.misses} misses, ${stats.ksize}B in key size, ${stats.vsize}B in value size`
  );
}
