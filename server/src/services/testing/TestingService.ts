import { NextFunction, Request, Response } from "express";

import { PaymentSubject } from "@shared/types";
// tslint:disable-next-line: max-line-length
import { PaymentSubjectsService } from "@src/services/payment-subjects/PaymentSubjectsService";

export class TestingService {
  private paymentSubjectsService: PaymentSubjectsService;

  constructor({
    paymentSubjectsService
  }: {
    paymentSubjectsService: PaymentSubjectsService;
  }) {
    this.paymentSubjectsService = paymentSubjectsService;
  }
  public async validateCredentials(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const credentials = req.headers.authorization as string;
      if (credentials !== process.env.TESTING_CREDENTIALS) {
        throw new Error("Unauthorized access");
      }
      next();
      return;
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized access" });
    }
  }

  public async prepareDBForTests() {
    const paymentSubjects: Pick<PaymentSubject, "name" | "icon">[] = [
      {
        name: "apartment",
        icon: "apartment"
      },
      {
        name: "pet",
        icon: "pet"
      }
    ];
    await this.paymentSubjectsService.createPaymentSubject(paymentSubjects[0]);
    await this.paymentSubjectsService.createPaymentSubject(paymentSubjects[1]);
  }
}
