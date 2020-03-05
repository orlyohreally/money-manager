export interface FamilyPaymentView {
  amount: number;
  paidAt: string;
  createdAt: string;
  memberFullName: string;
  memberEmail: string;
  updatedAt: string;
  subjectName: string;
  subjectIcon: string;
  currency: string;
  paymentPercentages: { userId: string; paymentPercentage: number }[];
}
