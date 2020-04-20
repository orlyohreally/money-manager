import { ObjectId } from "mongodb";
import { connection, Document, model, Schema } from "mongoose";

import { FamilyMemberPaymentPercentage, Payment } from "@shared/types";

const FamilyMemberPaymentPercentageSchema = new Schema<
  FamilyMemberPaymentPercentage
>(
  {
    userId: {
      type: ObjectId,
      required: true,
      ref: "UserModel",
      index: true
    },
    paymentPercentage: { type: Number, required: true }
  },
  { versionKey: false, autoIndex: true, _id: false }
);

type PaymentDocument = Document & Payment<ObjectId>;

const PaymentSchema = new Schema<Payment>(
  {
    amount: { type: Number, required: true },
    familyId: { type: ObjectId, ref: "FamilyModel", index: true },
    userId: { type: ObjectId, required: true, ref: "UserModel", index: true },
    subjectId: {
      type: ObjectId,
      required: true,
      ref: "PaymentSubjectModel",
      index: true
    },
    receipt: String,
    paidAt: { type: Date, required: true },
    createdAt: Date,
    updatedAt: Date,
    paymentPercentages: [FamilyMemberPaymentPercentageSchema]
  },
  { versionKey: false, autoIndex: true }
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

export const getPaymentsView = async () => {
  return connection.createCollection("AggregatedPayments", {
    viewOn: "paymentmodels"
  });
};
