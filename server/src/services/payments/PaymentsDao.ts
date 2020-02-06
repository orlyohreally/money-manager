import { Payment } from "@shared/types";
import { modelTransformer } from "@src/utils";

import { PaymentModel } from "./models";
import { IPaymentsDao } from "./PaymentsService";

export class PaymentsDao implements IPaymentsDao {
  public async getPayments(
    userId: string,
    familyId?: string
  ): Promise<Payment[]> {
    return PaymentModel.find({ userId, familyId })
      .lean()
      .exec();
  }

  public async createPayment(payment: Partial<Payment>): Promise<Payment> {
    const newPayment = new PaymentModel(payment);
    await newPayment.save();
    return newPayment.toJSON(modelTransformer) as Payment;
  }
}
