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

    this.router.get("/families/:id", asyncWrap(this.getFamily));
    this.router.get("/families", asyncWrap(this.getMemberFamilies));
    this.router.post("/families", asyncWrap(this.postFamilies));
  }
  private getFamily = async (req: Request, res: Response) => {
    try {
      const family = await this.service.getFamily(req.params.id);
      if (family) {
        res.status(200).json(family);
      } else {
        res.status(404).json({ message: "Family not found" });
      }
    } catch (err) {
      console.log("error", err);
      res.status(404).json(err);
    }
  };
  private postFamilies = async (req: Request, res: Response) => {
    try {
      console.log(req.body);
      const family = await this.service.createFamily(
        req.body.userId,
        req.body.family,
      );
      res.status(200).json(family);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  private getMemberFamilies = async (req: Request, res: Response) => {
    try {
      const families = await this.service.getMemberFamilies(req.body.userId);
      res.status(200).json(families);
    } catch (err) {
      res.status(400).json(err);
    }
  };
}
