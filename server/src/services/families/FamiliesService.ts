import { Family, FamilyMember, Roles } from "@shared/types";

export interface IFamiliesDao {
  createFamily(family: Partial<Family>): Promise<Family>;
  createFamilyMember(family: FamilyMember): Promise<void>;
}

export class FamiliesService {
  private dao: IFamiliesDao;

  constructor({ dao }: { dao: IFamiliesDao }) {
    this.dao = dao;
  }

  public async createFamily(userId: string, family: Partial<Family>) {
    const savedFamily = await this.dao.createFamily(family);
    await this.dao.createFamilyMember({
      _id: { familyId: savedFamily._id, userId },
      roles: [Roles.Owner],
    });
  }
}
