import { Family, FamilyMember } from "@shared/types";
import { modelTransformer } from "@src/utils";

import { ObjectId } from "mongodb";
import { IFamiliesDao } from "./FamiliesService";
import { FamilyModel } from "./models";
import { FamilyMemberModel } from "./models/FamilyMember";

export class FamiliesDao implements IFamiliesDao {
  public async createFamily(family: Partial<Family>): Promise<Family> {
    const newFamily = new FamilyModel(family);
    await newFamily.save();
    return newFamily.toJSON(modelTransformer) as Family;
  }

  public async createFamilyMember(
    familyMember: FamilyMember,
  ): Promise<FamilyMember> {
    const newFamilyMember = new FamilyMemberModel(familyMember);
    await newFamilyMember.save();
    return newFamilyMember.toJSON(modelTransformer) as FamilyMember;
  }

  public async getMemberFamilies(
    userId: string,
  ): Promise<{ family: Family; roles: string[] }[]> {
    return FamilyMemberModel.aggregate([
      { $match: { "_id.userId": new ObjectId(userId) } },
      {
        $lookup: {
          from: "familymodels",
          localField: "_id.familyId",
          foreignField: "_id",
          as: "family",
        },
      },
      { $project: { _id: false } },
    ]);
  }

  public async getFamily(familyId: string): Promise<Family> {
    return FamilyModel.findById(familyId)
      .lean()
      .exec();
  }
}
