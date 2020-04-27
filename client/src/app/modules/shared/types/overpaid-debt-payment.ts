import { FamilyMember } from '@shared/types';

export interface OverpaidDebtPayment {
  user: FamilyMember;
  toUser?: FamilyMember;
  debt: number;
  overpaid: number;
  currency: string;
  paidAt: string;
  createdAt: string;
  updatedAt: string;
}
