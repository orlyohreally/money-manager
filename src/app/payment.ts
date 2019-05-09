import { Payer } from "./payer";

export class Payment {
  _id: string;
  user: Payer;
  date: number;
  created: number;
  updated: number;
  amount: number;
  message: string;
  receipt?: string;
  expanded: boolean;
}
