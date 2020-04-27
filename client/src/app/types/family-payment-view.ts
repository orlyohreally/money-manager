import { FamilyMember, PaymentSubject } from '@shared/types';

export interface FamilyPaymentView {
  _id: string;
  amount: number;
  paidAt: string;
  currency: string;
  createdAt: string;
  receipt?: string;
  member: FamilyMember;
  updatedAt: string;
  subject: PaymentSubject;
  paymentPercentages: { userId: string; paymentPercentage: number }[];
}
