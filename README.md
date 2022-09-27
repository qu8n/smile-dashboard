# SMILE Dashboard

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Run

Make sure you have installed the node version and yarn version specified in
[package.json](https://github.com/mskcc/smile-dashboard/blob/master/package.json).

> **Tip:** We recommend that you use [nvm: Node Version Manager](https://github.com/nvm-sh/nvm) and [yvm: Yarn Version Manager](https://yvm.js.org/docs/overview) to switch between versions more easily.

> **Windows Tip:** If you are developing on Windows, we recommend that you use [Ubuntu / Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

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
# set the environment variables you want based on which instance of SMILE you want to point to
export CMO_SMILE_URL=${CMO_SMILE_URL}
yarn run start
```

Example pages:

- http://localhost:3006/

> **Tip:** This page should open automatically through your default web browser. If not then please navigate to the web app manually.

## Update API clients

> **Tip:** To point to a different (i.e., local, dev, production) SMILE web service, set the environment variable `CMO_SMILE_URL` accordingly. This defaults to `http://localhost:3000` if not set.

```
yarn run updateAPI
```

## Bootstrap theme

This application uses the following Bootstrap theme https://bootstrapmade.com/nice-admin-bootstrap-admin-html-template/