import { PaymentSubject } from '@shared/types/payment-subject';
import { Family } from './family';

import { Omit } from 'lodash';

export interface Payment<Id = string> {
  _id: Id;
  amount: number;
  createdAt: Date;
  paidAt: Date;
  familyId: Id;
  memberId: Id;
  receipt?: string;
  subjectId: Id;
  updatedAt?: Date;
}

// /families/:id
// /families/:id/payments
// /families/:id/payment-subjects
// /families/:id/members

// const normalize = (payments: Payment[]): { [id: string]: Payment } => {
//   [{id: 1, name: "loh"}] => {1: {id: 1, name: "loh"}}
// };
