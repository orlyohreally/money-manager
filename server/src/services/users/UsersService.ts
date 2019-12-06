import { ValidationResult } from "@hapi/joi";
import { User } from "@shared/types";
import { NextFunction, Request, Response } from "express";

export interface IUsersDao {
  createUser(user: User): Promise<User>;
  validateUser(user: User): ValidationResult;
  getUser(email: string): Promise<User>;
  registerUser(user: User): Promise<User>;
  authUser(user: User): Promise<User>;
  generateAuthToken(user: User): string;
  testHashSetUp(): void;
  getUserFromToken(token: string): User;
}

export class UsersService {
  private dao: IUsersDao;

  constructor({ dao }: { dao: IUsersDao }) {
    this.dao = dao;
  }

  public async createUser(user: User): Promise<User> {
    return this.dao.createUser(user);
  }

  public validateUser(user: User): ValidationResult {
    return this.dao.validateUser(user);
  }

  public getUser(email: string): Promise<User> {
    return this.dao.getUser(email);
  }

  public registerUser(user: User): Promise<User> {
    return this.dao.registerUser(user);
  }

  public authUser(user: User): Promise<User> {
    return this.dao.authUser(user);
  }

  public generateAuthToken(user: User): string {
    return this.dao.generateAuthToken(user);
  }

  public testHashSetUp() {
    this.dao.testHashSetUp();
  }

  public validateToken(
    req: Request & { user?: User },
    res: Response,
    next: NextFunction
  ) {
    console.log(this);
    const token =
      (req.headers["x-access-token"] as string) ||
      (req.headers.authorization as string);
    console.log(token);
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }
    try {
      const decoded = this.dao.getUserFromToken(token);
      console.log(decoded);
      (req.body as { user: User }).user = decoded;
      next();
      return;
    } catch (error) {
      console.log(error);
      return res.status(400).send("Invalid token.");
    }
  }
}
