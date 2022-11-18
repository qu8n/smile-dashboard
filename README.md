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

### Dashboard Backend

The backend for the dashboard is under `./server`.

Set up your [./server/env/application.properties.EXAMPLE](./server/env/application.properties.EXAMPLE) with all of the application properties needed for running the dashboard backend.

Build and launch the node app with

```
cd ./server
npm install
node index.js
```

If successful, the graphql client should be available at `http://localhost:4000/graphql`.

### Dashboard App

Set an environment variable `${REACT_APP_GRAPHQL_CLIENT_URI}` that points to the graphql client the webapp should be using.

Example:

```
export REACT_APP_GRAPHQL_CLIENT_URI=http://localhost:4000/graphql
```

Remove old compiled `node_modules` if it exists

```
rm -rf node_modules
```

To install all app dependencies

```
yarn install
```

To start the dev server with hot reload enabled

```
yarn run start
```

Example pages:

- http://localhost:3006/

> **Tip:** This page should open automatically through your default web browser. If not then please navigate to the web app manually.

## Bootstrap theme

This application uses the following Bootstrap theme https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/

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
    image: cmometadb/graphql-client:1.0.0.RELEASE
    environment:
      - SMILE_CONFIG_HOME=${SMILE_CONFIG_HOME}
    volumes:
      - type: bind
        source: ${SMILE_CONFIG_HOME}/resources/smile-dashboard
        target: /server/env
      - type: bind
        source: ${SMILE_CONFIG_HOME}/nats
        target: /server/nats
    external_links:
      - nats-jetstream
      - neo4j
    ports:
      - 4000:4000
    healthcheck:
        test: ["CMD", "curl", "-s", "http://localhost:4000"]
        interval: 30s
        timeout: 10s
        retries: 5

  smile-dashboard:
    container_name: smile-dashboard
    image: cmometadb/smile-dashboard:1.0.0.RELEASE
    restart: on-failure
    environment:
      - REACT_APP_GRAPHQL_CLIENT_URI=http://localhost:4000/graphql
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
