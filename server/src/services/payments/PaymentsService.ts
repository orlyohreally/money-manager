import { MemberPaymentPercentage, Payment } from "@shared/types";
// tslint:disable-next-line: max-line-length
import { ImageManagerService } from "@src/services/image-manager/ImageManagerService";

export interface IPaymentsDao {
  getUserPayments(userId: string): Promise<Payment[]>;
  getFamilyPayments(familyId: string): Promise<Payment[]>;
  createPayment(payment: Partial<Payment>): Promise<Payment>;
  updatePayment(payment: Partial<Payment>): Promise<Payment>;
  getPaymentPercentages(familyId: string): Promise<MemberPaymentPercentage[]>;
}

export class PaymentsService {
  private dao: IPaymentsDao;
  // private imageLoaderService: ImageManagerService;

  constructor({
    dao
  }: {
    dao: IPaymentsDao;
    imageLoaderService: ImageManagerService;
  }) {
    this.dao = dao;
    // this.imageLoaderService = imageLoaderService;
  }

  public async getFamilyPayments(familyId: string): Promise<Payment[]> {
    return this.dao.getFamilyPayments(familyId);
  }

  public async getUserPayments(userId: string): Promise<Payment[]> {
    return this.dao.getUserPayments(userId);
  }

  public async createPayment(payment: Partial<Payment>): Promise<Payment> {
    return this.dao.createPayment(payment);
  }

  public async updatePayment(payment: Partial<Payment>): Promise<Payment> {
    return this.dao.updatePayment(payment);
  }

  public validatePayment(payment: Partial<Payment>): string | null {
    if (!payment || !payment.amount || !payment.subjectId || !payment.paidAt) {
      return "Values were not provided";
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

  public getPaymentPercentages(familyId: string) {
    return this.dao.getPaymentPercentages(familyId);
  }
}
