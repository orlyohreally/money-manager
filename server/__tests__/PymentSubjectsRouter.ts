import { Server } from "http";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";
import * as redis from "redis-mock";
import * as request from "supertest";

import { PaymentSubject, User } from "@shared/types";
import { runServer } from "@src/server";

jest.mock("redis", () => redis);

describe("PaymentSubjectsRouter", () => {
  let server: Server;

  const routerPrefix = "/api/v1/payment-subjects";
  const mockedUser: Partial<User> = {
    firstName: "Peter",
    lastName: "Samuel",
    email: "orly.knop@gmail.com",
    password: "ABCabc123!@#",
    currency: "ILS"
  };
  const paymentSubject: Omit<
    PaymentSubject,
    "_id" | "createdAt" | "updatedAt"
  > = {
    name: "apartment",
    icon: "https://appartment.png"
  };

  beforeEach(async () => {
    const mongoServer = new MongoMemoryServer();

    const uri = await mongoServer.getUri();
    server = await runServer(8000, uri);
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
    console.log("disconnected PaymentSubjectsRouter");
  });

  it("should create new payment subject on route /payment-subjects POST", async () => {
    const { userToken } = await registerAndLogin();
    const response = await request(server)
      .post(`${routerPrefix}`)
      .send({ paymentSubject })
      .set("Authorization", `Bearer ${userToken}`);
    expect(response.ok).toBeTruthy();
    const createdSubject: PaymentSubject = response.body as PaymentSubject;
    expect(createdSubject).toBeTruthy();
    expect(createdSubject.name).toBe(paymentSubject.name);
    expect(createdSubject.icon).toBe(paymentSubject.icon);
    expect(createdSubject._id).toBeTruthy();
    expect(createdSubject.createdAt).toBeTruthy();
    expect(createdSubject.updatedAt).toBeTruthy();
  });

  it("should return list of payment subjects on route /payment-subjects GET", async () => {
    const { userToken } = await registerAndLogin();
    const responsePOST = await request(server)
      .post(`${routerPrefix}`)
      .send({ paymentSubject })
      .set("Authorization", `Bearer ${userToken}`);
    const createdSubject = responsePOST.body as PaymentSubject;
    const responseGET = await request(server)
      .get(`${routerPrefix}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(responseGET.ok).toBeTruthy();
    const paymentSubjects = responseGET.body as PaymentSubject[];
    expect(paymentSubjects).toEqual([createdSubject]);
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
