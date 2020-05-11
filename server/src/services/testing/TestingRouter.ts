import { Request, Router } from "express";
import { IRouter, Response } from "express-serve-static-core";

import { FamiliesService } from "@src/services/families/FamiliesService";
import { PaymentsService } from "@src/services/payments/PaymentsService";
import { UsersService } from "@src/services/users/UsersService";
import { asyncWrap } from "@src/utils";
import { TestingService } from "./TestingService";

export class TestingRouter {
  public router: IRouter;

  private service: TestingService;
  private usersService: UsersService;
  private familiesService: FamiliesService;
  private paymentsService: PaymentsService;

  constructor({
    service,
    usersService,
    familiesService,
    paymentsService
  }: {
    service: TestingService;
    usersService: UsersService;
    familiesService: FamiliesService;
    paymentsService: PaymentsService;
  }) {
    this.router = Router();
    this.usersService = usersService;
    this.familiesService = familiesService;
    this.paymentsService = paymentsService;
    this.service = service;

    this.router.delete(
      "/testing/user/:email",
      this.service.validateCredentials.bind(service),
      asyncWrap(this.deleteUser)
    );
    this.router.delete(
      "/testing/user-data/:email",
      this.service.validateCredentials.bind(service),
      asyncWrap(this.deleteUserData)
    );
  }

  private deleteUser = async (req: Request, res: Response) => {
    try {
      const { email } = req.params as { email: string };
      const user = await this.usersService.getUser("email", email);
      if (!user) {
        return res.status(200).json({ message: "User not found" });
      }
      await this.paymentsService.deleteUserPayments(user._id.toString());
      const userFamilies = await this.familiesService.getMemberFamilies(
        user._id.toString()
      );
      userFamilies.forEach(async family => {
        await this.familiesService.deleteFamily(family._id);
      });
      await this.usersService.deleteUser(email);
      return res.status(200).json({
        message: `Successfully deleted user with email ${email}`
      });
    } catch (err) {
      return res.status(400).json(err);
    }
  };

  private deleteUserData = async (req: Request, res: Response) => {
    try {
      const { email } = req.params as { email: string };
      const user = await this.usersService.getUser("email", email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      await this.paymentsService.deleteUserPayments(user._id.toString());
      const userFamilies = await this.familiesService.getMemberFamilies(
        user._id.toString()
      );
      userFamilies.forEach(async family => {
        await this.familiesService.deleteFamily(family._id);
      });
      return res.status(200).json({
        message: `Successfully deleted all user related data for user ${email}`
      });
    } catch (err) {
      return res.status(400).json(err);
    }
  };
}
