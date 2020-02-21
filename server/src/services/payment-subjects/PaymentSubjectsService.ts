import { PaymentSubject } from "@shared/types";
// tslint:disable-next-line: max-line-length
import { ImageManagerService } from "@src/services/image-manager/ImageManagerService";

export interface IPaymentSubjectsDao {
  createPaymentSubject(
    subject: Partial<PaymentSubject>
  ): Promise<PaymentSubject>;
  getPaymentSubjects(familyId: string): Promise<PaymentSubject[]>;
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

  public async getPaymentSubjects(familyId: string): Promise<PaymentSubject[]> {
    return this.dao.getPaymentSubjects(familyId);
  }

  public async createPaymentSubject(
    subject: Partial<PaymentSubject>
  ): Promise<PaymentSubject> {
    return this.dao.createPaymentSubject(subject);
  }
}
