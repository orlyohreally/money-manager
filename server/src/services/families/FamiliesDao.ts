import { Family, FamilyMember } from "@shared/types";
import { modelTransformer } from "@src/utils";

import { ObjectId } from "mongodb";
import { userInfo } from "os";
import { IFamiliesDao } from "./FamiliesService";
import { FamilyModel } from "./models";
import { FamilyMemberModel } from "./models/FamilyMember";

export class FamiliesDao implements IFamiliesDao {
  public async createFamily(family: Partial<Family>): Promise<Family> {
    const newFamily = new FamilyModel(family);
    await newFamily.save();
    return newFamily.toJSON(modelTransformer) as Family;
  }

  public async getFamily(
    familyId: string,
  ): Promise<{ name: string; membersCount: number }[]> {
    return FamilyModel.aggregate([
      { $match: { _id: new ObjectId(familyId) } },
      {
        $lookup: {
          from: "familymembermodels",
          localField: "_id",
          foreignField: "_id.familyId",
          as: "members",
        },
      },
      {
        $project: {
          name: true,
          _id: false,
          members: { $size: "$members" },
        },
      },
    ]);
  }

  public async updateFamily(familyId: string, family: Family): Promise<Family> {
    if (family._id) {
      delete family._id;
    }
    return FamilyModel.updateOne({ _id: familyId }, family, { new: true })
      .lean()
      .exec();
  }

  public async getFamilyMembers(
    familyId: string,
  ): Promise<
    {
      _id: string;
      firstName: string;
      lastName: string;
      createdAt: Date;
      roles: string[];
    }[]
  > {
    return FamilyMemberModel.aggregate([
      {
        $lookup: {
          from: "usermodels",
          localField: "_id.userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user",
      },
      {
        $project: {
          "member._id": "$user._id",
          "member.firstName": "$user.firstName",
          "member.lastName": "$user.lastName",
          "member.roles": "$roles",
          "member.createdAt": "$_id.createAt",
        },
      },
      { $replaceRoot: { newRoot: "$member" } },
    ]);
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

  public async getFamilyMember(
    userId: string,
    familyId: string,
  ): Promise<FamilyMember> {
    return FamilyMemberModel.findOne({
      "_id.familyId": familyId,
      "_id.userId": userId,
    })
      .lean()
      .exec();
  }
}
