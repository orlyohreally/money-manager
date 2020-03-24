import {
  Family,
  FamilyMember,
  FamilyView,
  MemberPaymentPercentage,
  Roles,
  User
} from "@shared/types";
// tslint:disable-next-line: max-line-length
import { ImageManagerService } from "@src/services/image-manager/ImageManagerService";
import { NextFunction, Request, Response } from "express";

export interface IFamiliesDao {
  createFamily(family: Partial<Family>): Promise<Family>;
  createFamilyMember(
    familyId: string,
    familyMember: Partial<FamilyMember>
  ): Promise<FamilyMember>;
  getFamilyMembers(familyId: string): Promise<FamilyMember[]>;
  getMemberFamilies(
    userId: string
  ): Promise<{ family: Family; roles: string[] }[]>;
  getFamily(familyId: string): Promise<FamilyView>;
  getFamilyMember(userId: string, familyId: string): Promise<FamilyMember>;
  updateFamily(familyId: string, family: Family): Promise<Family>;
  removeFamily(familyId: string): Promise<void>;
  updateMemberPercentage(
    memberId: { userId: string; familyId: string },
    percentage: number
  ): Promise<void>;
  getPaymentPercentages(familyId: string): Promise<MemberPaymentPercentage[]>;
}

export class FamiliesService {
  private dao: IFamiliesDao;
  private imageLoaderService: ImageManagerService;

  constructor({
    dao,
    imageLoaderService
  }: {
    dao: IFamiliesDao;
    imageLoaderService: ImageManagerService;
  }) {
    this.dao = dao;
    this.imageLoaderService = imageLoaderService;
  }

  public async createFamily(
    userId: string,
    family: Partial<Family>,
    roles: string[]
  ): Promise<Family> {
    const familyIcon: string =
      family.icon && family.icon.search(/^http/) === -1 ? family.icon : "";
    if (familyIcon) {
      family.icon = "";
    }
    let savedFamily: Family = await this.dao.createFamily(family);
    await this.dao.createFamilyMember(savedFamily._id, {
      _id: userId,
      roles: [...roles, roles.indexOf(Roles.Owner) > -1 ? "" : Roles.Owner]
    });
    if (familyIcon) {
      const newIcon = await this.imageLoaderService.loadImage(
        familyIcon,
        `families/${savedFamily._id}`
      );
      savedFamily.icon = newIcon;
      savedFamily = await this.dao.updateFamily(savedFamily._id, savedFamily);
    }
    await this.updateMembersPercentages(savedFamily._id, [
      {
        userId,
        paymentPercentage: 100
      }
    ]);
    return savedFamily;
  }

  public async updateFamily(familyId: string, family: Family): Promise<Family> {
    const currentIcon = (await this.getFamily(familyId)).icon;
    if (family.icon && currentIcon !== family.icon) {
      const newIcon = await this.imageLoaderService.loadImage(
        family.icon,
        `families/${family._id}`
      );
      family.icon = newIcon;
    }
    return this.dao.updateFamily(familyId, family);
  }

  public async getFamily(familyId: string): Promise<FamilyView> {
    return this.dao.getFamily(familyId);
  }

  public async getMemberFamilies(
    userId: string
  ): Promise<{ family: Family; roles: string[] }[]> {
    return this.dao.getMemberFamilies(userId);
  }

  public async createFamilyMember(
    userId: string,
    familyId: string,
    roles: string[]
  ): Promise<FamilyMember> {
    const newMember = await this.dao.createFamilyMember(familyId, {
      _id: userId,
      roles: roles.indexOf(Roles.Member) > -1 ? roles : [...roles, Roles.Member]
    });
    if (this.isAdultMember(newMember)) {
      const family = await this.getFamily(familyId);
      const paymentPercentages = await this.getPaymentPercentages(familyId);
      if (!family.equalPayments) {
        await this.updateMembersPercentages(familyId, [
          ...paymentPercentages,
          { userId: newMember._id, paymentPercentage: 0 }
        ]);
      } else {
        const members = (await this.getFamilyMembers(familyId)).filter(member =>
          this.isAdultMember(member)
        );
        const paymentPercentage = 100 / members.length;
        await this.updateMembersPercentages(familyId, [
          ...paymentPercentages.map(percentage => ({
            userId: percentage.userId,
            paymentPercentage
          })),
          { userId: newMember._id, paymentPercentage }
        ]);
      }
    }

    return newMember;
  }

