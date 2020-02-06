import { PaymentSubject } from "@shared/types";
// tslint:disable-next-line: max-line-length
import { ImageManagerService } from "@src/services/image-manager/ImageManagerService";

export interface IPaymentSubjectsDao {
  createPaymentSubject(
    subject: Partial<PaymentSubject>
  ): Promise<PaymentSubject>;
  getPaymentSubjects(): Promise<PaymentSubject[]>;
}

export class PaymentSubjectsService {
  private dao: IPaymentSubjectsDao;
  // private imageLoaderService: ImageManagerService;

  constructor({
    dao
  }: {
    dao: IPaymentSubjectsDao;
    imageLoaderService: ImageManagerService;
  }) {
    this.dao = dao;
    // this.imageLoaderService = imageLoaderService;
  }

  public async getPaymentSubjects(): Promise<PaymentSubject[]> {
    return this.dao.getPaymentSubjects();
  }

  public async createPaymentSubject(
    subject: Partial<PaymentSubject>
  ): Promise<PaymentSubject> {
    return this.dao.createPaymentSubject(subject);
  }
}
