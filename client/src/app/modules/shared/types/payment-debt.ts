import { FamilyMember } from '@shared/types';

export interface PaymentExpense {
  member: FamilyMember;
  amount: number;
  currency: string;
}
