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
      "/payments/",
      this.usersService.validateToken.bind(usersService),
      asyncWrap(this.getUserPayments)
    );
    this.router.get(
      "/payments/:familyId",
      this.usersService.validateToken.bind(usersService),
      asyncWrap(this.getPayments)
    );
    this.router.post(
      "/payments/",
      this.usersService.validateToken.bind(usersService),
      asyncWrap(this.postUserPayment)
    );
    this.router.post(
      "/payments/:familyId",
      this.usersService.validateToken.bind(usersService),
      asyncWrap(this.postPayment)
    );
  }

  private getUserPayments = async (req: Request, res: Response) => {
    try {
      const body = req.body as { user: User };
      const payments: Payment[] = await this.service.getUserPayments(
        body.user._id
      );
      return res.status(200).json(payments);
    } catch (err) {
      return res.status(400).json(err);
    }
  };

  private getPayments = async (req: Request, res: Response) => {
    try {
      const body = req.body as { user: User };
      const familyId: string = (req.params as { familyId: string }).familyId;
      const updateIsAllowed =
        familyId &&
        (await this.familiesService.userCanUpdateFamily(
          body.user._id,
          familyId
        ));
      if (!updateIsAllowed) {
        return res.status(403).json({ message: "Unathorized access" });
      }

      const payments: Payment[] = await this.service.getFamilyPayments(
        body.user._id,
        familyId
      );
      return res.status(200).json(payments);
    } catch (err) {
      return res.status(400).json(err);
    }
  };

  private postPayment = async (req: Request, res: Response) => {
    try {
      const body = req.body as { payment: Payment; user: User };
      const familyId = (req.params as { familyId: string }).familyId;
      const updateIsAllowed =
        familyId &&
        (await this.familiesService.userCanUpdateFamily(
          body.user._id,
          familyId
        ));
      if (!updateIsAllowed) {
        return res.status(403).json({ message: "Unathorized access" });
      }

      const error = this.service.validatePayment(body.payment);
      if (error) {
        return res.status(400).json({ message: error });
      }
      const isFamilyAdmin = this.familiesService.isFamilyAdmin(
        body.user._id,
        familyId
      );
      let payment: Payment;
      if (!body.payment._id) {
        if (isFamilyAdmin) {
          payment = await this.service.createPayment({
            ...body.payment,
            familyId
          });
        } else {
          payment = await this.service.createPayment({
            ...body.payment,
            userId: body.user._id,
            familyId
          });
        }
        return res.status(200).json(payment);
      }

      if (isFamilyAdmin) {
        payment = await this.service.updatePayment(body.payment);
      } else {
        payment = await this.service.updatePayment({
          ...body.payment,
          userId: body.user._id,
          familyId
        });
      }
      return res.status(200).json(payment);
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  };
  private postUserPayment = async (req: Request, res: Response) => {
    try {
      const body = req.body as { payment: Payment; user: User };
      const error = this.service.validatePayment(body.payment);
      if (error) {
        return res.status(400).json({ message: error });
      }
      let payment: Payment;

      if (!body.payment._id) {
        payment = await this.service.createPayment({
          ...body.payment,
          userId: body.user._id
        });
      } else {
        payment = await this.service.updatePayment({
          ...body.payment,
          userId: body.user._id
        });
      }
      return res.status(200).json(payment);
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  };
}
