import { Component, Input, OnInit } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { MembersService } from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { PaymentsService } from '@core-client/services/payments/payments.service';
import { FamilyMember, Payment, User } from '@shared/types';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface OverpaidDebtPayment {
  user: User;
  toUser?: User;
  debt: number;
  overpaid: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentDebt {
  user: User;
  debt: number;
  overpaid: number;
  amount: number;
}

@Component({
  selector: 'payment-member-overpay-and-debt',
  templateUrl: './member-payment-overpay-and-debt.component.html',
  styleUrls: ['./member-payment-overpay-and-debt.component.scss']
})
export class MemberPaymentOverpayAndDebtComponent implements OnInit {
  @Input() familyId: string;

  familyCurrency: Observable<string>;
  paymentTransactions: Observable<OverpaidDebtPayment[]>;
  overpaysAndDebtsList: Observable<PaymentDebt[]>;
  showMoreDetailedList = false;

  constructor(
    private membersService: MembersService,
    private familiesService: FamiliesService,
    private paymentsService: PaymentsService
  ) {}

  ngOnInit() {
    this.paymentTransactions = this.getPaymentTransactions();
    this.overpaysAndDebtsList = this.getOverpayAndDebtsList();
    this.familyCurrency = this.familiesService.getFamilyCurrency(this.familyId);
  }

  showMoreLessDetails() {
    this.showMoreDetailedList = !this.showMoreDetailedList;
  }

  private getOverpayAndDebtsList(): Observable<PaymentDebt[]> {
    return this.paymentTransactions.pipe(
      map(payments => {
        if (!payments.length) {
          return {};
        }
        return payments.reduce((res, payment) => {
          if (res[payment.user._id]) {
            return {
              ...res,
              [payment.user._id]: {
                ...res[payment.user._id],
                user: payment.user,
                amount:
                  res[payment.user._id].amount +
                  payment.overpaid -
                  payment.debt,
                debt: res[payment.user._id].debt + payment.debt,
                overpaid: res[payment.user._id].overpaid + payment.overpaid
              }
            };
          }
          return {
            ...res,
            [payment.user._id]: {
              ...res[payment.user._id],
              user: payment.user,
              amount: payment.overpaid - payment.debt,
              debt: payment.debt,
              overpaid: payment.overpaid
            }
          };
        }, {});
      }),
      map(debts => {
        return Object.keys(debts)
          .map((userId: string) => ({
            user: debts[userId].user,
            debt: debts[userId].debt,
            overpaid: debts[userId].overpaid,
            amount: debts[userId].amount
          }))
          .reduce((acc, val) => acc.concat(val), []);
      })
    );
  }

  private getPaymentTransactions(): Observable<OverpaidDebtPayment[]> {
    return combineLatest([
      this.membersService.getMembers(this.familyId),
      this.paymentsService.getPayments(this.familyId)
    ]).pipe(
      map(([members, payments]: [FamilyMember[], Payment[]]) => {
        if (!payments.length) {
          return [];
        }
        const calc = payments
          .map(payment => {
            return !payment.paymentPercentages ||
              !payment.paymentPercentages.length
              ? this.calcForEqualPercentages(payment, members)
              : this.calcForDifferentPercentages(payment, members);
          })
          .reduce((acc, val) => acc.concat(val), []);
        return calc;
      })
    );
  }

  private calcForDifferentPercentages(
    payment: Payment,
    members: FamilyMember[]
  ) {
    return payment.paymentPercentages
      .map(percentage => {
        const user = members.filter(member => member._id === payment.userId)[0];
        const percentageUser = members.filter(
          member => member._id === percentage.userId
        )[0];
        const debt =
          user._id === percentageUser._id
            ? 0
            : (payment.amount * percentage.paymentPercentage) / 100;
        const overpaid =
          user._id === percentageUser._id
            ? (payment.amount * (100 - percentage.paymentPercentage)) / 100
            : 0;
        return {
          user: percentageUser,
          toUser: user,
          debt,
          overpaid,
          currency: payment.currency,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt
        };
      })
      .reduce((acc, val) => acc.concat(val), []);
  }

  private calcForEqualPercentages(payment: Payment, members: FamilyMember[]) {
    return members
      .map(percentageUser => {
        const user = members.filter(member => member._id === payment.userId)[0];
        const paymentPercentage = 100 / members.length;
        const debt =
          user._id === percentageUser._id
            ? 0
            : (payment.amount * paymentPercentage) / 100;
        const overpaid =
          user._id === percentageUser._id
            ? (payment.amount * (100 - paymentPercentage)) / 100
            : 0;
        return {
          user: percentageUser,
          toUser: user,
          debt,
          overpaid,
          currency: payment.currency,
          createdAt: payment.createdAt,
          updatedAt: payment.updatedAt
        };
      })
      .reduce((acc, val) => acc.concat(val), []);
  }
}
