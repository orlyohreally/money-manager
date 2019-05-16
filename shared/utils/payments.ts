import { Payment } from '@shared/types/payment';

export function getTotal(payments: Payment[]): number {
  return payments.reduce((sum, p) => (sum += p.amount), 0);
}
export function groupByMember(payments: Payment[]) {
  const reducer = (accumulator, currentValue) => {
    accumulator[currentValue.memberId] = (
      accumulator[currentValue.memberId] || []
    ).concat(currentValue);
    return accumulator;
  };
  return payments.reduce(reducer, {});
}

export function aggregateAmountsByMember(
  payments: Payment[],
  membersIds: string[]
): { [memberId: string]: number } {
  const groupedPayments = groupByMember(payments);
  const getMemberTotalAmount = (memberId: string) => {
    return {
      [memberId]: (groupedPayments[memberId] || []).reduce(
        (sum, payment) => sum + payment.amount,
        0
      )
    };
  };
  return membersIds
    .map(getMemberTotalAmount)
    .reduce((accumulator, currentValue) =>
      Object.assign(accumulator, currentValue)
    );
}

export function getDischargedTotal(
  payments: Payment[],
  membersIds: string[]
): { [memberId: string]: number } {
  const aggregatedPayments = aggregateAmountsByMember(payments, membersIds);
  const totalAmount = getTotal(payments);
  console.log(aggregatedPayments, totalAmount);
  return membersIds
    .map(memberId => {
      let amount = aggregatedPayments[memberId];
      if (!amount) {
        amount = 0;
      }
      aggregatedPayments[memberId] = totalAmount / membersIds.length - amount;
      return aggregatedPayments;
    })
    .reduce((accumulator, currentValue) =>
      Object.assign(accumulator, currentValue)
    );
}
