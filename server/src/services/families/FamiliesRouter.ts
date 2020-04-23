import { Request, Response, Router } from "express";
import { IRouter } from "express-serve-static-core";

import { asyncWrap } from "@src/utils";

import { Family, MemberPaymentPercentage, User } from "@shared/types";
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
      [
        this.usersService.validateToken.bind(usersService),
        this.service.isUpdateFamilyAllowedMW.bind(service)
      ],
      asyncWrap(this.putFamily)
    );
    this.router.get(
      "/families/:familyId",
      this.usersService.validateToken.bind(usersService),
      asyncWrap(this.getFamily)
    );
    this.router.delete(
      "/families/:familyId",
      [
        this.usersService.validateToken.bind(usersService),
        this.service.isUpdateFamilyAllowedMW.bind(service)
      ],
      asyncWrap(this.deleteFamily)
    );
    this.router.post(
      "/families/:familyId/members",
      [
        this.usersService.validateToken.bind(usersService),
        this.service.isUpdateFamilyAllowedMW.bind(service)
      ],
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
    this.router.put(
      "/families/:familyId/members/payment-percentages",
      [
        this.usersService.validateToken.bind(usersService),
        this.service.isUpdateFamilyAllowedMW.bind(service)
      ],
      asyncWrap(this.putMembersPaymentsPercentages)
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
      const body = req.body as { family: Family; roles: string[]; user: User };
      if (!body.family) {
        return res.status(400).json("Values were not provided");
      }
      const family = await this.service.createFamily(
        body.user._id,
        body.family,
        body.roles
      );
      return res.status(200).json(family);
    } catch (err) {
      return res.status(400).json(err);
    }
  };

  private putFamily = async (req: Request, res: Response) => {
    try {
      const body = req.body as {
        family: Family;
        user: User;
      };
      const familyId = (req.params as { familyId: string }).familyId;
      if (!body.family) {
        res.status(404).json({ message: "New values are missing" });
        return;
      }

      const updatedFamily = await this.service.updateFamily(
        familyId,
        body.family,
        body.user._id
      );
      res.status(200).json(updatedFamily);
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
      await this.service.removeFamily(familyId);
      res.status(200).json({
        message: `Family was removed successfully`
      });
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
        process.env.MEMBER_WAS_ADDED_TO_FAMILY_EMAIL_TEMPLATE as string,
        user.email,
        {
          adderFullName: `${body.user.firstName} ${body.user.lastName}`,
          familyName: family.name,
          familiesUrl: `${process.env.FRONT_END_URL}/families`
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

  private putMembersPaymentsPercentages = async (
    req: Request,
    res: Response
  ) => {
    try {
      const familyId = (req.params as { familyId: string }).familyId;
      const percentages = (req.body as {
        percentages: MemberPaymentPercentage[];
        user: User;
      }).percentages;

      if (!percentages) {
        return res.status(404).json({ message: "Values are missing" });
      }

      const validPercentages = await this.service.validateMemberPercentages(
        familyId,
        percentages
      );
      if (!validPercentages) {
        return res.status(404).json({
          message:
            "Percentages should be valid positive numbers. Total percentage of percentages for all family members should sum up to 100."
        });
      }
      await this.service.updateMembersPercentages(familyId, percentages);

      return res
        .status(200)
        .json({ message: "Succefully updated percentages" });
    } catch (err) {
      return res.status(404).json(err);
    }
  };
}
