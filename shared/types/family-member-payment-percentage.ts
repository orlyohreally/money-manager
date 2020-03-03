export interface FamilyMemberPaymentPercentage<Id = string> {
  userId: Id;
  familyId: Id;
  paymentPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}
