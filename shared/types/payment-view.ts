export interface AggregatedPayment<Id = string> {
  _id: Id;
  amount: number;
  receipt?: string;
  subjectId: Id;
  paidAt: Date;
  currency: string;
  userId: Id;
  familyId: Id;
  createdAt: Date;
  updatedAt: Date;
  paymentPercentages: { userId: Id; paymentPercentage: number }[];
}
