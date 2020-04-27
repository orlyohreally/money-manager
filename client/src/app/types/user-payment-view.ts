import { PaymentSubject } from '@shared/types';
import { MemberFamily } from '../modules/shared/types';

export interface UserPaymentView {
  _id: string;
  amount: number;
  paidAt: string;
  receipt?: string;
  createdAt: string;
  family?: MemberFamily;
  updatedAt: string;
  subject: PaymentSubject;
  currency: string;
}
