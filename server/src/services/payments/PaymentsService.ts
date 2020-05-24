import { NextFunction, Request, Response } from "express";

import { Payment, User } from "@shared/types";
import { familiesService } from "@src/services/families";
import { FamiliesService } from "@src/services/families/FamiliesService";
// tslint:disable-next-line: max-line-length
import { ImageManagerService } from "@src/services/image-manager/ImageManagerService";
import { FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND } from "http-status-codes";

export interface IPaymentsDao {
  getUserPayments(userId: string): Promise<Payment[]>;
  getFamilyPayments(familyId: string): Promise<Payment[]>;
  createPayment(payment: Partial<Payment>): Promise<Payment>;
  updatePayment(payment: Partial<Payment> & { _id: string }): Promise<Payment>;
  updatePaymentsAmountByRate(
    familyId: string,
    exchangeRate: number
  ): Promise<void>;
  getPayment(paymentId: string, familyId?: string): Promise<Payment>;
  deleteUserPayments(userId: string): Promise<void>;
}

export class PaymentsService {
  private dao: IPaymentsDao;
  private familiesService: FamiliesService;
  // private imageLoaderService: ImageManagerService;

  constructor({
    dao
  }: {
    dao: IPaymentsDao;
    imageLoaderService: ImageManagerService;
    familiesService: FamiliesService;
  }) {
    this.dao = dao;
    this.familiesService = familiesService;
    // this.imageLoaderService = imageLoaderService;
  }

  public async getFamilyPayments(familyId: string): Promise<Payment[]> {
    return this.dao.getFamilyPayments(familyId);
  }

  public async getPayment(
    paymentId: string,
    familyId?: string
  ): Promise<Payment> {
    return this.dao.getPayment(paymentId, familyId);
  }

  public async getUserPayments(userId: string): Promise<Payment[]> {
    return this.dao.getUserPayments(userId);
  }

  public async createPayment(payment: Partial<Payment>): Promise<Payment> {
    return this.dao.createPayment(payment);
  }

  public async updatePayment(
    payment: Partial<Payment> & { _id: string }
  ): Promise<Payment> {
    return this.dao.updatePayment(payment);
  }

  public validatePayment(payment: Partial<Payment>): string | null {
    if (!payment || !payment.amount || !payment.subjectId || !payment.paidAt) {
      return "amount, subjectId, paidAt are required";
    }

    if (
      parseFloat(payment.amount.toString()) !== payment.amount ||
      payment.amount < 0
    ) {
      return "Invalid value for amount";
    }
    // tslint:disable-next-line: no-null-keyword
    return null;
  }

  public async updatePaymentsAmountByRate(
    familyId: string,
    exchangeRate: number
  ): Promise<void> {
    return this.dao.updatePaymentsAmountByRate(familyId, exchangeRate);
  }

  public async isViewFamilyPaymentAllowedMW(
    req: Request & { user: User },
    res: Response,
    next: NextFunction
  ) {
    try {
      const { familyId } = req.params as {
        familyId: string;
        paymentId?: string;
      };
      const { user } = req.body as {
        user: User;
      };

      const isFamilyMember = await this.familiesService.isFamilyMember(
        user._id.toString(),
        familyId
      );
      if (!isFamilyMember) {
        return res.status(FORBIDDEN).json({ message: "Forbidden" });
      }
      next();
      return;
    } catch (error) {
      console.log("error", error);
      return res.status(FORBIDDEN).json(error);
    }
  }

  public async isEditFamilyPaymentAllowedMW(
    req: Request & { user?: User },
    res: Response,
    next: NextFunction
  ) {
    try {
      const { familyId, paymentId } = req.params as {
        familyId: string;
        paymentId: string;
      };

      const { payment, user } = req.body as {
        payment: Omit<Payment, "_id">;
        user: User;
      };

      if (!payment) {
        return res.status(403).json({ message: "Payment is required" });
      }

      try {
        if (paymentId) {
          const currentPayment = await this.getPayment(paymentId, familyId);
          if (!currentPayment) {
            return res
              .status(NOT_FOUND)
              .json({ message: "Payment has not been found" });
          }
        }
        const updateAllowed = await this.isEditFamilyPaymentAllowed(
          user._id.toString(),
          familyId,
          payment,
          paymentId
        );
        if (!updateAllowed) {
          return res.status(FORBIDDEN).json({ message: "Forbidden" });
        }
      } catch (error) {
        console.log("error", error);
        return res.status(INTERNAL_SERVER_ERROR).send(error);
      }
      next();
      return;
    } catch (error) {
      console.log("error", error);
      return res.status(FORBIDDEN).json(error);
    }
  }

  public async isEditUserPaymentAllowedMW(
    req: Request & { user?: User },
    res: Response,
    next: NextFunction
  ) {
    try {
      const { paymentId } = req.params as {
        paymentId: string;
      };

      const { payment, user } = req.body as {
        payment: Omit<Payment, "_id">;
        user: User;
      };

      if (!payment) {
        return res.status(403).json({ message: "Payment is required" });
      }

      const currentPayment = await this.getPayment(paymentId);
      if (!currentPayment) {
        return res.status(500).json({ message: "Payment has not been found" });
      }
      if (user._id.toString() !== currentPayment.userId.toString()) {
        return res.status(403).json({ message: "Unauthorized access" });
      }

      next();
      return;
    } catch (error) {
      console.log("error", error);
      return res.status(INTERNAL_SERVER_ERROR).send(error);
    }
  }

  public deleteUserPayments(userId: string): Promise<void> {
    return this.dao.deleteUserPayments(userId);
  }

  private async isEditFamilyPaymentAllowed(
    userId: string,
    familyId: string,
    payment: Omit<Payment, "_id">,
    paymentId?: string
  ): Promise<boolean> {
    // user is family member
    const isFamilyMember = await this.familiesService.isFamilyMember(
      userId,
      familyId
    );
    if (!isFamilyMember) {
      return false;
    }

    // payer is a family member
    let payerId = payment.userId;
    if (paymentId && !payment.userId) {
      const currentPayment = await this.getPayment(paymentId, familyId);
      payerId = currentPayment._id.toString();
    }
    const isPayerFamilyMember = await this.familiesService.isFamilyMember(
      payerId || userId,
      familyId
    );
    if (!isPayerFamilyMember) {
      return false;
    }

    // user is family admin or is the payer
    const isFamilyAdmin = await this.familiesService.isFamilyAdmin(
      userId,
      familyId
    );
    const isUserPayer =
      payment.userId === userId || payment.userId === undefined;
    if (paymentId) {
      const currentPayment = await this.getPayment(paymentId, familyId);
      if (!currentPayment) {
        throw new Error("Payment has not been found");
      }

      return (
        isFamilyAdmin ||
        (currentPayment.userId.toString() === userId && isUserPayer)
      );
    }
    return isFamilyAdmin || isUserPayer;
  }
}
