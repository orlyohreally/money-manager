import { Family } from ".";

export type FamilyView = Family & {
  membersCount: number;
  equalPayments: boolean;
  userRoles: string[];
  spent: number;
};
