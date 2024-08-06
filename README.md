# SMILE Dashboard

## Run locally

This section describes how to run the dashboard backend and frontend locally without docker.

Make sure you have installed the node version and yarn version specified in
[package.json](https://github.com/mskcc/smile-dashboard/blob/master/package.json).

> **Tip:** We recommend that you use [nvm: Node Version Manager](https://github.com/nvm-sh/nvm) and [yvm: Yarn Version Manager](https://yvm.js.org/docs/overview) to switch between versions more easily.

> **Windows Tip:** If you are developing on Windows, we recommend that you use [Ubuntu / Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

### Pre-build Steps

If starting from a fresh build, pull dependencies by running `yarn` from the project root directory.

If running into build issues, try purging existing contents from all `/node_modules` directories in project. 

```
rm -rf ./node_modules frontend/node_modules graphql-server/node_modules
```

### Download the Oracle Instant Client

> **Note:** Skip this step if you are using a MacBook machine with an M1 chip. This client is currently not supported on M1 machines.

The Oracle Instant Client allows us to connect to an Oracle database (CRDB) for MRN-CMO-DMP data.

Download the Oracle Instant Client from [here](https://www.oracle.com/database/technologies/instant-client/downloads.html). 

Select the version corresponding to your operating system and download the latest version's `Basic Package` zip file.

Unzip and copy the entire directory to `/graphql-server/opt/oracle`.

#### Why can't we just use the Nodejs' `oracledb` package?

By default, `node-oracledb` runs in [Thin mode (vs. Thick mode)](https://node-oracledb.readthedocs.io/en/latest/user_guide/appendix_a.html). The CRDB uses a password verifier type (`0x939`) that is not supported by Thin mode. Pairing the Oracle Instant Client with `node-oracledb` allows us enables Thick mode and allows us to connect to the CRDB.

### Dashboard Backend

The backend for the dashboard is under `./graphql-server`.

Set up your [./graphql-server/dist/env/application.properties.EXAMPLE](./graphql-server/dist/env/application.properties.EXAMPLE) with all of the application properties needed for running the dashboard backend.

Build and launch the node app from the project root directory with:

```
yarn build:backend
yarn dev:backend
```

If successful, the graphql client should be available at `https://localhost:4000/graphql`.

### Dashboard App

Set the following environment variables to point the web app to the React frontend and the Express backend, respectively.

Example:

```
export REACT_APP_REACT_SERVER_ORIGIN=https://localhost:3006
export REACT_APP_EXPRESS_SERVER_ORIGIN=https://localhost:4000
```

To run the frontend:

```
yarn dev:frontend
```

Example pages:

- https://localhost:3006/

> **Tip:** This page should open automatically through your default web browser. If not then please navigate to the web app manually.


## Building the Docker Images

To build the frontend docker image:

```
docker build -f Dockerfile . -t [org]/smile-dashboard:[build version]
```

To build the backend docker image:

```
docker build -f graphql-server/Dockerfile . -t [org]/graphql-client:[build version]
```

## Running with docker-compose

Running the dashboard backend and frontend with `docker-compose`.

Requirements:
- `${SMILE_CONFIG_HOME}`: path to the dashboard configuration directory
- `${SMILE_CONFIG_HOME}/resources/smile-dashboard`: path to application.properties and SSL cert files for the dashboard backend
- `${SMILE_CONFIG_HOME}/nats`: path to NATS config, must contain rootCA.pem
- `$REACT_APP_GRAPHQL_CLIENT_URI`: points to the apollo-graphql client url

See [./server/env/application.properties.EXAMPLE](./server/env/application.properties.EXAMPLE) for all of the application properties needed for running the dashboard.

Example `docker-compose` file contents:

```
version: '3'

networks:
  default:
    name: smile-network
    external: true

services:
  graphql-client:
    container_name: graphql-client
    image: cmometadb/graphql-client:[build version]
    restart: unless-stopped
    environment:
      - SMILE_CONFIG_HOME=${SMILE_CONFIG_HOME}
    volumes:
      - type: bind
        source: ${SMILE_CONFIG_HOME}/resources/smile-dashboard
        target: /server/graphql-server/dist/env
      - type: bind
        source: ${SMILE_CONFIG_HOME}/nats
        target: /server/nats
    external_links:
      - nats-jetstream
      - neo4j
    depends_on:
      neo4j:
        condition: service_healthy
    ports:
      - 4000:4000
    healthcheck:
        test: ["CMD", "curl", "-s", "https://localhost:4000"]
        interval: 30s
        timeout: 10s
        retries: 5

  smile-dashboard:
    container_name: smile-dashboard
    image: cmometadb/smile-dashboard:[build version]
    restart: unless-stopped
    environment:
      - REACT_APP_GRAPHQL_CLIENT_URI=${REACT_APP_GRAPHQL_CLIENT_URI}
    links:
      - graphql-client
    ports:
      - 3006:3006
    depends_on:
      graphql-client:
        condition: service_healthy
```

Command:

```
docker-compose up -d
```

## Custom Schema

The SMILE dashboard displays data in a table format, but the underlying data is stored in a graph database (Neo4j). When querying via GraphQL, the result is an object-like structure with nested objects that represents the relationships between nodes in the graph.

For example, below is a query that retrieves data from `nodeA` and its child node `nodeB`. `field1` is a field of `nodeA`, and `field2` and `field3` are field of `nodeB`.

```gql
{
  nodeA {
    field1
    hasChildNodeB {
      field2
      field3
    }
  }
}
```

To ease the processing of transforming and processing nested graph data into a table format, we "flatten" the data schema so that nested fields are also represented as top-level fields in the queried result.

For example, the above query would be transformed into the following:

<table>
<tr>
<th> Before </th>
<th> After </th>
</tr>
<tr>
<td>

```gql
{
  nodeA {
    field1
    hasChildNodeB {
      field2
      field3
    }
  }
}


```

</td>
<td>

```gql
{
  nodeA {
    field1        
    field2        
    field3        
    hasChildNodeB {
      field2
      field3
    } 
  }
}
```

</td>
</tr>
</table>

Note that `field2` and `field3` are now top-level fields in the queried result, but they are not "true" fields of `nodeA` in the database. For clarity on which fields are "flattened", refer to `graphql-server/src/utils/flattening.ts`. Specifically, the `nestedValueGetters` object contains the fields that are flattened for each node type and how these "flattened" fields are accessed/resolved.

### How to flatten a new field
1. Add the new field to the corresponding query in `operations.graphql`.
2. Add the new field to the extended schema in the `extendedTypeDefs` configurations in `graphql-server/src/neo4j.ts`.
3. Add the new field to the corresponding flattened field array in `graphql-server/src/utils/flattening.ts`.
4. Write logic to access/resolve the field in the `nestedValueGetters` object in `graphql-server/src/utils/flattening.ts`.
5. Generate the typescript types by running `yarn run codegen`.
