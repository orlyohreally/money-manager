import { Family } from ".";

export type FamilyView = Family & {
  name: string;
  membersCount: number;
  equalPayments: boolean;
};
