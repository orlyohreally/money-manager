import { Omit } from '@shared-client/functions';
import { FamilyMember, Payment, PaymentSubject } from '@shared/types';

export interface FamilyPaymentView
  extends Omit<
    Payment,
    'userId' | 'subjectId' | 'createdAt' | 'updatedAt' | 'paidAt'
  > {
  paidAt: string;
  currency: string;
  createdAt: string;
  member: FamilyMember;
  updatedAt: string;
  subject: PaymentSubject;
}
