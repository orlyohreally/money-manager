import { Payment } from "@shared/types";
import { ObjectId } from "mongodb";

import { AggregatedPayment } from "@shared/types/payment-view";
import { Connection } from "mongoose";
import { PaymentModel } from "./models";
import { IPaymentsDao } from "./PaymentsService";

export class PaymentsDao implements IPaymentsDao {
  private db: Connection | null;

  constructor() {
    // tslint:disable-next-line: no-null-keyword
    this.db = null;
  }

  public async getFamilyPayments(
    familyId: string
  ): Promise<AggregatedPayment[]> {
    if (!this.db) {
      throw new Error("Server error");
    }

    return this.db
      .collection("FamilyPaymentsList")
      .find({
        familyId: new ObjectId(familyId)
      })
      .toArray();
  }

  public async getUserPayments(userId: string): Promise<AggregatedPayment[]> {
    if (!this.db) {
      throw new Error("Server error");
    }

    return this.db
      .collection("FamilyPaymentsList")
      .find({
        userId: new ObjectId(userId)
      })
      .toArray();
  }

  public async createPayment(payment: Partial<Payment>): Promise<Payment> {
    if (!this.db) {
      throw new Error("Server error");
    }

    const newPayment = new PaymentModel(payment);
    await newPayment.save();
    const createdPayment = (await this.db
      .collection("FamilyPaymentsList")
      .find({
        _id: new ObjectId(newPayment._id as string)
      })
      .toArray()) as AggregatedPayment[];
    return createdPayment[0];
  }

  public async updatePayment(payment: Partial<Payment>): Promise<Payment> {
    return PaymentModel.updateOne(
      { _id: payment._id },
      { payment },
      { multi: true }
    )
      .lean()
      .exec();
  }

  public async updatePaymentsAmountByRate(
    familyId: string,
    exchangeRate: number
  ): Promise<void> {
    return PaymentModel.updateMany(
      { familyId: new ObjectId(familyId) },
      { $mul: { amount: exchangeRate } }
    );
  }

  public async initView(db: Connection): Promise<void> {
    this.db = db;
    await db.createCollection("FamilyPaymentsList", {
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
  }
}
