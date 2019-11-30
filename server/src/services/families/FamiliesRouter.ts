import { Request, Response, Router } from "express";
import { IRouter } from "express-serve-static-core";

import { asyncWrap } from "@src/utils";

import { Family } from "@shared/types";
import { FamiliesService } from "./FamiliesService";

export class FamiliesRouter {
  public router: IRouter;
  private service: FamiliesService;
  private defaultTestingUser: string = "5cf3aaee5a4a9327cc27c50a";

  constructor({ service }: { service: FamiliesService }) {
    this.router = Router();
    this.service = service;

    this.router.get("/families", asyncWrap(this.getMemberFamilies));

    this.router.post("/families", asyncWrap(this.postFamily));
    this.router.put("/families/:familyId", asyncWrap(this.putFamily));
    this.router.get("/families/:familyId", asyncWrap(this.getFamily));
    this.router.delete("/families/:familyId", asyncWrap(this.deleteFamily));

    this.router.post(
      "/families/:familyId/members",
      asyncWrap(this.postFamilyMember)
    );
    this.router.get(
      "/families/:familyId/members",
      asyncWrap(this.getFamilyMembers)
    );
  }
  private getFamily = async (req: Request, res: Response) => {
    try {
      // FIXME: userId should be retrieved from JWT
      const userId = this.defaultTestingUser;
      const familyId = (req.params as { familyId: string }).familyId;
      const isMember = await this.service.isFamilyMember(userId, familyId);
      if (isMember) {
        const family = await this.service.getFamily(familyId);
        if (family) {
          res.status(200).json(family);
        } else {
          res.status(404).json({ message: "Family not found" });
        }
      } else {
        res.status(404).json({ message: "Family not found" });
      }
    } catch (err) {
      res.status(404).json(err);
    }
  };

  private postFamily = async (req: Request, res: Response) => {
    try {
      const family = await this.service.createFamily(
        this.defaultTestingUser,
        (req.body as { family: Family }).family
      );
      res.status(200).json(family);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  private putFamily = async (req: Request, res: Response) => {
    try {
      const family = (req.body as { family: Family }).family;
      const familyId = (req.params as { familyId: string }).familyId;
      if (!family) {
        res.status(404).json({ message: "New values are missing" });
        return;
      }
      const userId = this.defaultTestingUser;
      const updateAllowed = await this.service.userCanUpdateFamily(
        userId,
        familyId
      );
      if (updateAllowed) {
        const updatedFamily = await this.service.updateFamily(familyId, family);
        res.status(200).json(updatedFamily);
      } else {
        res.status(403).json({ message: "Unathorized access" });
      }
    } catch (err) {
      res.status(404).json(err);
    }
  };

  private deleteFamily = async (req: Request, res: Response) => {
    try {
      const familyId = (req.params as { familyId: string }).familyId;
      if (!familyId) {
        res.status(404).json({ message: "Values are missing" });
        return;
      }
      const userId = this.defaultTestingUser;
      const updateAllowed = await this.service.userCanUpdateFamily(
        userId,
        familyId
      );
      if (updateAllowed) {
        await this.service.removeFamily(familyId);
        res.status(200).json({
          message: `Family was removed successfully`
        });
      } else {
        res.status(403).json({ message: "Unathorized access" });
      }
    } catch (err) {
      res.status(404).json(err);
    }
  };

  private getMemberFamilies = async (req: Request, res: Response) => {
    try {
      // FIXME: userId should be retrieved from JWT
      const userId = this.defaultTestingUser;
      const families = await this.service.getMemberFamilies(userId);
      res.status(200).json(families);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  private getFamilyMembers = async (req: Request, res: Response) => {
    try {
      const familyId = (req.params as { familyId: string }).familyId;

      const members = await this.service.getFamilyMembers(familyId);
      if (members.length) {
        res.status(200).json(members);
      } else {
        res.status(404).json({ message: "Family not found" });
      }
    } catch (err) {
      res.status(400).json(err);
    }
  };

  private postFamilyMember = async (req: Request, res: Response) => {
    try {
      const userId = (req.body as { userId: string }).userId;
      const familyId = (req.params as { familyId: string }).familyId;
      const member = await this.service.createFamilyMember(userId, familyId);
      res.status(200).json(member);
    } catch (err) {
      res.status(400).json(err);
    }
  };
}
