import { ValidationResult } from "@hapi/joi";
import { User } from "@shared/types";
import { NextFunction, Request, Response } from "express";

export interface IUsersDao {
  createUser(user: User): Promise<User>;
  validateUser(user: User): ValidationResult;
  getUser(key: string, value: string): Promise<User>;
  registerUser(user: User): Promise<User>;
  authUser(user: User): Promise<User>;
  generateAuthToken(user: User): string;
  generateRefreshToken(user: User): string;
  getUserFromToken(token: string, tokenType: string): Promise<User | undefined>;
  parseJwt(token: string): { _id: string; iat: number; exp: number };
  tokenExpired(token: string): boolean;
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

  public getUser(key: string, value: string): Promise<User> {
    return this.dao.getUser(key, value);
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

  public generateRefreshToken(user: User): string {
    return this.dao.generateRefreshToken(user);
  }

  public getUserFromToken(
    token: string,
    tokenType: string
  ): Promise<User | undefined> {
    return this.dao.getUserFromToken(token, tokenType);
  }

  public async validateToken(
    req: Request & { user?: User },
    res: Response,
    next: NextFunction
  ) {
    const token = ((req.headers.authorization as string) || "").split(
      "Bearer "
    )[1];
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }
    try {
      if (this.dao.tokenExpired(token)) {
        return res.status(401).send("Access denied. Token expired.");
      }
      const decoded = await this.getUserFromToken(token, "auth");
      if (!decoded) {
        throw new Error("Invalid token.");
      }
      (req.body as { user: User }).user = decoded;
      next();
      return;
    } catch (error) {
      return res.status(400).send("Invalid token.");
    }
  }

  public tokenExpired(token: string): boolean {
    return this.dao.tokenExpired(token);
  }
}
