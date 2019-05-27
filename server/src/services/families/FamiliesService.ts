import { Family, FamilyMember, Roles } from "@shared/types";

export interface IFamiliesDao {
  createFamily(family: Partial<Family>): Promise<Family>;
  createFamilyMember(familyMember: FamilyMember): Promise<FamilyMember>;
  getMemberFamilies(
    userId: string,
  ): Promise<{ family: Family; roles: string[] }[]>;
  getFamily(familyId: string): Promise<Family>;
}

export class FamiliesService {
  private dao: IFamiliesDao;

  constructor({ dao }: { dao: IFamiliesDao }) {
    this.dao = dao;
  }

  public async createFamily(
    userId: string,
    family: Partial<Family>,
  ): Promise<Family> {
    const savedFamily = await this.dao.createFamily(family);
    await this.dao.createFamilyMember({
      _id: { familyId: savedFamily._id, userId },
      roles: [Roles.Owner],
    });
    return savedFamily;
  }

  public async getMemberFamilies(
    userId: string,
  ): Promise<{ family: Family; roles: string[] }[]> {
    return this.dao.getMemberFamilies(userId);
  }

  public async getFamily(familyId: string): Promise<Family> {
    return this.dao.getFamily(familyId);
  }
}
