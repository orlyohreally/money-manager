import { FamilyMember } from '@shared/types';

export interface FamilyPaymentView {
  _id: string;
  amount: number;
  paidAt: string;
  createdAt: string;
  member: FamilyMember;
  updatedAt: string;
  subjectName: string;
  subjectIcon: string;
  currency: string;
  paymentPercentages: { userId: string; paymentPercentage: number }[];
}
