import { Payment } from "@shared/types";

export function getTotalPaymentAmount(payments: Payment[]): number {
  return payments.reduce(
    (sum: number, payment: Payment) => sum + payment.amount,
    0
  );
}
