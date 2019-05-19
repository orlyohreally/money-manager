import { Payment } from "@shared/types";
import { normalizedArray, groupBy, unnormalizeArray } from "./array";

export function getTotalPaymentAmount(payments: Payment[]): number {
  return payments.reduce((sum, payment) => (sum += payment.amount), 0);
}

export function aggregateAmountsByMember(
  payments: normalizedArray<Payment>,
  membersIds: string[]
): { [memberId: string]: number } {
  const groupedPayments = groupBy(unnormalizeArray(payments), "memberId");
  return membersIds.reduce((res, memberId) => {
    res[memberId] = getTotalPaymentAmount(groupedPayments[memberId] || []);
    return res;
  }, {});
}

export function getDischargedTotal(
  payments: normalizedArray<Payment>,
  membersIds: string[]
): { [memberId: string]: number } {
  const aggregatedPayments = aggregateAmountsByMember(payments, membersIds);
  const totalAmount = getTotalPaymentAmount(unnormalizeArray(payments));

  return membersIds.reduce((res, memberId) => {
    res[memberId] =
      aggregatedPayments[memberId] - totalAmount / membersIds.length;
    return res;
  }, {});
}
