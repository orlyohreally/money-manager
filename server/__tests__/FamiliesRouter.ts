import { Server } from "http";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";
import * as redis from "redis-mock";
import * as request from "supertest";

import { Family, FamilyView, User } from "@shared/types";
import { runServer } from "@src/server";

jest.mock("redis", () => redis);

describe("FamiliesRouter", () => {
  let server: Server;

  const routerPrefix = "/api/v1/families";
  const mockedUser: Partial<User> = {
    firstName: "Peter",
    lastName: "Samuel",
    email: "orly.knop@gmail.com",
    password: "ABCabc123!@#",
    currency: "ILS"
  };
  const family: Omit<Family, "_id" | "createdAt" | "updatedAt"> = {
    name: "Smith",
    icon: "",
    currency: "USD",
    equalPayments: true
  };

  beforeEach(async () => {
    const mongoServer = new MongoMemoryServer();

    const uri = await mongoServer.getUri();
    server = await runServer(8000, uri);
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  it("should create new family on route /families POST with no icon set", async () => {
    const { userToken } = await registerAndLogin();
    const roles: string[] = [];
    const response = await request(server)
      .post(`${routerPrefix}`)
      .send({ family, roles })
      .set("Authorization", `Bearer ${userToken}`);
    expect(response.ok).toBeTruthy();
    const createdFamily: FamilyView = response.body as FamilyView;
    expect(createdFamily).toBeTruthy();
    expect(createdFamily.name).toBe(family.name);
    expect(createdFamily.icon).toBe(family.icon);
    expect(createdFamily.currency).toBe(family.currency);
    expect(createdFamily.equalPayments).toBe(family.equalPayments);
    expect(createdFamily.membersCount).toBe(1);
    expect(createdFamily._id).toBeTruthy();
    expect(createdFamily.createdAt).toBeTruthy();
    expect(createdFamily.updatedAt).toBeTruthy();
    expect(createdFamily.spent).toBe(0);
    expect(createdFamily.userRoles).toEqual(["Owner", "Member"]);
  });

  async function registerAndLogin(): Promise<{
    user: User;
    userToken: string;
  }> {
    const userRouterPrefix = "/api/v1/users";
    await request(server)
      .post(`${userRouterPrefix}/signin`)
      .send(mockedUser);
    const response = await request(server)
      .post(`${userRouterPrefix}/login`)
      .send({ email: mockedUser.email, password: mockedUser.password });
    const { authorization } = response.header as { authorization: string };
    const { user } = response.body as { user: User };
    return { user, userToken: authorization };
  }
});
