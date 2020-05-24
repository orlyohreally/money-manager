import { Family } from ".";

export type FamilyView = Family & {
  membersCount: number;
  userRoles: string[];
  spent: number;
};
