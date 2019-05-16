export interface FamilyMember<Id = string> {
  _id: {
    familyId: Id;
    memberId: Id;
  };
  roles: string[];
}
