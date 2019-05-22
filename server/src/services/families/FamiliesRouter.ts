import { Request, Response, Router } from "express";
import { IRouter } from "express-serve-static-core";

import { asyncWrap } from "@src/utils";

import { FamiliesService } from "./FamiliesService";

export class FamiliesRouter {
  public router: IRouter;
  private service: FamiliesService;

  constructor({ service }: { service: FamiliesService }) {
    this.router = Router();
    this.service = service;

    this.router.post("/families", asyncWrap(this.postFamilies));
  }

  private postFamilies = async (req: Request, res: Response) => {
    const family = await this.service.createFamily(
      req.body.userId,
      req.body.family,
    );
    res.status(200).json(family);
  };
}
