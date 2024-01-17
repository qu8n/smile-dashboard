import express, { Express } from "express";
import { EXPRESS_SERVER_ORIGIN } from "./utils/constants";
import { initializeApolloServer, initializeHttpsServer } from "./utils/servers";

async function main() {
  const app: Express = express();

  require("./middlewares/express")(app);
  await require("./middlewares/session")(app);
  require("./middlewares/logging")(app);
  require("./routes")(app);

  const httpsServer = initializeHttpsServer(app);
  const apolloServer = await initializeApolloServer(httpsServer, app);

  await new Promise<void>((resolve) =>
    httpsServer.listen({ port: 4000 }, resolve)
  );

  console.log(
    `🚀 Server ready at ${EXPRESS_SERVER_ORIGIN}${apolloServer.graphqlPath}`
  );
}

main();
