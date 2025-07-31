import { props } from "../utils/constants";
import { DBSQLClient, DBSQLLogger, LogLevel } from "@databricks/sql";
import { ExecuteStatementOptions } from "@databricks/sql/dist/contracts/IDBSQLSession";
import { ApolloServerContext } from "./servers";

const { databricks_server_hostname, databricks_http_path, databricks_token } =
  props;
if (!databricks_server_hostname || !databricks_http_path || !databricks_token) {
  throw new Error(
    "Cannot find Databricks environment variables for " +
      "Server Hostname, HTTP Path, or personal access token."
  );
}

const connectOptions = {
  host: databricks_server_hostname,
  path: databricks_http_path,
  token: databricks_token,
};
const logger = new DBSQLLogger({ level: LogLevel.error });
const client = new DBSQLClient({ logger: logger });
const queryOptions = { runAsync: true } as ExecuteStatementOptions;

export async function queryDatabricks<T>(query: string): Promise<Array<T>> {
  try {
    await client.connect(connectOptions);
    const session = await client.openSession();

    const queryOperation = await session.executeStatement(query, queryOptions);
    const result = await queryOperation.fetchAll();
    await queryOperation.close();

    await session.close();
    await client.close();

    return result as Array<T>;
  } catch (error) {
    await client.close();
    if (error instanceof Error) {
      throw new Error("Error executing query on Databricks: " + error.message);
    }
    return [];
  }
}

/**
 * We use Databricks with serverless compute, which means that the first query to a table can take a
 * longer time to run as Databricks requires spawning a new compute instance first. This function
 * executes a simple query on each Databricks table to reduce the latency from the cold start
 */
export async function warmUpDatabricksTables() {
  const databricksTablesToWarmUp = [
    props.databricks_phi_id_mapping_table,
    props.databricks_seq_dates_by_patient_table,
    props.databricks_seq_dates_by_sample_table,
  ];
  // Open a single Databricks connection and session to execute all warmup queries concurrently.
  // This is more efficient than opening a new connection for each query using `queryDatabricks()`,
  // which could also lead to race conditions when calling it in the "fire-and-forget" manner
  try {
    await client.connect(connectOptions);
    const session = await client.openSession();

    for (const table of databricksTablesToWarmUp) {
      const query = `SELECT 1 FROM ${table} LIMIT 1`;
      const queryOperation = await session.executeStatement(
        query,
        queryOptions
      );
      await queryOperation.fetchAll();
      await queryOperation.close();
    }

    await session.close();
    await client.close();
  } catch (error) {
    await client.close();
    console.error("Error warming up Databricks tables:", error);
  }
}

export async function warmUpDatabricks(
  _req: ApolloServerContext["req"],
  _res: any,
  next: any
) {
  // Execute warmup queries without `await`-ing the result to let them run quietly in the background
  // and not block the event loop
  warmUpDatabricksTables();
  next();
}
