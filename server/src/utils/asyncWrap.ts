import { User } from "@shared/types";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { RequestHandler } from "express-serve-static-core";

// tslint:disable: no-function-expression
// tslint:disable: no-unsafe-any
export const asyncWrap = function(fn: RequestHandler | ErrorRequestHandler) {
  if (fn.length <= 3) {
    return function(
      req: Request & { user?: User },
      res: Response,
      next: NextFunction
    ) {
      return (fn as RequestHandler)(req, res, next).catch(next);
    };
  } else {
    return function(
      err: Error,
      req: Request,
      res: Response,
      next: NextFunction
    ) {
      return (fn as ErrorRequestHandler)(err, req, res, next).catch(next);
    };
  }
};
