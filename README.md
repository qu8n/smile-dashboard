# SMILE Dashboard

Contents:
- [Run locally](#run-locally)
- [Running with docker-compose](#running-with-docker-compose)

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

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

### Dashboard Backend

The backend for the dashboard is under `./graphql-server`.

Set up your [./graphql-server/dist/env/application.properties.EXAMPLE](./graphql-server/dist/env/application.properties.EXAMPLE) with all of the application properties needed for running the dashboard backend.

Build and launch the node app from the project root directory with:

```
yarn build:backend
yarn dev:backend
```

If successful, the graphql client should be available at `http://localhost:4000/graphql`.

### Dashboard App

Set an environment variable `${REACT_APP_GRAPHQL_CLIENT_URI}` that points to the graphql client the webapp should be using. The app will default to `http://localhost:4000/graphql` if this is unset.

Example:

```
export REACT_APP_GRAPHQL_CLIENT_URI=http://localhost:4000/graphql
```

To run the frontend:

```
yarn dev:frontend
```

Example pages:

- http://localhost:3006/

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
        test: ["CMD", "curl", "-s", "http://localhost:4000"]
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
