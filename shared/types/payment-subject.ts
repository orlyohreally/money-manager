export interface PaymentSubject<Id = string> {
  _id: Id;
  name: string;
  icon: string;
  createdAt?: Date;
  updatedAt?: Date;
}
