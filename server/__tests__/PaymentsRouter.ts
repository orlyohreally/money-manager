import { Server } from "http";
import { MongoMemoryServer } from "mongodb-memory-server";
import * as mongoose from "mongoose";
import * as redis from "redis-mock";
import * as request from "supertest";

import {
  Family,
  FamilyMember,
  FamilyView,
  Payment,
  PaymentSubject,
  Roles,
  User
} from "@shared/types";
import { runServer } from "@src/server";

jest.mock("redis", () => redis);

describe("PaymentsRouter", () => {
  let server: Server;
  // mongoose.set("debug", true);

  const routerPrefix = "/api/v1/payments";
  const mockedUser: Omit<User, "_id" | "updatedAt" | "createdAt"> = {
    firstName: "Peter",
    lastName: "Samuel",
    email: "orly.knop@gmail.com",
    password: "ABCabc123!@#",
    currency: "ILS"
  };
  const mockedAnotherUser: Omit<User, "_id" | "updatedAt" | "createdAt"> = {
    firstName: "Peter",
    lastName: "Peterson",
    email: "orli-knop@ya.ru",
    password: "ABCabc123!@#"
  };

  beforeEach(async () => {
    const mongoServer = new MongoMemoryServer();

    const uri = await mongoServer.getUri();
    server = await runServer(3000, uri);
  });

  afterEach(async () => {
    server.close();
    await mongoose.disconnect();
  });

  describe("Family payments", () => {
    describe("Create payment on route /payments/:familyId POST", () => {
      it("should get error code unauthorized when no authorization token provided", async () => {
        const { userToken, user } = await registerAndLogin(mockedUser);

        const familyId = await createFamily([], userToken);
        await createPaymentSubject(userToken);
        const paymentSubjects = await getPaymentSubjects(userToken, familyId);
        const payment: Omit<Payment, "_id" | "paymentPercentages"> = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020"),
          userId: user._id
        };
        const response = await request(server)
          .post(`${routerPrefix}/${familyId}`)
          .send({ payment });
        expect(response.unauthorized).toBeTruthy();
        expect(await getPayments(userToken, familyId)).toEqual([]);
      });

      it("should create new family payment when no paymentPercentages set", async () => {
        const { userToken, user } = await registerAndLogin(mockedUser);

        const familyId = await createFamily([], userToken);
        await createPaymentSubject(userToken);
        const paymentSubjects = await getPaymentSubjects(userToken, familyId);
        const payment: Omit<Payment, "_id" | "paymentPercentages"> = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020"),
          userId: user._id
        };
        const response = await request(server)
          .post(`${routerPrefix}/${familyId}`)
          .send({ payment })
          .set("Authorization", `Bearer ${userToken}`);
        const createdPayment = response.body as Payment;
        expect(response.ok).toBeTruthy();
        expect(createdPayment.amount).toBe(payment.amount);
        expect(createdPayment.familyId).toEqual(familyId);
        expect(createdPayment.paymentPercentages).toEqual([
          { paymentPercentage: 100, userId: user._id }
        ]);
        expect(createdPayment.subjectId).toBe(payment.subjectId);
        expect(createdPayment.createdAt).toBeTruthy();
        expect(new Date(createdPayment.paidAt)).toEqual(payment.paidAt);
        expect(createdPayment.updatedAt).toBeTruthy();

        expect(await getPayments(userToken, familyId)).toEqual([
          createdPayment
        ]);
      });

      it("should get error code forbidden when user is not family member of set family", async () => {
        const anotherUserToken = (await registerAndLogin(mockedAnotherUser))
          .userToken;
        const familyId = await createFamily([], anotherUserToken);

        const { userToken, user } = await registerAndLogin(mockedUser);
        await createFamily([], userToken);
        await createPaymentSubject(userToken);
        const paymentSubjects = await getPaymentSubjects(userToken, familyId);
        const payment: Omit<Payment, "_id" | "paymentPercentages"> = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020"),
          userId: user._id
        };
        const response = await request(server)
          .post(`${routerPrefix}/${familyId}`)
          .send({ payment })
          .set("Authorization", `Bearer ${userToken}`);
        expect(response.forbidden).toBeTruthy();
      });

      it("should create family payment with payment.userId authorized user when userId is not set", async () => {
        const { user, userToken } = await registerAndLogin(mockedUser);

        const familyId = await createFamily([], userToken);
        await createPaymentSubject(userToken);
        const paymentSubjects = await getPaymentSubjects(userToken, familyId);
        const payment: Omit<
          Payment,
          "_id" | "paymentPercentages" | "userId"
        > = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020")
        };
        const response = await request(server)
          .post(`${routerPrefix}/${familyId}`)
          .send({ payment })
          .set("Authorization", `Bearer ${userToken}`);
        expect(response.ok).toBeTruthy();
        const createdPayment = response.body as Payment;
        expect(createdPayment.amount).toBe(payment.amount);
        expect(createdPayment.familyId).toEqual(familyId);
        expect(createdPayment.paymentPercentages).toEqual([
          { paymentPercentage: 100, userId: user._id }
        ]);
        expect(createdPayment.subjectId).toBe(payment.subjectId);
        expect(createdPayment.createdAt).toBeTruthy();
        expect(new Date(createdPayment.paidAt)).toEqual(payment.paidAt);
        expect(createdPayment.updatedAt).toBeTruthy();

        expect(await getPayments(userToken, familyId)).toEqual([
          createdPayment
        ]);
      });

      it("should get error code forbidden when payment.userId is not family member", async () => {
        const { userToken } = await registerAndLogin(mockedUser);

        const familyId = await createFamily([], userToken);
        const anotherUserId = (await registerAndLogin(mockedAnotherUser)).user
          ._id;

        await createPaymentSubject(userToken);
        const paymentSubjects = await getPaymentSubjects(userToken, familyId);
        const payment: Omit<Payment, "_id" | "paymentPercentages"> = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020"),
          userId: anotherUserId
        };
        const response = await request(server)
          .post(`${routerPrefix}/${familyId}`)
          .send({ payment })
          .set("Authorization", `Bearer ${userToken}`);
        expect(response.forbidden).toBeTruthy();
        expect(await getPayments(userToken, familyId)).toEqual([]);
      });

      it("should create family payment when authorized user is family admin and payment.userId is not authorized user", async () => {
        const { user, userToken } = await registerAndLogin(mockedUser);
        const familyId = await createFamily([Roles.Admin], userToken);
        const {
          user: anotherUser,
          userToken: anotherUserToken
        } = await registerAndLogin(mockedAnotherUser);
        await addFamilyMember(userToken, familyId, mockedAnotherUser.email);
        await createPaymentSubject(userToken);
        const paymentSubjects = await getPaymentSubjects(userToken, familyId);
        const payment: Omit<Payment, "_id" | "paymentPercentages"> = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020"),
          userId: anotherUser._id
        };
        const response = await request(server)
          .post(`${routerPrefix}/${familyId}`)
          .send({ payment })
          .set("Authorization", `Bearer ${userToken}`);
        expect(response.ok).toBeTruthy();
        const createdPayment = response.body as Payment;
        expect(createdPayment.amount).toBe(payment.amount);
        expect(createdPayment.familyId).toBe(familyId);
        expect(createdPayment.userId).toBe(anotherUser._id);
        expect(createdPayment.paymentPercentages).toEqual([
          { paymentPercentage: 50, userId: user._id },
          { paymentPercentage: 50, userId: anotherUser._id }
        ]);
        expect(createdPayment.subjectId).toBe(payment.subjectId);
        expect(createdPayment.createdAt).toBeTruthy();
        expect(new Date(createdPayment.paidAt)).toEqual(payment.paidAt);
        expect(createdPayment.updatedAt).toBeTruthy();
        expect(await getPayments(userToken, familyId)).toEqual([
          createdPayment
        ]);
        expect(await getPayments(anotherUserToken, familyId)).toEqual([
          createdPayment
        ]);
      });

      it("should get error code forbidden when authorized user is not family admin and payment.userId is not authorized user", async () => {
        const { userToken } = await registerAndLogin(mockedUser);
        const familyId = await createFamily([], userToken);
        const memberEmail = "orli-knop@yandex.ru";
        const anotherUserId = (await registerAndLogin(mockedAnotherUser)).user
          ._id;
        await addFamilyMember(userToken, familyId, memberEmail);
        await createPaymentSubject(userToken);
        const paymentSubjects = await getPaymentSubjects(userToken, familyId);
        const payment: Omit<Payment, "_id" | "paymentPercentages"> = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020"),
          userId: anotherUserId
        };
        const response = await request(server)
          .post(`${routerPrefix}/${familyId}`)
          .send({ payment })
          .set("Authorization", `Bearer ${userToken}`);
        expect(response.forbidden).toBeTruthy();
        expect(await getPayments(userToken, familyId)).toEqual([]);
      });

      it("should get error code forbidden when family payment is created with payment.userId of not family member", async () => {
        const { userToken } = await registerAndLogin(mockedUser);
        const familyId = await createFamily([Roles.Admin], userToken);
        const anotherUserId = (await registerAndLogin(mockedAnotherUser)).user
          ._id;
        await createPaymentSubject(userToken);
        const paymentSubjects = await getPaymentSubjects(userToken, familyId);
        const payment: Omit<Payment, "_id" | "paymentPercentages"> = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020"),
          userId: anotherUserId
        };
        const response = await request(server)
          .post(`${routerPrefix}/${familyId}`)
          .send({ payment })
          .set("Authorization", `Bearer ${userToken}`);
        expect(response.forbidden).toBeTruthy();
        expect(await getPayments(userToken, familyId)).toEqual([]);
      });
    });

    describe("Update payment on /payments/:familyId/:paymentId", () => {
      it("should update family payment when authorized user is family admin and payment.userId is not authorized user", async () => {
        const { user, userToken } = await registerAndLogin(mockedUser);
        const familyId = await createFamily([Roles.Admin], userToken);
        const {
          user: anotherUser,
          userToken: anotherUserToken
        } = await registerAndLogin(mockedAnotherUser);
        await addFamilyMember(userToken, familyId, mockedAnotherUser.email);
        await createPaymentSubject(userToken);
        const paymentSubjects = await getPaymentSubjects(userToken, familyId);
        const payment: Omit<Payment, "_id" | "paymentPercentages"> = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020"),
          userId: anotherUser._id
        };
        const { _id } = (await request(server)
          .post(`${routerPrefix}/${familyId}`)
          .send({ payment })
          .set("Authorization", `Bearer ${userToken}`)).body as Payment;
        const updatedAmount = 150;
        const response = await request(server)
          .put(`${routerPrefix}/${familyId}/${_id}`)
          .send({ payment: { ...payment, amount: updatedAmount } })
          .set("Authorization", `Bearer ${userToken}`);
        expect(response.ok).toBeTruthy();
        const updatedPayment = response.body as Payment;
        expect(updatedPayment.amount).toBe(updatedAmount);
        expect(updatedPayment.familyId).toBe(familyId);
        expect(updatedPayment.userId).toBe(anotherUser._id);
        expect(updatedPayment.paymentPercentages).toEqual([
          { paymentPercentage: 50, userId: user._id },
          { paymentPercentage: 50, userId: anotherUser._id }
        ]);
        expect(updatedPayment.subjectId).toBe(payment.subjectId);
        expect(updatedPayment.createdAt).toBeTruthy();
        expect(new Date(updatedPayment.paidAt)).toEqual(payment.paidAt);
        expect(updatedPayment.updatedAt).toBeTruthy();
        expect(await getPayments(userToken, familyId)).toEqual([
          updatedPayment
        ]);
        expect(await getPayments(anotherUserToken, familyId)).toEqual([
          updatedPayment
        ]);
      });

      it("should get error code forbidden when family payment is updated with payment.userId of not family member", async () => {
        const { user, userToken } = await registerAndLogin(mockedUser);
        const familyId = await createFamily([Roles.Admin], userToken);
        const anotherUserId = (await registerAndLogin(mockedAnotherUser)).user
          ._id;
        await createPaymentSubject(userToken);
        const paymentSubjects = await getPaymentSubjects(userToken, familyId);
        const payment: Omit<Payment, "_id" | "paymentPercentages"> = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020"),
          userId: user._id
        };
        const createdPayment = (await request(server)
          .post(`${routerPrefix}/${familyId}`)
          .send({ payment })
          .set("Authorization", `Bearer ${userToken}`)).body as Payment;
        const response = await request(server)
          .put(`${routerPrefix}/${familyId}/${createdPayment._id}`)
          .send({ payment: { ...payment, userId: anotherUserId } })
          .set("Authorization", `Bearer ${userToken}`);
        expect(response.forbidden).toBeTruthy();
        expect(await getPayments(userToken, familyId)).toEqual([
          createdPayment
        ]);
      });
    });

    describe("Get payments on route /payments/:familyId GET", () => {
      it("should return family payments", async () => {
        const { userToken, user } = await registerAndLogin(mockedUser);
        await createPaymentSubject(userToken);
        const paymentSubjects = await getPaymentSubjects(userToken);
        const userPayment: Omit<
          Payment,
          "_id" | "paymentPercentages" | "userId"
        > = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020")
        };
        await request(server)
          .post(routerPrefix)
          .send({ payment: userPayment })
          .set("Authorization", `Bearer ${userToken}`);
        const familyId = await createFamily([], userToken);
        const familyPayment: Omit<Payment, "_id" | "paymentPercentages"> = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020"),
          userId: user._id
        };
        const createdFamilyPayment = (await request(server)
          .post(`${routerPrefix}/${familyId}`)
          .send({ payment: familyPayment })
          .set("Authorization", `Bearer ${userToken}`)).body as Payment;

        const response = await request(server)
          .get(`${routerPrefix}/${familyId}`)
          .set("Authorization", `Bearer ${userToken}`);
        expect(response.ok).toBeTruthy();
        expect(response.body).toEqual([createdFamilyPayment]);
      });
    });

    it("should return forbidden when user is not family member", async () => {
      const { userToken } = await registerAndLogin(mockedUser);
      // tslint:disable-next-line: max-line-length
      const anotherUserToken = (await registerAndLogin(mockedAnotherUser))
        .userToken;
      await createPaymentSubject(userToken);
      const paymentSubjects = await getPaymentSubjects(userToken);
      const userPayment: Omit<
        Payment,
        "_id" | "paymentPercentages" | "userId"
      > = {
        amount: 100,
        subjectId: paymentSubjects[0]._id,
        paidAt: new Date("01.02.2020")
      };
      await request(server)
        .post(routerPrefix)
        .send({ payment: userPayment })
        .set("Authorization", `Bearer ${userToken}`);
      const familyId = await createFamily([], userToken);
      // tslint:disable-next-line: max-line-length
      const familyPayment: Omit<
        Payment,
        "_id" | "paymentPercentages" | "userId"
      > = {
        amount: 100,
        subjectId: paymentSubjects[0]._id,
        paidAt: new Date("01.02.2020")
      };
      await request(server)
        .post(`${routerPrefix}/${familyId}`)
        .send({ payment: familyPayment })
        .set("Authorization", `Bearer ${userToken}`);

      const response = await request(server)
        .get(`${routerPrefix}/${familyId}`)
        .set("Authorization", `Bearer ${anotherUserToken}`);
      expect(response.forbidden).toBeTruthy();
    });
  });

  describe("User payments", () => {
    describe("Create payment on route /payments POST", () => {
      it("should create new user payment with no paymentPercentages set", async () => {
        const { userToken } = await registerAndLogin(mockedUser);
        await createPaymentSubject(userToken);
        const paymentSubjects = await getPaymentSubjects(userToken);
        const payment: Omit<
          Payment,
          "_id" | "paymentPercentages" | "userId"
        > = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020")
        };
        const response = await request(server)
          .post(routerPrefix)
          .send({ payment })
          .set("Authorization", `Bearer ${userToken}`);
        const createdPayment = response.body as Payment;
        expect(response.ok).toBeTruthy();
        expect(createdPayment.amount).toBe(payment.amount);
        expect(createdPayment.familyId).toBeFalsy();
        expect(createdPayment.paymentPercentages).toEqual([]);
        expect(createdPayment.subjectId).toBe(payment.subjectId);
        expect(createdPayment.createdAt).toBeTruthy();
        expect(new Date(createdPayment.paidAt)).toEqual(payment.paidAt);
        expect(createdPayment.updatedAt).toBeTruthy();

        expect(await getPayments(userToken)).toEqual([createdPayment]);
      });
    });

    describe("Update payment on route /payments/:paymentId PUT", () => {
      it("should update user payment", async () => {
        const { userToken } = await registerAndLogin(mockedUser);

        await createPaymentSubject(userToken);
        const paymentSubjects = await getPaymentSubjects(userToken);
        const payment: Omit<
          Payment,
          "_id" | "paymentPercentages" | "userId"
        > = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020")
        };
        const responsePOST = await request(server)
          .post(routerPrefix)
          .send({ payment })
          .set("Authorization", `Bearer ${userToken}`);
        const { _id } = responsePOST.body as Payment;
        const updatedAmount = 150;
        const responsePUT = await request(server)
          .put(`${routerPrefix}/${_id}`)
          .send({ payment: { ...payment, amount: updatedAmount } })
          .set("Authorization", `Bearer ${userToken}`);
        const updatedPayment = responsePUT.body as Payment;
        expect(responsePUT.ok).toBeTruthy();
        expect(updatedPayment.amount).toBe(updatedAmount);
        expect(updatedPayment.familyId).toBeFalsy();
        expect(updatedPayment.paymentPercentages).toEqual([]);
        expect(updatedPayment.subjectId).toBe(payment.subjectId);
        expect(updatedPayment.createdAt).toBeTruthy();
        expect(new Date(updatedPayment.paidAt)).toEqual(payment.paidAt);
        expect(updatedPayment.updatedAt).toBeTruthy();

        expect(await getPayments(userToken)).toEqual([updatedPayment]);
      });

      it("should return error code unauthorized for route /payments/:paymentId PUT when no authorization token provided", async () => {
        const { userToken } = await registerAndLogin(mockedUser);

        await createPaymentSubject(userToken);
        const paymentSubjects = await getPaymentSubjects(userToken);
        const payment: Omit<
          Payment,
          "_id" | "paymentPercentages" | "userId"
        > = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020")
        };
        const responsePOST = await request(server)
          .post(routerPrefix)
          .send({ payment })
          .set("Authorization", `Bearer ${userToken}`);
        const createdPayment = responsePOST.body as Payment;
        const responsePUT = await request(server)
          .put(`${routerPrefix}/${createdPayment._id}`)
          .send({ payment: { ...payment, amount: 150 } });
        expect(responsePUT.unauthorized).toBeTruthy();
        expect(await getPayments(userToken)).toEqual([createdPayment]);
      });

      it("should return error code forbidden for route /payments/:paymentId PUT when set payment is not user's", async () => {
        const anotherUserToken = (await registerAndLogin(mockedAnotherUser))
          .userToken;

        await createPaymentSubject(anotherUserToken);
        const paymentSubjects = await getPaymentSubjects(anotherUserToken);
        const payment: Omit<
          Payment,
          "_id" | "paymentPercentages" | "userId"
        > = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020")
        };
        const responsePOST = await request(server)
          .post(routerPrefix)
          .send({ payment })
          .set("Authorization", `Bearer ${anotherUserToken}`);
        const createdPayment = responsePOST.body as Payment;
        const { userToken } = await registerAndLogin(mockedUser);
        const responsePUT = await request(server)
          .put(`${routerPrefix}/${createdPayment._id}`)
          .set("Authorization", `Bearer ${userToken}`)
          .send({ payment: { ...payment, amount: 150 } });
        expect(responsePUT.forbidden).toBeTruthy();
        expect(await getPayments(anotherUserToken)).toEqual([createdPayment]);
        expect(await getPayments(userToken)).toEqual([]);
      });
    });

    describe("Get payments on route /payments/ GET", () => {
      it("should return all user payments (including family payments)", async () => {
        const { userToken, user } = await registerAndLogin(mockedUser);

        await createPaymentSubject(userToken);
        const paymentSubjects = await getPaymentSubjects(userToken);
        const userPayment: Omit<
          Payment,
          "_id" | "paymentPercentages" | "userId"
        > = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020")
        };
        const createdUserPayment = (await request(server)
          .post(routerPrefix)
          .send({ payment: userPayment })
          .set("Authorization", `Bearer ${userToken}`)).body as Payment;
        const familyId = await createFamily([], userToken);
        const familyPayment: Omit<Payment, "_id" | "paymentPercentages"> = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020"),
          userId: user._id
        };
        const createdFamilyPayment = (await request(server)
          .post(`${routerPrefix}/${familyId}`)
          .send({ payment: familyPayment })
          .set("Authorization", `Bearer ${userToken}`)).body as Payment;

        const response = await request(server)
          .get(routerPrefix)
          .set("Authorization", `Bearer ${userToken}`);
        expect(response.ok).toBeTruthy();
        expect(response.body).toEqual([
          createdUserPayment,
          createdFamilyPayment
        ]);
      });

      it("should get error code unauthorized when authorization token is set", async () => {
        const { userToken, user } = await registerAndLogin(mockedUser);

        await createPaymentSubject(userToken);
        const paymentSubjects = await getPaymentSubjects(userToken);
        const familyId = await createFamily([], userToken);
        const familyPayment: Omit<Payment, "_id" | "paymentPercentages"> = {
          amount: 100,
          subjectId: paymentSubjects[0]._id,
          paidAt: new Date("01.02.2020"),
          userId: user._id
        };
        await request(server)
          .post(`${routerPrefix}/${familyId}`)
          .send({ payment: familyPayment })
          .set("Authorization", `Bearer ${userToken}`);

        const response = await request(server).get(routerPrefix);
        expect(response.unauthorized).toBeTruthy();
      });
    });
  });

  async function registerAndLogin(
    userInfo: Omit<User, "_id" | "updatedAt" | "createdAt">
  ): Promise<{
    user: User;
    userToken: string;
  }> {
    const userRouterPrefix = "/api/v1/users";
    await request(server)
      .post(`${userRouterPrefix}/signin`)
      .send(userInfo);
    const response = await request(server)
      .post(`${userRouterPrefix}/login`)
      .send({ email: userInfo.email, password: userInfo.password });
    const { authorization } = response.header as { authorization: string };
    const { user } = response.body as { user: User };
    return { user, userToken: authorization };
  }

  async function createFamily(
    roles: string[],
    userToken: string
  ): Promise<string> {
    const family: Omit<Family, "_id" | "createdAt" | "updatedAt"> = {
      name: "Smith",
      icon: "",
      currency: "USD",
      equalPayments: true
    };
    const familiesRouterPrefix = "/api/v1/families";
    const response = await request(server)
      .post(`${familiesRouterPrefix}`)
      .send({ family, roles })
      .set("Authorization", `Bearer ${userToken}`);
    const { _id } = response.body as FamilyView;
    return _id;
  }

  async function getPaymentSubjects(
    userToken: string,
    familyId?: string
  ): Promise<PaymentSubject[]> {
    const subjectsRouterPrefix = "/api/v1/payment-subjects";
    const response = await request(server)
      .get(`${subjectsRouterPrefix}/${familyId ? familyId : ""}`)
      .set("Authorization", `Bearer ${userToken}`);
    return response.body as PaymentSubject[];
  }

  async function createPaymentSubject(
    userToken: string,
    familyId?: string
  ): Promise<void> {
    const subjectsRouterPrefix = "/api/v1/payment-subjects";
    const paymentSubject: Omit<
      PaymentSubject,
      "_id" | "createdAt" | "updatedAt"
    > = {
      name: "apartment",
      icon: "https://icon.png"
    };
    const response = await request(server)
      .post(`${subjectsRouterPrefix}/${familyId ? familyId : ""}`)
      .send({ paymentSubject })
      .set("Authorization", `Bearer ${userToken}`);
    expect(response.ok).toBeTruthy();
  }

  async function getPayments(
    userToken: string,
    familyId?: string
  ): Promise<Payment[]> {
    const requestGet = await request(server)
      .get(`${routerPrefix}${familyId ? `/${familyId}` : ""}`)
      .set("Authorization", `Bearer ${userToken}`);
    return requestGet.body as Payment[];
  }

  async function addFamilyMember(
    userToken: string,
    familyId: string,
    memberEmail: string
  ): Promise<FamilyMember[]> {
    const response = await request(server)
      .post(`/api/v1/families/${familyId}/members`)
      .send({ email: memberEmail })
      .set("Authorization", `Bearer ${userToken}`);
    return response.body as FamilyMember[];
  }
});
