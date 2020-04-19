import { ObjectId } from "mongodb";
import { connection, Document, model, Schema } from "mongoose";

import { Payment } from "@shared/types";

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
    updatedAt: Date
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
    viewOn: "paymentmodels",
    pipeline: [
      {
        $lookup: {
          let: {
            familyId: "$familyId",
            paymentCreatedAt: "$createdAt"
          },
          from: "familymemberpaymentpercentagemodels",
          as: "paymentPercentages",
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$_id.familyId", "$$familyId"] },
                    { $lt: ["$_id.createdAt", "$$paymentCreatedAt"] }
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
                userId: "$_id",
                _id: false,
                paymentPercentage: true
              }
            }
          ]
        }
      }
    ]
  });
};
