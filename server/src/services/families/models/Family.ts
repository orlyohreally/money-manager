import { Collection, ObjectId } from "mongodb";
import { connection, Document, model, Schema } from "mongoose";

import { Family, FamilyView } from "@shared/types";

type FamilyDocument = Document & Family<ObjectId>;

const FamilySchema = new Schema<Family>(
  {
    name: { type: String, required: true },
    icon: String,
    currency: { type: String, required: true },
    equalPayments: Boolean,
    createdAt: Date,
    updatedAt: Date
  },
  { versionKey: false, autoIndex: true }
);
FamilySchema.pre<FamilyDocument>("save", function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});
FamilySchema.pre<FamilyDocument>("updateOne", function() {
  this.update({}, { $set: { updatedAt: new Date() } });
});

export const FamilyModel = model<FamilyDocument>("FamilyModel", FamilySchema);

export const getMemberFamiliesView = (): Promise<Collection<FamilyView>> => {
  return connection.createCollection("AggregatedMemberFamilies", {
    viewOn: "familymembermodels",
    pipeline: [
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
        $lookup: {
          let: { userId: "$_id.userId", familyId: "$_id.familyId" },
          from: "paymentmodels",
          as: "payments",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: ["$familyId", "$$familyId"] }
                  ]
                }
              }
            }
          ]
        }
      },
      {
        $lookup: {
          from: "familymembermodels",
          localField: "family._id",
          foreignField: "_id.familyId",
          as: "members"
        }
      },
      {
        $project: {
          _id: "$family._id",
          userId: "$_id.userId",
          name: "$family.name",
          createdAt: "$family.createdAt",
          updatedAt: "$family.updatedAt",
          icon: "$family.icon",
          currency: "$family.currency",
          equalPayments: "$family.equalPayments",
          userRoles: "$roles",
          membersCount: { $size: "$members" },
          spent: { $sum: "$payments.amount" }
        }
      }
    ]
  });
};

export const getFamiliesView = async (): Promise<
  Collection<
    Family & {
      membersCount: number;
      equalPayments: boolean;
      userRoles: string[];
    }
  >
> => {
  return connection.createCollection("AggregatedFamilies", {
    viewOn: "familymodels",
    pipeline: [
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
    ]
  });
};
