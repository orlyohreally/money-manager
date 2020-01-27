export enum Roles {
  Owner = "Owner",
  Admin = "Admin",
  Member = "Member",
  Child = "Child",
  Adult = "Adult"
}

export interface FamilyMember<Id = string> {
  _id: {
    familyId: Id;
    userId: Id;
  };
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
}
