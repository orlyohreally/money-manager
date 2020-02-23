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
  }

  public async getUserPayments(userId: string): Promise<Payment[]> {
    return PaymentModel.find({
      userId: new ObjectId(userId)
    });
  }

  public async createPayment(payment: Partial<Payment>): Promise<Payment> {
    const newPayment = new PaymentModel(payment);
    console.log("newPayment", newPayment, payment);
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
