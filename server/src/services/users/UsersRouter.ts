import { User } from "@shared/types";
import { asyncWrap } from "@src/utils";
import { Request, Router } from "express";
import { IRouter, Response } from "express-serve-static-core";
import { UsersService } from "./UsersService";

export class UsersRouter {
  public router: IRouter;
  private service: UsersService;

  constructor({ service }: { service: UsersService }) {
    this.router = Router();
    this.service = service;
    this.service.testHashSetUp();

    this.router.get("/users", asyncWrap(this.getUser));
    this.router.post("/users", asyncWrap(this.postUser));
  }

  private getUser = async (req: Request, res: Response) => {
    try {
      const user = req.body as User;
      if (!user.password || !user.email) {
        return res.status(400).send("Email and password are required");
      }
      try {
        const registeredUser = await this.service.authUser(user);
        const token = this.service.generateAuthToken(registeredUser);
        return res
          .header("x-auth-token", token)
          .status(200)
          .json({
            _id: registeredUser._id,
            firstName: registeredUser.firstName,
            lastName: registeredUser.lastName,
            email: registeredUser.email
          });
      } catch (er) {
        return res.status(503).json("Wrong email or password.");
      }
    } catch (err) {
      return res.status(400).json(err);
    }
  };

  private postUser = async (req: Request, res: Response) => {
    try {
      const user = req.body as User;
      const { error } = this.service.validateUser(user);
      if (error) {
        return res.status(400).send(error.details[0]);
      }
      const registeredUser = await this.service.getUser(user.email);
      if (registeredUser) {
        return res.status(400).send("User already registered.");
      }
      const newUser = await this.service.registerUser(user);
      const token = this.service.generateAuthToken(newUser);
      return res
        .header("x-auth-token", token)
        .status(200)
        .json({
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email
        });
    } catch (err) {
      return res.status(400).json(err);
    }
  };
}
