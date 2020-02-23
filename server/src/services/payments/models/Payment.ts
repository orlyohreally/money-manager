import { ObjectId } from "mongodb";
import { Document, model, Schema } from "mongoose";

import { Payment } from "@shared/types";

type PaymentDocument = Payment & Document;

const PaymentSchema = new Schema<Payment>(
  {
    amount: { type: Number, required: true },
    familyId: { type: ObjectId, ref: "FamilyModel" },
    userId: { type: ObjectId, required: true, ref: "UserModel" },
    subjectId: { type: ObjectId, required: true, ref: "PaymentSubjectModel" },
    currency: String,
    receipt: String,
    paidAt: { type: Date, required: true },
    createdAt: Date,
    updatedAt: Date
  },
  { versionKey: false }
);
PaymentSchema.pre<PaymentDocument>("save", function(next) {
  if (!this.createdAt) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});
PaymentSchema.pre<PaymentDocument>("updateOne", function() {
  this.update({}, { $set: { updatedAt: new Date() } });
});

export const PaymentModel = model<PaymentDocument>(
  "PaymentModel",
  PaymentSchema
);
