export interface PaymentFilters {
  member: string | null;
  paymentSubject: string | null;
  startDate: string | null;
  endDate: string | null;
}

export type PaymentFilter =
  | 'member'
  | 'paymentSubject'
  | 'startDate'
  | 'endDate';
