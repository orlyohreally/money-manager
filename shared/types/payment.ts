export interface Payment<Id = string> {
  _id: Id;
  amount: number;
  familyId: Id;
  userId: Id;
  receipt?: string;
  subjectId: Id;
  paidAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// /families/:id
// /families/:id/payments
// /families/:id/payment-subjects
// /families/:id/members
