import { ValidationResult } from "@hapi/joi";
import { NextFunction, Request, Response } from "express";

import { User, VerificationToken } from "@shared/types";
// tslint:disable-next-line: max-line-length
import { ImageManagerService } from "@src/services/image-manager/ImageManagerService";

export interface IUsersDao {
  validateUser(user: User, validatePassword: boolean): ValidationResult;
  getUser(key: string, value: string): Promise<User>;
  registerUser(user: User): Promise<User>;
  deleteUser(email: string): Promise<void>;
  updateUser(userId: string, user: User): Promise<User>;
  authUser(user: User): Promise<User>;
  generateAuthToken(user: User): string;
  generateRefreshToken(user: User): string;
  getUserFromToken(token: string, tokenType: string): Promise<User | undefined>;
  parseJwt(token: string): { _id: string; iat: number; exp: number };
  tokenExpired(token: string): boolean;
  getVerificationToken(token: string): Promise<VerificationToken>;
  generateVerificationToken(user: User): Promise<VerificationToken>;
  getUserVerificationToken(user: User): Promise<VerificationToken>;
  verifyUser(user: User): Promise<User>;
}

export class UsersService {
  private dao: IUsersDao;
  private imageLoaderService: ImageManagerService;

  constructor({
    dao,
    imageLoaderService
  }: {
    dao: IUsersDao;
    imageLoaderService: ImageManagerService;
  }) {
    this.dao = dao;
    this.imageLoaderService = imageLoaderService;
  }

  public validateUser(
    user: User,
    validatePassword: boolean = true
  ): ValidationResult {
    return this.dao.validateUser(user, validatePassword);
  }

  public getUser(key: string, value: string): Promise<User> {
    return this.dao.getUser(key, value);
  }

  public registerUser(user: User): Promise<User> {
    return this.dao.registerUser(user);
  }

  public deleteUser(email: string): Promise<void> {
    return this.dao.deleteUser(email);
  }

  public async updateUser(userId: string, user: User): Promise<User> {
    const registeredUser: User = await this.getUser("_id", userId);
    let userIcon = user.icon;
    if (user.icon && user.icon !== registeredUser.icon) {
      this.imageLoaderService.validateImageForLoading(user.icon);

      if (userIcon) {
        userIcon = await this.imageLoaderService.loadImage(
          user.icon,
          `users/${userId}`
        );
      }
    }

    return this.dao.updateUser(userId, {
      ...user,
      firstName: user.firstName.trim(),
      lastName: user.lastName.trim(),
      icon: user.icon ? userIcon || registeredUser.icon : ""
    });
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
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }
    try {
      if (this.dao.tokenExpired(token)) {
        return res
          .status(401)
          .json({ message: "Access denied. Token expired." });
      }
      const decoded = await this.getUserFromToken(token, "auth");
      if (!decoded) {
        throw new Error("Invalid token.");
      }
      (req.body as { user: User }).user = decoded;
      next();
      return;
    } catch (error) {
      return res.status(401).json({ message: "Invalid token." });
    }
  }

  public tokenExpired(token: string): boolean {
    return this.dao.tokenExpired(token);
  }

  public getVerificationToken(token: string): Promise<VerificationToken> {
    return this.dao.getVerificationToken(token);
  }

  public verifyUser(user: User): Promise<User> {
    return this.dao.verifyUser(user);
  }

  public generateVerificationToken(user: User): Promise<VerificationToken> {
    return this.dao.generateVerificationToken(user);
  }

  public getUserVerificationToken(user: User): Promise<VerificationToken> {
    return this.dao.getUserVerificationToken(user);
  }
}
