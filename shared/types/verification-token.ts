export interface VerificationToken<Id = string> {
  _id: Id;
  token: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}
