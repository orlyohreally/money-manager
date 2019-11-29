import { Family, FamilyMember, Roles } from '@shared/types';
// import * as cloudinary from 'cloudinary';
const cloudinary = require('cloudinary');

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
}

export class FamiliesService {
  private dao: IFamiliesDao;

  constructor({ dao }: { dao: IFamiliesDao }) {
    this.dao = dao;
  }

  public async createFamily(
    userId: string,
    family: Partial<Family>
  ): Promise<Family> {
    const savedFamily = await this.dao.createFamily(family);
    await this.dao.createFamilyMember({
      _id: { familyId: savedFamily._id, userId },
      roles: [Roles.Owner]
    });
    return savedFamily;
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
    if (familyMember && familyMember.roles.indexOf('Owner') > -1) {
      return true;
    }
    return false;
  }

  public async updateFamily(familyId: string, family: Family): Promise<Family> {
    if (family.icon.search(/^http/) === -1) {
      const newAvatar = await this.loadImage(family.icon);
      family.icon = newAvatar;
    }
    return this.dao.updateFamily(familyId, family);
  }

  private async loadImage(image: string): Promise<string> {
    console.log('loading to cloudinary');
    cloudinary.v2.config({}); // TODO: shoul be environment variable
    return new Promise((resolve, reject) => {
      cloudinary.v2.uploader.upload(
        image,
        (error: Error, result: { secure_url: string; url: string }) => {
          console.log(result, error);
          if (error) {
            reject(error);
          }
          resolve(result.secure_url || result.url);
        }
      );
    });
  }
}
