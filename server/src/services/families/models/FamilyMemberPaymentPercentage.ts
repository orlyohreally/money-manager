import { Document, model, Schema } from "mongoose";

import { FamilyMemberPaymentPercentage } from "@shared/types";
import { ObjectId } from "mongodb";

type FamilyMemberPaymentPercentageDocument = Document &
  FamilyMemberPaymentPercentage<ObjectId>;

const FamilyMemberPaymentPercentageSchema = new Schema<
  FamilyMemberPaymentPercentage
>(
  {
    _id: {
      familyId: { type: ObjectId, required: true, ref: "FamilyModel" },
      userId: { type: ObjectId, required: true, ref: "UserModel" },
      createdAt: Date
    },
    paymentPercentage: Number,
    updatedAt: Date
  },
  { versionKey: false, autoIndex: true }
);

FamilyMemberPaymentPercentageSchema.pre<FamilyMemberPaymentPercentageDocument>(
  "save",
  function(next) {
    // tslint:disable-next-line: no-unsafe-any
    if (!this._id || !this._id.createdAt) {
      // tslint:disable-next-line: no-unsafe-any
      this._id.createdAt = new Date();
    }
    this.updatedAt = new Date();
    next();
  }
);
FamilyMemberPaymentPercentageSchema.pre<FamilyMemberPaymentPercentageDocument>(
  "updateOne",
  function() {
    this.update({}, { $set: { updatedAt: new Date() } });
  }
);

export const FamilyMemberPaymentPercentageModel = model<
  FamilyMemberPaymentPercentageDocument
>("FamilyMemberPaymentPercentageModel", FamilyMemberPaymentPercentageSchema);
