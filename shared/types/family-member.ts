export enum Roles {
  Owner = 'Owner',
  Admin = 'Admin',
  Member = 'Member'
}

export interface FamilyMember<Id = string> {
  _id: {
    familyId: Id;
    userId: Id;
  };
  roles: string[];
}
