export interface PaymentSubject<Id = string> {
  _id: Id;
  familyId: Id;
  name: string;
  icon: string;
}
