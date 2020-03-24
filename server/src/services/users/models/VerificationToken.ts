import { VerificationToken } from "@shared/types";
import { ObjectId } from "mongodb";
import { Document, model, Schema } from "mongoose";

type VerificationTokenDocument = VerificationToken & Document;

const VerificationTokenSchema = new Schema<VerificationToken>(
  {
    token: { type: String, required: true, minLength: 16 },
    userId: { type: ObjectId, required: true, ref: "UserModel", index: true },
    createdAt: Date,
    updatedAt: Date
  },
  { versionKey: false, autoIndex: true }
);

VerificationTokenSchema.pre<VerificationTokenDocument>("save", function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});
VerificationTokenSchema.pre<VerificationTokenDocument>("updateOne", function() {
  this.update({}, { $set: { updatedAt: new Date() } });
});
export const VerificationModel = model<VerificationTokenDocument>(
  "VerificationModel",
  VerificationTokenSchema
);
