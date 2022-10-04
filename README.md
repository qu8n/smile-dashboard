# SMILE Dashboard

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Run

Make sure you have installed the node version and yarn version specified in
[package.json](https://github.com/mskcc/smile-dashboard/blob/master/package.json).

> **Tip:** We recommend that you use [nvm: Node Version Manager](https://github.com/nvm-sh/nvm) and [yvm: Yarn Version Manager](https://yvm.js.org/docs/overview) to switch between versions more easily.

> **Windows Tip:** If you are developing on Windows, we recommend that you use [Ubuntu / Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

### Dashboard Backend

The backend for the dashboard is under `./server`.

Build and launch the node app with

```
cd ./server
npm install
node index.js
```

If successful, the graphql client should be available at `http://localhost:4000/graphql`.

### Dashboard App

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