export interface Payment<Id = string> {
  _id: Id;
  amount: number;
  receipt?: string;
  subjectId: Id;
  paidAt: Date;
  userId: Id;
  familyId?: Id;
  createdAt?: Date;
  updatedAt?: Date;
  paymentPercentages: { userId: Id; paymentPercentage: number }[];
}

// /families/:id
// /families/:id/payments
// /families/:id/payment-subjects
// /families/:id/members
