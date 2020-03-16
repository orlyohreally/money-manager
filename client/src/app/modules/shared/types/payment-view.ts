import { FamilyMember, PaymentSubject } from '@shared/types';
import { MemberFamily } from '.';

export interface PaymentView<Id = string> {
  _id: Id;
  amount: number;
  receipt?: string;
  subject: PaymentSubject;
  paidAt: Date;
  currency: string;
  user?: FamilyMember;
  family?: MemberFamily;
  createdAt: Date;
  updatedAt: Date;
  paymentPercentages: { userId: Id; paymentPercentage: number }[];
}
