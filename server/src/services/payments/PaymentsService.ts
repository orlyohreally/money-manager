import { Payment } from "@shared/types";
// tslint:disable-next-line: max-line-length
import { ImageManagerService } from "@src/services/image-manager/ImageManagerService";

export interface IPaymentsDao {
  getPayments(userId: string, familyId?: string): Promise<Payment[]>;
  createPayment(payment: Partial<Payment>): Promise<Payment>;
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

  public async getPayments(
    userId: string,
    familyId?: string
  ): Promise<Payment[]> {
    return this.dao.getPayments(userId, familyId);
  }

  public async createPayment(payment: Partial<Payment>): Promise<Payment> {
    return this.dao.createPayment(payment);
  }
}
