export enum Roles {
  Owner = 'Owner',
  Admin = 'Admin',
  Member = 'Member',
  Child = 'Child',
  Adult = 'Adult'
}

export interface FamilyMember<Id = string> {
  _id: {
    familyId: Id;
    userId: Id;
  };
  firstName: string;
  lastName: string;
  roles: string[];
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}
