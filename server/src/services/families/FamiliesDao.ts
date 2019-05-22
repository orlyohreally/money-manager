import { Family, FamilyMember } from "@shared/types";
import { modelTransformer } from "@src/utils";

import { IFamiliesDao } from "./FamiliesService";
import { FamilyModel } from "./models";

export class FamiliesDao implements IFamiliesDao {
  public async createFamily(family: Partial<Family>): Promise<Family> {
    const newFamily = new FamilyModel(family);
    await newFamily.save();
    return newFamily.toJSON(modelTransformer) as Family;
  }

  public createFamilyMember(family: FamilyMember): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
