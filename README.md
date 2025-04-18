# SMILE Dashboard

## Run locally

This section describes how to run the dashboard backend and frontend locally without docker.

### Pre-requisites

Make sure you have installed the following:
- Node.js: 16.10.0
- Yarn: 1.22.22

> **Tip:** We recommend that you use [nvm: Node Version Manager](https://github.com/nvm-sh/nvm) and [yvm: Yarn Version Manager](https://yvm.js.org/docs/overview) to switch between versions more easily.

> **Windows Tip:** If you are developing on Windows, we recommend that you use [Ubuntu / Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

### Pre-build Steps

If starting from a fresh build, pull dependencies by running `yarn` from the project root directory.

If running into build issues, try purging existing contents from all `/node_modules` directories in project.

```
rm -rf ./node_modules frontend/node_modules graphql-server/node_modules
```

### Download the Oracle Instant Client

> **Note:** Skip this step if you are using a MacBook machine with an M1 chip or newer. Visit [this link](https://www.oracle.com/database/technologies/instant-client/downloads.html) for the latest supported systems.

The Oracle Instant Client allows us to connect to an Oracle database (CRDB) for MRN-CMO-DMP data. This enables the searching of PHI data on the Patients page of the dashboard.

Download the Oracle Instant Client from [here](https://www.oracle.com/database/technologies/instant-client/downloads.html).

Select the version corresponding to your operating system and download the latest version's `Basic Package` zip file.

Unzip and copy the entire directory to `/graphql-server/opt/oracle` or your preferred location.

#### Why can't we just use the Nodejs' `oracledb` package?

By default, `node-oracledb` runs in [Thin mode (vs. Thick mode)](https://node-oracledb.readthedocs.io/en/latest/user_guide/appendix_a.html). The CRDB uses a password verifier type (`0x939`) that is not supported by Thin mode. Pairing the Oracle Instant Client with `node-oracledb` allows us enables Thick mode and allows us to connect to the CRDB.

### Dashboard Backend

The backend for the dashboard is under `./graphql-server`.

Set up your [./graphql-server/src/env/application.properties.EXAMPLE](./graphql-server/src/env/application.properties.EXAMPLE) with all of the application properties needed for running the dashboard backend.

Add the following variable to your environment:
```
export NODE_TLS_REJECT_UNAUTHORIZED=0
export SMILE_CONFIG_HOME=[path to the dashboard configuration directory]
export SMILE_DATA_HOME=[path to the dashboard data directory]

# Skip if you skipped the Oracle Instant Client step
export LD_LIBRARY_PATH=[path to the Oracle Instant Client directory]

# Skip if you're not deploying the dashboard backend with Docker
export NODE_OPTIONS="--max-old-space-size=8192"
```

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
      - NODE_TLS_REJECT_UNAUTHORIZED=${NODE_TLS_REJECT_UNAUTHORIZED}
      - LD_LIBRARY_PATH=${LD_LIBRARY_PATH}
      - REACT_APP_REACT_SERVER_ORIGIN=${REACT_APP_REACT_SERVER_ORIGIN}
      - REACT_APP_EXPRESS_SERVER_ORIGIN=${REACT_APP_EXPRESS_SERVER_ORIGIN}
      - SMILE_DATA_HOME=${SMILE_DATA_HOME}
      - NODE_OPTIONS="--max-old-space-size=8192"
    volumes:
      - type: bind
        source: ${SMILE_CONFIG_HOME}/resources/smile-dashboard
        target: /server/graphql-server/dist/env
      - type: bind
        source: ${SMILE_CONFIG_HOME}/nats
        target: /server/nats
      - type: bind
        source: ${SMILE_DATA_HOME}/logs/smile-dashboard
        target: ${SMILE_DATA_HOME}/logs/smile-dashboard
      - type: bind
        source: ${LD_LIBRARY_PATH}
        target: ${LD_LIBRARY_PATH}
    external_links:
      - nats-jetstream
    links:
      - neo4j
    depends_on:
      neo4j:
        condition: service_healthy
      keycloak:
        condition: service_started
    ports:
      - 4000:4000
    healthcheck:
      test: ["CMD-SHELL", "wget --no-check-certificate --no-verbose --spider https://localhost:4000 || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 5

  smile-dashboard:
    container_name: smile-dashboard
    image: cmometadb/smile-dashboard:[build version]
    restart: unless-stopped
    environment:
      - SMILE_CONFIG_HOME=${SMILE_CONFIG_HOME}
      - REACT_APP_EXPRESS_SERVER_ORIGIN=${REACT_APP_EXPRESS_SERVER_ORIGIN}
      - REACT_APP_REACT_SERVER_ORIGIN=${REACT_APP_REACT_SERVER_ORIGIN}
    volumes:
      - type: bind
        source: ${SMILE_CONFIG_HOME}/resources/smile-dashboard
        target: ${SMILE_CONFIG_HOME}/resources/smile-dashboard
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

### Making changes to the schema

Pre-build steps:

Confirm your [application.properties](./graphql-server/src/env/application.properties) is up to date and points to the desired NATS and Neo4j servers.

Steps:
1. Make changes to the schema type definitions in [typeDefs.ts](./graphql-server/src/utils/typeDefs.ts)
2. Changes to any of the schemas should also result in equivalent changes to their corresponding types defined in [operations.graphql](./graphql/operations.graphql)
3. Build the backend `yarn build:backend`
4. Launch the backend `yarn dev:backend`
5. Run codegen in another window `yarn run codegen`
