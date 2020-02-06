import { PaymentSubject } from "@shared/types";
import { modelTransformer } from "@src/utils";

import { PaymentSubjectModel } from "./models";
import { IPaymentSubjectsDao } from "./PaymentSubjectsService";

export class PaymentSubjectsDao implements IPaymentSubjectsDao {
  public async getPaymentSubjects(): Promise<PaymentSubject[]> {
    return PaymentSubjectModel.find({})
      .lean()
      .exec();
  }

  public async createPaymentSubject(
    subject: Partial<PaymentSubject>
  ): Promise<PaymentSubject> {
    const newSubject = new PaymentSubjectModel(subject);
    await newSubject.save();
    return newSubject.toJSON(modelTransformer) as PaymentSubject;
  }
}
