import { NextFunction, Request, Response } from "express";

export class TestingService {
  public async validateCredentials(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const credentials = req.headers.authorization as string;
      console.log("process.env.TESTING_CREDENTIALS", credentials);
      if (credentials !== process.env.TESTING_CREDENTIALS) {
        throw new Error("Unauthorized access");
      }
      next();
      return;
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
  }
}
