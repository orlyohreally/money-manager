import { Payment } from "@shared/types";
import { Collection, ObjectId } from "mongodb";

import { AggregatedPayment } from "@shared/types/payment-view";
import { modelTransformer } from "@src/utils";
import { getPaymentsView, PaymentModel } from "./models";
import { IPaymentsDao } from "./PaymentsService";

export class PaymentsDao implements IPaymentsDao {
  public async getFamilyPayments(
    familyId: string
  ): Promise<AggregatedPayment[]> {
    const paymentsView: Collection<AggregatedPayment> = await getPaymentsView();

    return paymentsView
      .find({
        familyId: new ObjectId(familyId)
      })
      .toArray();
  }

  public async getUserPayments(userId: string): Promise<AggregatedPayment[]> {
    const paymentsView: Collection<AggregatedPayment> = await getPaymentsView();
    return paymentsView
      .find({
        userId: new ObjectId(userId)
      })
      .toArray();
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
