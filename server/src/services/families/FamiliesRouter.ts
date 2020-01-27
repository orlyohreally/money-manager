import { Request, Response, Router } from "express";
import { IRouter } from "express-serve-static-core";

import { asyncWrap } from "@src/utils";

import { Family, User } from "@shared/types";
// tslint:disable-next-line: max-line-length
import { EmailSenderService } from "@src/services/email-sender/EmailSenderService";
import { UsersService } from "@src/services/users/UsersService";
import { FamiliesService } from "./FamiliesService";

export class FamiliesRouter {
  public router: IRouter;
  private service: FamiliesService;
  private usersService: UsersService;
  private emailSenderService: EmailSenderService;

  constructor({
    service,
    usersService,
    emailSenderService
  }: {
    service: FamiliesService;
    usersService: UsersService;
    emailSenderService: EmailSenderService;
  }) {
    this.router = Router();
    this.service = service;
    this.usersService = usersService;
    this.emailSenderService = emailSenderService;

    this.router.get(
      "/families",
      this.usersService.validateToken.bind(usersService),
      asyncWrap(this.getMemberFamilies)
    );

    this.router.post(
      "/families",
      this.usersService.validateToken.bind(usersService),
      asyncWrap(this.postFamily)
    );
    this.router.put(
      "/families/:familyId",
      this.usersService.validateToken.bind(usersService),
      asyncWrap(this.putFamily)
    );
    this.router.get(
      "/families/:familyId",
      this.usersService.validateToken.bind(usersService),
      asyncWrap(this.getFamily)
    );
    this.router.delete(
      "/families/:familyId",
      this.usersService.validateToken.bind(usersService),
      asyncWrap(this.deleteFamily)
    );

    this.router.post(
      "/families/:familyId/members",
      this.usersService.validateToken.bind(usersService),
      asyncWrap(this.postFamilyMember)
    );
    this.router.get(
      "/families/:familyId/members",
      this.usersService.validateToken.bind(usersService),
      asyncWrap(this.getFamilyMembers)
    );
    this.router.get(
      "/families/:familyId/members/roles",
      this.usersService.validateToken.bind(usersService),
      asyncWrap(this.getFamilyMembersRoles)
    );
  }
  private getFamily = async (req: Request, res: Response) => {
    try {
      const familyId = (req.params as { familyId: string }).familyId;
      const isMember = await this.service.isFamilyMember(
        (req.body as { user: User }).user._id,
        familyId
      );
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
      const body = req.body as { family: Family; user: User };
      if (!body.family) {
        return res.status(400).json("Values were not provided");
      }
      const family = await this.service.createFamily(
        body.user._id,
        body.family
      );
      return res.status(200).json(family);
    } catch (err) {
      return res.status(400).json(err);
    }
  };

  private putFamily = async (req: Request, res: Response) => {
    try {
      const family = (req.body as { family: Family; user: User }).family;
      const user = (req.body as { family: Family; user: User }).user;
      const familyId = (req.params as { familyId: string }).familyId;
      if (!family) {
        res.status(404).json({ message: "New values are missing" });
        return;
      }
      const updateAllowed = await this.service.userCanUpdateFamily(
        user._id,
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
      const updateAllowed = await this.service.userCanUpdateFamily(
        (req.body as { user: User }).user._id,
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
      const user = (req.body as { user: User }).user;
      const families = await this.service.getMemberFamilies(user._id);
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
      const body = req.body as {
        email: string;
        roles: string[];
        user: User;
      };
      const familyId = (req.params as { familyId: string }).familyId;
      const familyMemberEmail = body.email;
      if (!familyId) {
        return res.status(400).json({ familyId: "familyId is required" });
      }
      if (!familyMemberEmail) {
        return res.status(400).json({ email: "Email is required" });
      }
      const updateAllowed = await this.service.userCanUpdateFamily(
        body.user._id,
        familyId
      );
      if (!updateAllowed) {
        return res.status(403).json({ message: "Unathorized access" });
      }
      const family = await this.service.getFamily(familyId);
      if (!family) {
        return res.status(404).json({ familyId: "Family has not been found" });
      }
      const user = await this.usersService.getUser("email", familyMemberEmail);
      if (!user) {
        return res.status(404).json({ email: "Member has not been found" });
      }
      const alreadyMember = await this.service.isFamilyMember(
        user._id,
        familyId
      );
      if (alreadyMember) {
        return res
          .status(404)
          .json({ email: "Member is already a family member" });
      }
      const member = await this.service.createFamilyMember(
        user._id,
        familyId,
        body.roles
      );
      await this.emailSenderService.sendEmail(
        process.env.member_was_added_to_family_email_template as string,
        user.email,
        {
          adderFullName: `${body.user.firstName} ${body.user.lastName}`,
          familyName: family.name,
          familiesUrl: `${process.env.front_end_url}/families`
        }
      );
      return res.status(200).json(member);
    } catch (err) {
      return res.status(400).json(err);
    }
  };

  private getFamilyMembersRoles = async (req: Request, res: Response) => {
    try {
      const familyId = (req.params as { familyId: string }).familyId;
      if (!familyId) {
        return res.status(400).json({ message: "familyId is required" });
      }

      const roles = this.service.getFamilyMemberRoles();
      return res.status(200).json({ roles });
    } catch (err) {
      return res.status(400).json(err);
    }
  };
}
