import express, { Express } from "express";
import { REACT_APP_EXPRESS_SERVER_ORIGIN } from "./utils/constants";
import { initializeApolloServer, initializeHttpsServer } from "./utils/servers";
import { configureApp } from "./middlewares/configureApp";
import { configureSession } from "./middlewares/configureSession";
import { configureLogging } from "./middlewares/configureLogging";
import { configureRoutes } from "./routes";

async function main() {
  const app: Express = express();

  configureApp(app);
  await configureSession(app);
  configureLogging(app);
  configureRoutes(app);

  const httpsServer = initializeHttpsServer(app);
  const apolloServer = await initializeApolloServer(httpsServer, app);

  await new Promise<void>((resolve) =>
    httpsServer.listen({ port: 4000 }, resolve)
  );

  console.log(
    `🚀 Server ready at ${REACT_APP_EXPRESS_SERVER_ORIGIN}${apolloServer.graphqlPath}`
  );
}

main();
