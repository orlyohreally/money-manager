import { Document, model, Schema } from "mongoose";

import { FamilyMember } from "@shared/types";
import { ObjectId } from "mongodb";

type FamilyMemberDocument = FamilyMember & Document;

const FamilyMemberSchema = new Schema<FamilyMember>(
  {
    _id: {
      familyId: { type: ObjectId, required: true, ref: "FamilyModel" },
      userId: { type: ObjectId, required: true, ref: "UserModel" }
    },
    roles: { type: [String], required: true },
    createdAt: Date,
    updatedAt: Date
  },
  { versionKey: false }
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
