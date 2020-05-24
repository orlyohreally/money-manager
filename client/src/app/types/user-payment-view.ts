import { Omit } from '@shared-client/functions';
import { Payment, PaymentSubject, User } from '@shared/types';
import { MemberFamily } from '../modules/shared/types';

export interface UserPaymentView
  extends Omit<
    Payment,
    'createdAt' | 'updatedAt' | 'paidAt' | 'familyId' | 'subjectId' | 'userId'
  > {
  paidAt: string;
  createdAt: string;
  updatedAt: string;
  member: User;
  family?: MemberFamily;
  subject: PaymentSubject;
  currency: string;
}
