import { ObjectId } from "mongodb";
import { Document, model, Schema } from "mongoose";

import { PaymentSubject } from "@shared/types";

type PaymentSubjectDocument = Document & PaymentSubject<ObjectId>;

const PaymentSubjectSchema = new Schema<PaymentSubject>(
  {
    familyId: { type: ObjectId, ref: "FamilyModel", index: true },
    userId: { type: ObjectId, ref: "UserModel", index: true },
    name: { type: String, required: true },
    icon: String,
    createdAt: Date,
    updatedAt: Date
  },
  { versionKey: false, autoIndex: true }
);

PaymentSubjectSchema.pre<PaymentSubjectDocument>("save", function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});

PaymentSubjectSchema.pre<PaymentSubjectDocument>("updateOne", function() {
  this.update({}, { $set: { updatedAt: new Date() } });
});

export const PaymentSubjectModel = model<PaymentSubjectDocument>(
  "PaymentSubjectModel",
  PaymentSubjectSchema
);