  public async getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
    return this.dao.getFamilyMembers(familyId);
  }

  public async isFamilyMember(
    userId: string,
    familyId: string
  ): Promise<boolean> {
    const familyMember = await this.dao.getFamilyMember(userId, familyId);
    return !!familyMember;
  }

  public async removeFamily(familyId: string): Promise<void> {
    await this.imageLoaderService.deleteImage(`families/${familyId}`);
    return this.dao.removeFamily(familyId);
  }

  public getFamilyMemberRoles(): {
    name: string;
    description: string;
    default: boolean;
  }[] {
    return [
      {
        name: Roles.Member,
        description: "Can view family members",
        default: true
      },
      {
        name: Roles.Owner,
        // tslint:disable-next-line: max-line-length
        description:
          "Can add and remove family members, edit their roles in family",
        default: false
      },
      {
        name: Roles.Child,
        description: "Can add and edit payments in family and thier own",
        default: false
      },
      {
        name: Roles.Adult,
        description:
          "Can add and edit own payments in family and view everybody else's",
        default: false
      },
      {
        name: Roles.Admin,
        // tslint:disable-next-line: max-line-length
        description: "Can edit all family members' payments",
        default: false
      }
    ];
  }

  public async updateMembersPercentages(
    familyId: string,
    percentages: MemberPaymentPercentage[]
  ): Promise<void> {
    for (const percentage of percentages) {
      await this.dao.updateMemberPercentage(
        { familyId, userId: percentage.userId },
        percentage.paymentPercentage
      );
    }
  }

  public async validateMemberPercentages(
    familyId: string,
    percentages: MemberPaymentPercentage[]
  ) {
    const invalidPercentagesCount = percentages.filter(
      (percentage: MemberPaymentPercentage) =>
        percentage.paymentPercentage < 0 || percentage.paymentPercentage > 100
    ).length;
    if (invalidPercentagesCount > 0) {
      return false;
    }
    const percentagesNormalized: {
      [userId: string]: MemberPaymentPercentage;
    } = percentages.reduce(
      (
        res: { [userId: string]: MemberPaymentPercentage },
        percentage: MemberPaymentPercentage
      ) => ({
        ...res,
        [percentage.userId]: percentage
      }),
      {}
    );
    return (
      (await this.getFamilyMembers(familyId))
        .filter(this.isAdultMember)
        .reduce((res: number, member: FamilyMember) => {
          if (
            percentagesNormalized[member._id] &&
            percentagesNormalized[member._id].paymentPercentage !== undefined &&
            percentagesNormalized[member._id].paymentPercentage !== null
          ) {
            return res + percentagesNormalized[member._id].paymentPercentage;
          }
          return res + member.paymentPercentage;
        }, 0) === 100
    );
  }

  public async userCanEditFamily(
    req: Request & { user?: User },
    res: Response,
    next: NextFunction
  ) {
    try {
      const familyId = (req.params as { familyId: string }).familyId;
      const user = (req.body as { family: Family; user: User }).user;
      const updateAllowed = await this.userCanUpdateFamily(user._id, familyId);
      if (!updateAllowed) {
        throw new Error("Unathorized access");
      }
      next();
      return;
    } catch (error) {
      return res.status(403).json({ message: "Unathorized access" });
    }
  }

  public async userCanUpdateFamily(
    userId: string,
    familyId: string
  ): Promise<boolean> {
    const familyMember = await this.dao.getFamilyMember(userId, familyId);
    return (
      familyMember &&
      (familyMember.roles.indexOf(Roles.Owner) > -1 ||
        familyMember.roles.indexOf(Roles.Admin) > -1)
    );
  }

  public async userCanCreatePayment(
    userId: string,
    familyId: string
  ): Promise<boolean> {
    const familyMember = await this.dao.getFamilyMember(userId, familyId);
    return familyMember && this.isAdultMember(familyMember);
  }

  public async isFamilyAdmin(userId: string, familyId: string) {
    const familyMember = await this.dao.getFamilyMember(userId, familyId);
    return familyMember && familyMember.roles.indexOf(Roles.Admin) > -1;
  }

  public getPaymentPercentages(
    familyId: string
  ): Promise<MemberPaymentPercentage[]> {
    return this.dao.getPaymentPercentages(familyId);
  }

  private isAdultMember(member: FamilyMember) {
    return (
      member.roles.indexOf(Roles.Adult) > -1 ||
      member.roles.indexOf(Roles.Admin) > -1 ||
      member.roles.indexOf(Roles.Owner) > -1
    );
  }
}
