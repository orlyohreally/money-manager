import { Request, Response, Router } from "express";
import { IRouter } from "express-serve-static-core";

import { asyncWrap } from "@src/utils";

import { PaymentSubject } from "@shared/types";
// tslint:disable-next-line: max-line-length
import { UsersService } from "@src/services/users/UsersService";
import { PaymentSubjectsService } from "./PaymentSubjectsService";

export class PaymentSubjectsRouter {
  public router: IRouter;
  private service: PaymentSubjectsService;
  private usersService: UsersService;

  constructor({
    service,
    usersService
  }: {
    service: PaymentSubjectsService;
    usersService: UsersService;
  }) {
    this.router = Router();
    this.service = service;
    this.usersService = usersService;

    this.router.get(
      "/payment-subjects/:familyId",
      this.usersService.validateToken.bind(usersService),

      asyncWrap(this.getPaymentSubjects)
    );
    this.router.post(
      "/payment-subjects",
      this.usersService.validateToken.bind(usersService),
      asyncWrap(this.postPaymentSubject)
    );
  }

  private getPaymentSubjects = async (req: Request, res: Response) => {
    try {
      const familyId: string = (req.params as { familyId: string }).familyId;
      const paymentSubjects = await this.service.getPaymentSubjects(familyId);
      return res.status(200).json(paymentSubjects);
    } catch (err) {
      return res.status(400).json(err);
    }
  };

  private postPaymentSubject = async (req: Request, res: Response) => {
    try {
      const body = req.body as { paymentSubject: PaymentSubject };
      if (!body.paymentSubject) {
        return res.status(400).json("Values were not provided");
      }
      const paymentSubject = await this.service.createPaymentSubject(
        body.paymentSubject
      );
      return res.status(200).json(paymentSubject);
    } catch (err) {
      return res.status(400).json(err);
    }
  };
}
