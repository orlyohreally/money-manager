import { User } from "@shared/types";
import { RedisService } from "@src/services/redis/RedisService";
import { asyncWrap } from "@src/utils";
import { Request, Router } from "express";
import { IRouter, Response } from "express-serve-static-core";
import { UsersService } from "./UsersService";

export class UsersRouter {
  public router: IRouter;
  private service: UsersService;
  private redisService: RedisService;

  constructor({
    service,
    redisService
  }: {
    service: UsersService;
    redisService: RedisService;
  }) {
    this.router = Router();
    this.service = service;
    this.redisService = redisService;

    this.service.testHashSetUp();

    this.router.post("/users/login", asyncWrap(this.loginUser));
    this.router.post("/users/signin", asyncWrap(this.registerUser));
    this.router.post(
      "/users/refresh-token",
      this.service.validateToken.bind(this.service),
      asyncWrap(this.refreshToken)
    );
  }

  private loginUser = async (req: Request, res: Response) => {
    try {
      const user = req.body as User;
      if (!user.password || !user.email) {
        return res.status(400).send("Email and password are required");
      }
      try {
        const registeredUser = await this.service.authUser(user);
        const token = this.service.generateAuthToken(registeredUser);
        const refreshToken = this.service.generateRefreshToken(registeredUser);
        await this.redisService.set(`refreshTokens.${token}`, refreshToken);
        return res
          .header("Authorization", token)
          .status(200)
          .json({
            _id: registeredUser._id,
            firstName: registeredUser.firstName,
            lastName: registeredUser.lastName,
            email: registeredUser.email,
            refreshToken
          });
      } catch (er) {
        return res.status(401).json("Wrong email or password.");
      }
    } catch (err) {
      return res.status(400).json(err);
    }
  };

  private registerUser = async (req: Request, res: Response) => {
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
      const refreshToken = this.service.generateRefreshToken(newUser);
      await this.redisService.set(`refreshTokens.${token}`, refreshToken);

      return res
        .header("Authorization", token)
        .status(200)
        .json({
          _id: newUser._id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          refreshToken
        });
    } catch (err) {
      return res.status(400).json(err);
    }
  };

  private refreshToken = async (req: Request, res: Response) => {
    try {
      const reqBody = req.body as { refreshToken: string; user: User };
      const token = (req.headers.authorization as string).split("Bearer ")[1];
      const refreshToken = reqBody.refreshToken;
      if (!token || !refreshToken) {
        return res
          .status(400)
          .send("Authentication token or refresh token were not provided");
      }
      const savedRefreshToken = await this.redisService.get(
        `refreshTokens.${token}`
      );
      if (refreshToken === savedRefreshToken) {
        const newToken = this.service.generateAuthToken(reqBody.user);
        const newRefreshToken = this.service.generateRefreshToken(reqBody.user);
        await this.redisService.remove(`refreshTokens.${token}`);
        await this.redisService.set(
          `refreshTokens.${newToken}`,
          newRefreshToken
        );

        return res
          .header("Authorization", newToken)
          .status(200)
          .json({
            newRefreshToken
          });
      }
      return res.status(400).send("Invalid refresh or authentication token");
    } catch (err) {
      return res.status(400).json(err);
    }
  };
}
