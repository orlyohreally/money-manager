import { Collection, ObjectId } from "mongodb";
import { connection, Document, model, Schema } from "mongoose";

import { FamilyMember } from "@shared/types";

type FamilyMemberDocument = Document & FamilyMember<ObjectId>;

const FamilyMemberSchema = new Schema<FamilyMember>(
  {
    _id: {
      familyId: { type: ObjectId, required: true, ref: "FamilyModel" },
      userId: { type: ObjectId, required: true, ref: "UserModel" }
    },
    roles: { type: [String], required: true },
    inactive: Boolean,
    createdAt: Date,
    updatedAt: Date
  },
  { versionKey: false, autoIndex: true }
);

FamilyMemberSchema.pre<FamilyMemberDocument>("save", function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});
FamilyMemberSchema.pre<FamilyMemberDocument>("updateOne", function() {
  this.update({}, { $set: { updatedAt: new Date() } });
});

export const FamilyMemberModel = model<FamilyMemberDocument>(
  "FamilyMemberModel",
  FamilyMemberSchema
);

export const getFamilyMembersView = async (): Promise<
  Collection<FamilyMember>
> => {
  return connection.createCollection("AggregatedFamilyMembers", {
    viewOn: "familymembermodels",
    pipeline: [
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
          "member.familyId": "$_id.familyId",
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
    ]
  });
};
