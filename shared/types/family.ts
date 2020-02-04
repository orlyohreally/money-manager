export interface Family<Id = string> {
  _id: Id;
  name: string;
  icon: string;
  currency: string;
  equalPayments: boolean;
  createdAt: Date;
  updatedAt: Date;
}
