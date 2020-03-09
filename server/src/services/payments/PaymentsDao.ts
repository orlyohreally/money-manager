import { Payment } from "@shared/types";
import { modelTransformer } from "@src/utils";
import { ObjectId } from "mongodb";

import { PaymentModel } from "./models";
import { IPaymentsDao } from "./PaymentsService";

export class PaymentsDao implements IPaymentsDao {
  public async getFamilyPayments(familyId: string): Promise<Payment[]> {
    return PaymentModel.aggregate([
      {
        $match: {
          familyId: new ObjectId(familyId)
        }
      },
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
    ]);
  }

  public async getUserPayments(userId: string): Promise<Payment[]> {
    return PaymentModel.aggregate([
      {
        $match: {
          userId: new ObjectId(userId)
        }
      },
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
    ]);
  }

  public async createPayment(payment: Partial<Payment>): Promise<Payment> {
    const newPayment = new PaymentModel(payment);
    await newPayment.save();
    return (PaymentModel.aggregate([
      {
        $match: {
          _id: new ObjectId(
            (newPayment.toJSON(modelTransformer) as Payment)._id
          )
        }
      },
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
    ]).exec() as Promise<Payment[]>).then((payments: Payment[]) => payments[0]);
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
}
