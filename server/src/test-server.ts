import { MongoMemoryServer } from "mongodb-memory-server";

import { runServer } from "./server";

const runTestServer = async () => {
  const mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  const port = parseInt(process.env.PORT as string);

  runServer(port, mongoUri).catch(console.error);
};

runTestServer().catch(console.error);
