import { asyncWrap } from "@src/utils";
import { Request, Router } from "express";
import { IRouter, Response } from "express-serve-static-core";
import { UsersService } from "./UsersService";

export class UsersRouter {
  public router: IRouter;
  private service: UsersService;
  //   private defaultTestingUser: string = "5ce668811560500ebce13891";

  constructor({ service }: { service: UsersService }) {
    this.router = Router();
    this.service = service;

    this.router.post("/users", asyncWrap(this.postUser));
  }
  private postUser = async (req: Request, res: Response) => {
    try {
      const newUser = await this.service.createUser(req.body.user);
      res.status(200).json(newUser);
    } catch (err) {
      res.status(400).json(err);
    }
  };
}
