export interface Payment<Id = string> {
  _id: Id;
  amount: number;
  createdAt: Date;
  paidAt: Date;
  familyId: Id;
  memberId: Id;
  receipt?: string;
  subjectId: Id;
  updatedAt: Date;
}

// /families/:id
// /families/:id/payments
// /families/:id/payment-subjects
// /families/:id/members
