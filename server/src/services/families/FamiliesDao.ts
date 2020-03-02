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

  public async getFamily(
    familyId: string
  ): Promise<{ name: string; membersCount: number }> {
    return new Promise((resolve, reject) => {
      FamilyModel.aggregate([
        { $match: { _id: new ObjectId(familyId) } },
        {
          $lookup: {
            from: "familymembermodels",
            localField: "_id",
            foreignField: "_id.familyId",
            as: "members"
          }
        },
        {
          $project: {
            name: true,
            icon: true,
            _id: true,
            currency: true,
            equalPayments: true,
            membersCount: { $size: "$members" }
          }
        }
      ]).exec(
        (err: Error, families: { name: string; membersCount: number }[]) => {
          if (families) {
            resolve(families[0]);
          } else {
            reject(err);
          }
        }
      );
    });
  }

  public async updateFamily(familyId: string, family: Family): Promise<Family> {
    if (family._id) {
      delete family._id;
    }
    return FamilyModel.findOneAndUpdate({ _id: familyId }, family, {
      new: true
    })
      .lean()
      .exec();
  }

  public async removeFamily(familyId: string): Promise<void> {
    return FamilyModel.deleteOne({ _id: familyId })
      .lean()
      .exec();
  }

  public async getFamilyMembers(familyId: string): Promise<FamilyMember[]> {
    return FamilyMemberModel.aggregate([
      { $match: { "_id.familyId": new ObjectId(familyId) } },
      {
        $lookup: {
          from: "usermodels",
          localField: "_id.userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $project: {
          "member._id": "$user._id",
          "member.firstName": "$user.firstName",
          "member.lastName": "$user.lastName",
          "member.email": "$user.email",
          "member.roles": "$roles",
          "member.icon": "$icon",
          "member.paymentPercentage": "$paymentPercentage",
          "member.createdAt": "$_id.createAt"
        }
      },
      { $replaceRoot: { newRoot: "$member" } }
    ]);
  }

  public async createFamilyMember(
    familyId: string,
    familyMember: FamilyMember
  ): Promise<FamilyMember> {
    const newFamilyMember = new FamilyMemberModel({
      ...familyMember,
      _id: { familyId, userId: familyMember._id }
    });
    await newFamilyMember.save();
    return newFamilyMember.toJSON({
      versionKey: false,
      transform: (
        doc,
        ret: { _id: { userId: ObjectId; familyId: ObjectId } }
      ) => ({
        ...ret,
        _id: ret._id.userId.toString()
      })
    }) as FamilyMember;
  }

  public async getMemberFamilies(
    userId: string
  ): Promise<{ family: Family; roles: string[] }[]> {
    return FamilyMemberModel.aggregate([
      { $match: { "_id.userId": new ObjectId(userId) } },
      {
        $lookup: {
          from: "familymodels",
          localField: "_id.familyId",
          foreignField: "_id",
          as: "family"
        }
      },
      { $unwind: "$family" },
      {
        $project: {
          _id: "$family._id",
          name: "$family.name",
          createdAt: "$family.createdAt",
          updatedAt: "$family.updatedAt",
          icon: "$family.icon",
          currency: "$family.currency",
          equalPayments: "$family.equalPayments",
          userRoles: "$roles"
        }
      }
    ]);
  }

  public async getFamilyMember(
    userId: string,
    familyId: string
  ): Promise<FamilyMember> {
    return FamilyMemberModel.findOne({
      "_id.familyId": familyId,
      "_id.userId": userId
    })
      .lean()
      .exec();
  }

  public async updateMemberPercentage(
    memberId: { userId: string; familyId: string },
    paymentPercentage: number
  ) {
    return FamilyMemberModel.updateOne(
      { "_id.familyId": memberId.familyId, "_id.userId": memberId.userId },
      { paymentPercentage },
      { multi: true }
    )
      .lean()
      .exec();
  }
}
