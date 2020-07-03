import { Server } from "http";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";
import * as redis from "redis-mock";
import * as request from "supertest";

import { runServer } from "@src/server";

jest.mock("redis", () => redis);

describe("SupportRouter", () => {
  let server: Server;

  const routerPrefix = "/api/v1/support";

  beforeEach(async () => {
    const mongoServer = new MongoMemoryServer();

    const uri = await mongoServer.getUri();
    server = await runServer(8000, uri);
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should send email to support on route /support/contact POST with email, subject and message set", async () => {
    const email = "orly.knop@gmail.com";
    const message = "Members are not displaying correctly";
    const subject = "Not working";

    const response = await request(server)
      .post(`${routerPrefix}/contact`)
      .send({ email, message, subject });

    expect(response.ok).toBeTruthy();
    const body = response.body as { message: string };
    expect(body.message).toBeTruthy();
  });
});
