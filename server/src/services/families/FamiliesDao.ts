import { Family, FamilyMember, MemberPaymentPercentage } from "@shared/types";
import { modelTransformer } from "@src/utils";

import { ObjectId } from "mongodb";
import { IFamiliesDao } from "./FamiliesService";
import { FamilyModel } from "./models";
import { FamilyMemberModel } from "./models/FamilyMember";
// tslint:disable-next-line: max-line-length
import { FamilyMemberPaymentPercentageModel } from "./models/FamilyMemberPaymentPercentage";

export class FamiliesDao implements IFamiliesDao {
  public async createFamily(family: Partial<Family>): Promise<Family> {
    const newFamily = new FamilyModel(family);
    await newFamily.save();
    return newFamily.toJSON(modelTransformer) as Family;
  }

  public async getFamily(
    familyId: string
  ): Promise<Family & { name: string; membersCount: number }> {
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
        (
          err: Error,
          families: (Family & { name: string; membersCount: number })[]
        ) => {
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
    return FamilyModel.findOneAndUpdate(
      { _id: new ObjectId(familyId) },
      family,
      {
        new: true
      }
    )
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
        $lookup: {
          let: {
            userId: "$_id.userId",
            familyId: "$_id.familyId"
          },
          from: "familymemberpaymentpercentagemodels",
          as: "paymentPercentage",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id.familyId", "$$familyId"] },
                    { $eq: ["$_id.userId", "$$userId"] }
                  ]
                }
              }
            },
            {
              $sort: {
                "_id.createdAt": -1
              }
            },
            {
              $group: {
                _id: "$_id.userId",
                paymentPercentage: { $first: "$paymentPercentage" }
              }
            },
            {
              $project: {
                _id: false,
                userId: "$_id",
                paymentPercentage: true
              }
            }
          ]
        }
      },
      {
        $unwind: {
          path: "$paymentPercentage",
          preserveNullAndEmptyArrays: true
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
          "member.createdAt": "$_id.createAt",
          "member.paymentPercentage": "$paymentPercentage.paymentPercentage"
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
    const memberPaymentPercentage = new FamilyMemberPaymentPercentageModel({
      _id: { familyId: memberId.familyId, userId: memberId.userId },
      paymentPercentage
    });
    await memberPaymentPercentage.save();
  }

  public async getPaymentPercentages(
    familyId: string
  ): Promise<MemberPaymentPercentage[]> {
    return FamilyMemberPaymentPercentageModel.aggregate([
      { $match: { "_id.familyId": new ObjectId(familyId) } },
      {
        $sort: {
          "_id.createdAt": -1
        }
      },
      {
        $group: {
          _id: "$_id.userId",
          paymentPercentage: { $first: "$paymentPercentage" }
        }
      },
      {
        $project: {
          _id: false,
          paymentPercentage: true,
          userId: "$_id"
        }
      }
    ]);
  }
}
