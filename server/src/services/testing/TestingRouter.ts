import { Request, Router } from "express";
import { IRouter, Response } from "express-serve-static-core";

import { UsersService } from "@src/services/users/UsersService";
import { asyncWrap } from "@src/utils";
import { TestingService } from "./TestingService";

export class TestingRouter {
  public router: IRouter;

  private service: TestingService;
  private usersService: UsersService;

  constructor({
    service,
    usersService
  }: {
    service: TestingService;
    usersService: UsersService;
  }) {
    this.router = Router();
    this.usersService = usersService;
    this.service = service;

    this.router.delete(
      "/testing/user/:email",
      this.service.validateCredentials.bind(service),
      asyncWrap(this.deleteUser)
    );
  }

  private deleteUser = async (req: Request, res: Response) => {
    try {
      const { email } = req.params as { email: string };

      await this.usersService.deleteUser(email);
      return res.status(200).json({
        message: `Successfully deleted user with email ${email}`
      });
    } catch (err) {
      return res.status(400).json(err);
    }
  };
}
