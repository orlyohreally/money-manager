import { asyncWrap } from "@src/utils";
import { Request, Response, Router } from "express";
import { IRouter } from "express-serve-static-core";

import { Payment, User } from "@shared/types";
import { FamiliesService } from "@src/services/families/FamiliesService";
import { UsersService } from "@src/services/users/UsersService";
import { INTERNAL_SERVER_ERROR, OK } from "http-status-codes";
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
      [
        this.usersService.validateToken.bind(usersService),
        this.service.isViewFamilyPaymentAllowedMW.bind(service)
      ],
      asyncWrap(this.getPayments)
    );
    this.router.post(
      "/payments/",
      this.usersService.validateToken.bind(usersService),
      asyncWrap(this.postUserPayment)
    );
    this.router.post(
      "/payments/:familyId",
      [
        this.usersService.validateToken.bind(usersService),
        this.service.isEditFamilyPaymentAllowedMW.bind(service)
      ],
      asyncWrap(this.postPayment)
    );
    this.router.delete(
      "/payments/:familyId/:paymentId",
      [
        this.usersService.validateToken.bind(usersService),
        this.service.isDeleteFamilyPaymentAllowedMW.bind(service)
      ],
      asyncWrap(this.deleteFamilyPayment)
    );
    this.router.put(
      "/payments/:familyId/update-exchange-rate",
      [
        this.usersService.validateToken.bind(usersService),
        this.familiesService.isUpdateFamilyAllowedMW.bind(familiesService)
      ],
      asyncWrap(this.updatePaymentsByExchangeRate)
    );
    this.router.put(
      "/payments/:familyId/:paymentId",
      [
        this.usersService.validateToken.bind(usersService),
        this.service.isEditFamilyPaymentAllowedMW.bind(service)
      ],
      asyncWrap(this.putFamilyPayment)
    );
    this.router.put(
      "/payments/:paymentId",
      [
        this.usersService.validateToken.bind(usersService),
        this.service.isEditUserPaymentAllowedMW.bind(service)
      ],
      asyncWrap(this.putUserPayment)
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

  /**
   * @route GET /payments/{familyId}
   * @group Family payments
   * @param {string} familyId.path.required
   * @returns {Array.<Payment>} 200 - family payments list
   * @returns {MessageResponse.model} 401 - No user credentials
   * @returns {MessageResponse.model} 403 - Access denied to these payments
   * @returns {Error} 500 - Server error
   * @security JWT
   */
  private getPayments = async (req: Request, res: Response) => {
    try {
      const familyId: string = (req.params as { familyId: string }).familyId;

      const payments: Payment[] = await this.service.getFamilyPayments(
        familyId
      );
      return res.status(200).json(payments);
    } catch (err) {
      return res.status(400).json(err);
    }
  };

  private postPayment = async (req: Request, res: Response) => {
    try {
      const { payment, user } = req.body as {
        payment: Omit<Payment, "_id">;
        user: User;
      };
      const { familyId } = req.params as { familyId: string };

      const error = this.service.validatePayment(payment);
      if (error) {
        return res.status(400).json({ message: error });
      }

      const familyMembers = await this.familiesService.getFamilyMembers(
        familyId
      );
      const percentages = [
        ...familyMembers.map(member => ({
          userId: member._id,
          paymentPercentage: member.paymentPercentage
        }))
      ];
      const createdPayment: Payment = await this.service.createPayment({
        ...payment,
        userId: payment.userId || user._id.toString(),
        familyId,
        paymentPercentages: percentages
      });
      return res.status(200).json(createdPayment);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  };

  /**
   * @route DELETE /payments/{familyId}/{paymentId}
   * @group Family payments
   * @param {string} familyId.path.required
   * @param {string} paymentId.path.required
   * @returns {MessageResponse.model} 200 - payment has been deleted
   * @returns {MessageResponse.model} 401 - no user credentials provided
   * @returns {MessageResponse.model} 403 - access denied to delete payment
   * @returns {MessageResponse.model} 404 - payment has not been found
   * @returns {Error} 500 - Server error
   * @security JWT
   */
  private deleteFamilyPayment = async (
    req: Request,
    res: Response
  ): Promise<Response> => {
    try {
      const { familyId, paymentId } = req.params as {
        familyId: string;
        paymentId: string;
      };
      await this.service.deletePayment(paymentId, familyId);
      return res.status(OK).json({ message: "Payment has been deleted" });
    } catch (err) {
      console.log(err);
      return res.status(INTERNAL_SERVER_ERROR).json(err);
    }
  };

  private putFamilyPayment = async (req: Request, res: Response) => {
    try {
      const body = req.body as { payment: Omit<Payment, "_id">; user: User };
      const { familyId, paymentId } = req.params as {
        familyId: string;
        paymentId: string;
      };

      const error = this.service.validatePayment(body.payment);
      if (error) {
        return res.status(400).json({ message: error });
      }

      const payment = await this.service.updatePayment({
        ...body.payment,
        _id: paymentId,
        familyId
      });

      return res.status(200).json(payment);
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
    }
  };

  private putUserPayment = async (req: Request, res: Response) => {
    try {
      const { payment, user } = req.body as {
        payment: Omit<Payment, "_id">;
        user: User;
      };
      const { paymentId } = req.params as {
        paymentId: string;
      };

      const error = this.service.validatePayment(payment);
      if (error) {
        return res.status(400).json({ message: error });
      }

      const updatedPayment = await this.service.updatePayment({
        ...payment,
        _id: paymentId,
        userId: user._id
      });

      return res.status(OK).json(updatedPayment);
    } catch (err) {
      console.log(err);
      return res.status(INTERNAL_SERVER_ERROR).json(err);
    }
  };

  private updatePaymentsByExchangeRate = async (
    req: Request,
    res: Response
  ) => {
    try {
      const { exchangeRate } = req.body as {
        exchangeRate: number;
        user: User;
      };
      const { familyId } = req.params as { familyId: string };
      if (!exchangeRate || exchangeRate <= 0) {
        res
          .status(406)
          .json({ message: "Exchange rate should be a value bigger then 0" });
        return;
      }

      if (exchangeRate === 1) {
        return res
          .status(200)
          .json({ message: "Successfully updated payments" });
      }

      if (exchangeRate !== 1) {
        await this.service.updatePaymentsAmountByRate(familyId, exchangeRate);
      }

      return res.status(200).json({ message: "Successfully updated payments" });
    } catch (err) {
      console.log(err);
      return res.status(400).json(err);
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
