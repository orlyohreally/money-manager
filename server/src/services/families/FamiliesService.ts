import { Family, FamilyMember, Roles } from "@shared/types";
// tslint:disable-next-line: max-line-length
import { ImageManagerService } from "@src/services/image-manager/ImageManagerService";

export interface IFamiliesDao {
  createFamily(family: Partial<Family>): Promise<Family>;
  createFamilyMember(
    familyMember: Partial<FamilyMember>
  ): Promise<FamilyMember>;
  getFamilyMembers(
    familyId: string
  ): Promise<
    {
      _id: string;
      firstName: string;
      lastName: string;
      createdAt: Date;
      roles: string[];
    }[]
  >;
  getMemberFamilies(
    userId: string
  ): Promise<{ family: Family; roles: string[] }[]>;
  getFamily(familyId: string): Promise<{ name: string; membersCount: number }>;
  getFamilyMember(userId: string, familyId: string): Promise<FamilyMember>;
  updateFamily(familyId: string, family: Family): Promise<Family>;
  removeFamily(familyId: string): Promise<void>;
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
    family: Partial<Family>
  ): Promise<Family> {
    const familyIcon: string =
      family.icon && family.icon.search(/^http/) === -1 ? family.icon : "";
    if (familyIcon) {
      family.icon = "";
    }
    let savedFamily: Family = await this.dao.createFamily(family);
    await this.dao.createFamilyMember({
      _id: { familyId: savedFamily._id, userId },
      roles: [Roles.Owner]
    });
    if (familyIcon) {
      const newIcon = await this.imageLoaderService.loadImage(
        familyIcon,
        `families/${savedFamily._id}`
      );
      savedFamily.icon = newIcon;
      savedFamily = await this.dao.updateFamily(savedFamily._id, savedFamily);
    }
    return savedFamily;
  }

  public async updateFamily(familyId: string, family: Family): Promise<Family> {
    if (family.icon && family.icon.search(/^http/) === -1) {
      const newIcon = await this.imageLoaderService.loadImage(
        family.icon,
        `families/${family._id}`
      );
      family.icon = newIcon;
    }
    return this.dao.updateFamily(familyId, family);
  }

  public async getFamily(
    familyId: string
  ): Promise<{ name: string; membersCount: number }> {
    return this.dao.getFamily(familyId);
  }

  public async getMemberFamilies(
    userId: string
  ): Promise<{ family: Family; roles: string[] }[]> {
    return this.dao.getMemberFamilies(userId);
  }

  public async createFamilyMember(
    userId: string,
    familyId: string
  ): Promise<FamilyMember> {
    return this.dao.createFamilyMember({
      _id: { familyId, userId },
      roles: [Roles.Member]
    });
  }

  public async getFamilyMembers(
    familyId: string
  ): Promise<
    {
      _id: string;
      firstName: string;
      lastName: string;
      createdAt: Date;
      roles: string[];
    }[]
  > {
    return this.dao.getFamilyMembers(familyId);
  }

  public async isFamilyMember(
    userId: string,
    familyId: string
  ): Promise<boolean> {
    const familyMember = await this.dao.getFamilyMember(userId, familyId);
    if (familyMember) {
      return true;
    }
    return false;
  }

  public async userCanUpdateFamily(
    userId: string,
    familyId: string
  ): Promise<boolean> {
    const familyMember = await this.dao.getFamilyMember(userId, familyId);
    if (familyMember && familyMember.roles.indexOf("Owner") > -1) {
      return true;
    }
    return false;
  }

  public async removeFamily(familyId: string): Promise<void> {
    // const family = await this.getFamily(familyId);
    await this.imageLoaderService.deleteImage(`families/${familyId}`);
    return this.dao.removeFamily(familyId);
  }
}
