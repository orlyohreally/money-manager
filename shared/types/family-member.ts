export enum Roles {
  Owner = "Owner",
  Admin = "Admin",
  Member = "Member",
  Child = "Child",
  Adult = "Adult"
}

export interface FamilyMember<Id = string> {
  _id: Id;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
  icon: string;
  paymentPercentage: number;
  inactive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
