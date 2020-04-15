import * as Joi from "@hapi/joi";
// tslint:disable-next-line: no-require-imports
import atob = require("atob");
import * as bcrypt from "bcrypt";
import * as cryptoRandomString from "crypto-random-string";
import * as jwt from "jsonwebtoken";
import { ObjectId } from "mongodb";

import { User, VerificationToken } from "@shared/types";
import { UserModel, VerificationModel } from "./models";
import { IUsersDao } from "./UsersService";

export class UsersDao implements IUsersDao {
  private tokenHash: string;
  private refreshTokenHash: string;
  constructor() {
    this.tokenHash = process.env.JWT_HASH as string;
    this.refreshTokenHash = process.env.JWT_REFRESH_HASH as string;
    if (!this.tokenHash || !this.refreshTokenHash) {
      process.exit(1);
    }
  }

  public async createUser(user: User): Promise<User> {
    const newUser = new UserModel(user);
    await newUser.save();
    return newUser.toJSON() as User;
  }

  public validateUser(
    user: User,
    validatePassword: boolean
  ): Joi.ValidationResult {
    const schema = Joi.object({
      _id: Joi.string().optional(),
      firstName: Joi.string()
        .min(3)
        .max(50)
        .required(),
      lastName: Joi.string()
        .min(3)
        .max(50)
        .required(),

      email: Joi.string()
        .min(5)
        .max(255)
        .required()
        .email(),
      ...(validatePassword && {
        password: Joi.string()
          .required()
          .pattern(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          )
      }),
      icon: Joi.string()
        .optional()
        // tslint:disable-next-line: no-null-keyword
        .allow(null),
      currency: Joi.string().required()
    });
    return schema.validate(user);
  }

  public async getUser(key: string, value: string): Promise<User> {
    return UserModel.findOne({
      [key]: value
    })
      .lean()
      .exec();
  }

  public async registerUser(user: User): Promise<User> {
    const newUser = new UserModel({
      firstName: user.firstName,
      lastName: user.lastName,
      password: user.password,
      email: user.email
    });
    newUser.password = this.hashPassword(user.password as string);
    return newUser.save();
  }

  public async updateUser(userId: string, user: User): Promise<User> {
    if (user._id) {
      delete user._id;
    }
    return UserModel.findOneAndUpdate({ _id: new ObjectId(userId) }, user, {
      new: true
    })
      .lean()
      .exec();
  }

  public async authUser(user: User): Promise<User> {
    const registeredUser: User = await this.getUser("email", user.email);
    const correctPassword = await this.comparePasswords(
      user.password as string,
      registeredUser.password as string
    );
    if (correctPassword) {
      return registeredUser;
    }
    throw Error("incorrect password");
  }

  public generateAuthToken(user: User): string {
    const token = jwt.sign({ _id: user._id }, this.tokenHash, {
      expiresIn: 15 * 60
    });
    return token;
  }

  public generateRefreshToken(user: User): string {
    const token = jwt.sign({ _id: user._id }, this.refreshTokenHash, {
      expiresIn: "4h"
    });
    return token;
  }

  public getUserFromToken(
    token: string,
    tokenType: string
  ): Promise<User | undefined> {
    if (tokenType !== "auth" && tokenType !== "refresh") {
      return Promise.resolve(undefined);
    }
    const secret =
      tokenType === "auth" ? this.tokenHash : this.refreshTokenHash;

    const user = jwt.verify(token, secret) as {
      _id: string;
      iat: number;
      exp: number;
    };
    return this.getUser("_id", user._id);
  }

  public tokenExpired(token: string): boolean {
    return this.parseJwt(token).exp < Date.now() / 1000;
  }

  public parseJwt(token: string): { _id: string; iat: number; exp: number } {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(c => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join("")
    );
    return JSON.parse(jsonPayload) as { _id: string; iat: number; exp: number };
  }

  public getVerificationToken(token: string): Promise<VerificationToken> {
    return VerificationModel.findOne({
      token
    })
      .lean()
      .exec();
  }

  public getUserVerificationToken(user: User): Promise<VerificationToken> {
    return VerificationModel.findOne({
      userId: user._id
    })
      .lean()
      .exec();
  }

  public verifyUser(user: User): Promise<User> {
    return UserModel.findOneAndUpdate(
      { email: user.email },
      { user, isVerified: true },
      {
        new: true
      }
    )
      .lean()
      .exec();
  }

  public async generateVerificationToken(
    user: User
  ): Promise<VerificationToken> {
    const verificationToken = new VerificationModel({
      token: cryptoRandomString({ length: 16, type: "url-safe" }),
      userId: user._id
    });
    await verificationToken.save();
    return verificationToken.toJSON() as VerificationToken;
  }

  private hashPassword(password: string): string {
    const saltRounds: number = parseInt(process.env.SALT_ROUNDS as string, 10);
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
  }

  private comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
