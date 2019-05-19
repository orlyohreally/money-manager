import { Family, FamilyMember } from "@shared/types";

import { IFamiliesDao } from "./FamiliesService";
import { FamilyModel } from "./models";

export class FamiliesDao implements IFamiliesDao {
  public createFamily(family: Partial<Family>): Promise<Family> {
    throw new Error("Method not implemented.");
  }

  public createFamilyMember(family: FamilyMember): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
