import { Request, Response, Router } from "express";
import { IRouter } from "express-serve-static-core";

import { asyncWrap } from "@src/utils";

import { Payment, User } from "@shared/types";
import { FamiliesService } from "@src/services/families/FamiliesService";
import { UsersService } from "@src/services/users/UsersService";
import { PaymentsService } from "./PaymentsService";

export class PaymentsRouter {
  public router: IRouter;
  private service: PaymentsService;
  private usersService: UsersService;
  private familiesService: FamiliesService;

  constructor({
    service,
    usersService,
    familiesService
  }: {
    service: PaymentsService;
    usersService: UsersService;
    familiesService: FamiliesService;
  }) {
    this.router = Router();
    this.service = service;
    this.usersService = usersService;
    this.familiesService = familiesService;

    this.router.get(
      "/payments",
      this.usersService.validateToken.bind(usersService),

      asyncWrap(this.getPayments)
    );

    this.router.post(
      "/payments",

      this.usersService.validateToken.bind(usersService),
      asyncWrap(this.postPayment)
    );
  }

  private getPayments = async (req: Request, res: Response) => {
    try {
      const body = req.body as { payment: Partial<Payment>; user: User };
      const familyId: string | null = (req.query as { familyId: string })
        .familyId;
      if (familyId) {
        const updateIsAllowed =
          body.payment.familyId &&
          (await this.familiesService.userCanUpdateFamily(
            body.user._id,
            familyId
          ));
        if (!updateIsAllowed) {
          return res.status(403).json("Unathorized access");
        }
      }
      const payments = await this.service.getPayments(body.user._id, familyId);
      return res.status(200).json(payments);
    } catch (err) {
      return res.status(400).json(err);
    }
  };

  private postPayment = async (req: Request, res: Response) => {
    try {
      const body = req.body as { payment: Partial<Payment>; user: User };
      const updateIsAllowed =
        body.payment.familyId &&
        (await this.familiesService.userCanUpdateFamily(
          body.user._id,
          body.payment.familyId
        ));
      if (!updateIsAllowed) {
        return res.status(403).json("Unathorized access");
      }

      if (
        !body.payment ||
        !body.payment.amount ||
        !body.payment.subjectId ||
        !body.payment.paidAt
      ) {
        return res.status(400).json("Values were not provided");
      }

      const payment = await this.service.createPayment({
        ...body.payment,
        userId: body.user._id
      });
      return res.status(200).json(payment);
    } catch (err) {
      return res.status(400).json(err);
    }
  };
}
