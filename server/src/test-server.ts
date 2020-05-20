import { MongoMemoryServer } from "mongodb-memory-server";

import { runServer } from "./server";
import { testingService } from "./services/testing";

const runTestServer = async () => {
  const mongoServer = new MongoMemoryServer();
  const mongoUri = await mongoServer.getUri();
  const port = parseInt(process.env.PORT as string);

  await runServer(port, mongoUri).catch(console.error);
  await testingService.prepareDBForTests();
};

runTestServer().catch(console.error);
