import { User, VerificationToken } from "@shared/types";
// tslint:disable-next-line: max-line-length
import { EmailSenderService } from "@src/services/email-sender/EmailSenderService";
import { RedisService } from "@src/services/redis/RedisService";
import { asyncWrap } from "@src/utils";
import { Request, Router } from "express";
import { IRouter, Response } from "express-serve-static-core";
import { UsersService } from "./UsersService";

export class UsersRouter {
  public router: IRouter;
  private service: UsersService;
  private redisService: RedisService;
  private emailSenderService: EmailSenderService;

  constructor({
    service,
    redisService,
    emailSenderService
  }: {
    service: UsersService;
    redisService: RedisService;
    emailSenderService: EmailSenderService;
  }) {
    this.router = Router();
    this.service = service;
    this.redisService = redisService;
    this.emailSenderService = emailSenderService;

    this.router.get(
      "/users/user",
      this.service.validateToken.bind(this.service),
      asyncWrap(this.getUser)
    );
    this.router.post("/users/login", asyncWrap(this.loginUser));
    this.router.post("/users/signin", asyncWrap(this.registerUser));
    this.router.post("/users/refresh-token", asyncWrap(this.refreshToken));
    this.router.post("/users/verify", asyncWrap(this.verifyUser));
    this.router.post(
      "/users/request-email-verification",
      asyncWrap(this.sendEmailVerification)
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
        return res.status(400).send(error.details[0].message);
      }
      const registeredUser = await this.service.getUser("email", user.email);
      if (registeredUser) {
        return res.status(400).send("User already registered.");
      }
      const newUser = await this.service.registerUser(user);
      // tslint:disable-next-line: max-line-length
      const verificationToken: VerificationToken = await this.service.generateVerificationToken(
        newUser
      );
      await this.sendEmailVerificationEmail(
        user.email,
        verificationToken.token
      );
      return res.status(200).json({
        email: user.email,
        verificationToken: verificationToken.token
      });
    } catch (err) {
      return res.status(400).json(err);
    }
  };

  private refreshToken = async (req: Request, res: Response) => {
    try {
      const reqBody = req.body as { refreshToken: string };
      const token = (req.headers.authorization as string).split("Bearer ")[1];
      const refreshToken = reqBody.refreshToken;
      if (!token || !refreshToken) {
        return res
          .status(400)
          .send("Authentication token or refresh token were not provided");
      }

      if (this.service.tokenExpired(refreshToken)) {
        return res.status(401).send("Access denied. Refresh token expired.");
      }

      const savedRefreshToken = await this.redisService.get(
        `refreshTokens.${token}`
      );

      if (refreshToken === savedRefreshToken) {
        const user = await this.service.getUserFromToken(
          refreshToken,
          "refresh"
        );
        if (!user) {
          throw new Error("Invalid refresh token");
        }
        const newToken = this.service.generateAuthToken(user);
        const newRefreshToken = this.service.generateRefreshToken(user);
        await this.redisService.remove(`refreshTokens.${token}`);
        await this.redisService.set(
          `refreshTokens.${newToken}`,
          newRefreshToken
        );

        return res
          .header("Authorization", newToken)
          .status(200)
          .json({
            refreshToken: newRefreshToken
          });
      }
      return res.status(400).send("Invalid refresh or authentication token");
    } catch (err) {
      return res.status(400).json(err);
    }
  };

  private getUser = async (req: Request, res: Response) => {
    try {
      const user = (req.body as { user: User }).user;
      const registeredUser = await this.service.getUser("_id", user._id);
      if (registeredUser) {
        return res.status(200).json(registeredUser);
      }
      return res.status(400).send("User is not found");
    } catch (err) {
      return res.status(400).json(err);
    }
  };

  private verifyUser = async (req: Request, res: Response) => {
    try {
      const body = req.body as { email: string; token: string };
      if (!body.email || !body.token) {
        return res.status(400).json("Email and token are required");
      }
      const user: User = await this.service.getUser("email", body.email);
      const verificationToken = await this.service.getVerificationToken(
        body.token
      );
      if (user._id.toString() !== verificationToken.userId.toString()) {
        return res.status(403).json("Incorrect token");
      }
      if (user.isVerified) {
        return res.status(403).json("User already has been verified");
      }
      await this.service.verifyUser(user);
      return res.status(200).json("User has been verified");
    } catch (err) {
      return res.status(400).json(err);
    }
  };

  private sendEmailVerification = async (req: Request, res: Response) => {
    try {
      const body = req.body as { email: string; verificationToken: string };
      if (!body.email || !body.verificationToken) {
        return res.status(400).json("Email and token are required");
      }
      const user = await this.service.getUser("email", body.email);
      if (!user) {
        return res.status(400).json("No user with this email");
      }
      if (user.isVerified) {
        return res.status(400).json("User is already verified");
      }
      // tslint:disable-next-line: max-line-length
      const expectedVerificationToken: VerificationToken = await this.service.getUserVerificationToken(
        user
      );

      if (expectedVerificationToken.token !== body.verificationToken) {
        return res.status(401).json("Invalid verification token");
      }
      await this.sendEmailVerificationEmail(
        body.email,
        expectedVerificationToken.token
      );
      return res.status(200).json(`Link has been sent to email ${user.email}`);
    } catch (err) {
      return res.status(400).json(err);
    }
  };

  private async sendEmailVerificationEmail(
    email: string,
    token: string
  ): Promise<void> {
    const frontEndURL = process.env.front_end_url as string;
    if (!frontEndURL) {
      process.exit(1);
    }
    const emailVerificationURL = `${frontEndURL}/auth/email-verification`;
    await this.emailSenderService.sendEmail(
      process.env.email_verification_email_template as string,
      email,
      {
        // tslint:disable-next-line: max-line-length
        verifyAccountLink: `${emailVerificationURL}?email=${email}&token=${token}`
      }
    );
  }
}
