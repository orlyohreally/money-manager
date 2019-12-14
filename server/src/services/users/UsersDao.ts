import * as Joi from "@hapi/joi";
import { User } from "@shared/types";
import * as bcrypt from "bcrypt";
import * as config from "config";
import * as dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { UserModel } from "./models";
import { IUsersDao } from "./UsersService";

export class UsersDao implements IUsersDao {
  public async createUser(user: User): Promise<User> {
    const newUser = new UserModel(user);
    await newUser.save();
    return newUser.toJSON() as User;
  }

  public validateUser(user: User): Joi.ValidationResult {
    const schema = Joi.object({
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
      password: Joi.string()
        .required()
        .pattern(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
        )
    });
    return schema.validate(user);
  }

  public async getUser(email: string): Promise<User> {
    return UserModel.findOne({
      email: email
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
    newUser.password = this.hashPassword(user.password);
    console.log("rgister", user.password, newUser.password);
    return newUser.save();
  }

  public async authUser(user: User): Promise<User> {
    const registeredUser: User = await this.getUser(user.email);
    const correctPassword = await this.comparePasswords(
      user.password,
      registeredUser.password
    );
    if (correctPassword) {
      return registeredUser;
    }
    throw Error("incorrect password");
  }

  public generateAuthToken(user: User): string {
    const token = jwt.sign(
      { _id: user._id },
      config.get("JWTToken.hash"), // process.env.hash_secret as string,
      { expiresIn: 120 }
    );
    console.log(token);
    return token;
  }

  public testHashSetUp() {
    dotenv.config();

    if (!config.get("JWTToken.hash") || !config.get("saltRounds")) {
      process.exit(1);
    }
  }

  public getUserFromToken(token: string): User {
    return jwt.verify(token, config.get("JWTToken.hash")) as User;
  }

  private hashPassword(password: string): string {
    console.log("hashPassword", password);
    const saltRounds: number = config.get("saltRounds");
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
