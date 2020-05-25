import { Server } from "http";
import { BAD_REQUEST } from "http-status-codes";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";
import * as redis from "redis-mock";
import * as request from "supertest";

import { User } from "@shared/types";
import { runServer } from "@src/server";

jest.mock("redis", () => redis);

describe("Registration", () => {
  let server: Server;
  mongoose.set("debug", true);

  const routerPrefix = "/api/v1/users";
  const user: Partial<User> = {
    firstName: "Peter",
    lastName: "Samuel",
    email: "orly.knop@gmail.com",
    password: "ABCabc123!@#",
    currency: "ILS"
  };

  beforeEach(async () => {
    const mongoServer = new MongoMemoryServer({
      instance: { port: 4000, dbName: "testtest" }
    });

    const uri = await mongoServer.getUri();
    server = await runServer(8000, uri);
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should register user on route /signin POST", async () => {
    const result = await request(server)
      .post(`${routerPrefix}/signin`)
      .send(user);
    expect(result.status).toEqual(200);
    expect(result.type).toEqual("application/json");
    expect(result.body).toBeTruthy();
    const { verificationToken } = result.body as {
      verificationToken: string;
    };
    expect(verificationToken).toBeTruthy();
  });

  it("should not register user on route /signin POST if email is taken", async () => {
    const newUser: Partial<User> = {
      firstName: "Olive",
      lastName: "Peterson",
      email: user.email,
      password: "ABCabc123!@#",
      currency: "USD"
    };

    await request(server)
      .post(`${routerPrefix}/signin`)
      .send({ user });

    const result = await request(server)
      .post(`${routerPrefix}/signin`)
      .send({ user: newUser });
    expect(result.badRequest).toBeTruthy();
    expect(result.type).toEqual("application/json");
  });

  it("should not register user on route /signin POST if email is not valid (email does not receive messages)", async () => {
    const result = await request(server)
      .post(`${routerPrefix}/signin`)
      .send({ ...user, email: "test@gmail.com" });
    expect(result.status).toEqual(BAD_REQUEST);
    expect(result.type).toEqual("application/json");
  });
});
