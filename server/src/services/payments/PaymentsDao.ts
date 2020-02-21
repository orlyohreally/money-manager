import { Payment } from "@shared/types";
import { modelTransformer } from "@src/utils";
import { ObjectId } from "mongodb";

import { PaymentModel } from "./models";
import { IPaymentsDao } from "./PaymentsService";

export class PaymentsDao implements IPaymentsDao {
  public async getFamilyPayments(
    userId: string,
    familyId: string
  ): Promise<Payment[]> {
    return PaymentModel.find({
      userId: new ObjectId(userId),
      familyId: new ObjectId(familyId)
    });
    return PaymentModel.aggregate([
      {
        $match: {
          userId: new ObjectId(userId),
          familyId: new ObjectId(familyId)
        }
      },
      {
        $lookup: {
          from: "paymentsubjectmodels",
          localField: "subjectId",
          foreignField: "_id",
          as: "subject"
        }
      },
      {
        $unwind: "$subject"
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $lookup: {
          from: "familymodels",
          localField: "familyId",
          foreignField: "_id",
          as: "family"
        }
      },
      {
        $unwind: "$family"
      },
      {
        $project: {
          amount: true,
          currency: "$family.currency",
          paidAt: true,
          createdAt: true,
          updatedAt: true,
          receipt: true,
          "subject._id": "$subject._id",
          "subject.name": "$subject.name",
          "subject.icon": "$subject.icon",
          "user._id": "$user._id",
          "user.firstName": "$user.firstName",
          "user.lastName": "$user.lastName",
          "user.paymentPercentage": "$user.paymentPercentage"
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
          from: "paymentsubjectmodels",
          localField: "subjectId",
          foreignField: "_id",
          as: "subject"
        }
      },
      {
        $unwind: "$subject"
      },
      {
        $lookup: {
          from: "usermodels",
          localField: "userId",
          foreignField: "_id",
          as: "user"
        }
      },
      {
        $unwind: "$user"
      },
      {
        $lookup: {
          from: "familymodels",
          localField: "familyId",
          foreignField: "_id",
          as: "family"
        }
      },
      {
        $unwind: { path: "$family", preserveNullAndEmptyArrays: true }
      },
      {
        $project: {
          subjectId: false,
          userId: false,
          familyId: false
        }
      }
    ]);
  }

  public async createPayment(payment: Partial<Payment>): Promise<Payment> {
    const newPayment = new PaymentModel(payment);
    await newPayment.save();
    return newPayment.toJSON(modelTransformer) as Payment;
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
}
