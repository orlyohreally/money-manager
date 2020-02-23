import { Family } from ".";
import { FamilyMember } from "./family-member";
import { PaymentSubject } from "./payment-subject";

export interface Payment<Id = string> {
  _id: Id;
  amount: number;
  currency: string;
  receipt?: string;
  subjectId: Id;
  paidAt: Date;
  userId: Id;
  familyId?: Id;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface PaymentView<Id = string> {
  _id: Id;
  amount: number;
  currency: string;
  receipt?: string;
  subject: PaymentSubject;
  paidAt: Date;
  user?: FamilyMember;
  family?: Family;
  createdAt: Date;
  updatedAt: Date;
}

// /families/:id
// /families/:id/payments
// /families/:id/payment-subjects
// /families/:id/members
