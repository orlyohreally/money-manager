import { Document, model, Schema } from "mongoose";

import { FamilyMember } from "@shared/types";
import { ObjectId } from "mongodb";

type FamilyMemberDocument = FamilyMember & Document;

const FamilyMemberSchema = new Schema<FamilyMember>({
  _id: {
    familyId: { type: ObjectId, required: true, ref: "FamilyModels" },
    userId: { type: ObjectId, required: true },
  },
  roles: { type: [String], required: true },
});
export const FamilyMemberModel = model<FamilyMemberDocument>(
  "FamilyMemberModel",
  FamilyMemberSchema,
);
