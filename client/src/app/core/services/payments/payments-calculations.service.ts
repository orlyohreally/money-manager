import { CurrencyPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { combineLatest, from, Observable, of } from 'rxjs';

import { compare } from '@shared-client/functions';
import { OverpaidDebtPayment, PaymentExpense } from '@shared-client/types';
import { FamilyMember, Payment, PaymentSubject, User } from '@shared/types';
import { FamilyPaymentView, UserPaymentView } from '@src/app/types';
import { concatMap, map, mergeMap, toArray } from 'rxjs/operators';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '../authentication/authentication.service';
import { FamiliesService } from '../families/families.service';
import { MembersService } from '../members/members.service';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectsService } from '../payment-subject/payment-subjects.service';
import { PaymentsService } from './payments.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentsCalculationsService {
  constructor(
    private paymentSubjectsService: PaymentSubjectsService,
    private familiesService: FamiliesService,
    private membersService: MembersService,
    private paymentsService: PaymentsService,
    private authenticationService: AuthenticationService,
    private currencyPipe: CurrencyPipe
  ) {}

  getAggregatedUserPayments(): Observable<UserPaymentView[]> {
    return combineLatest([
      this.authenticationService.getUser(),
      this.paymentsService.getUserPayments()
    ]).pipe(
      mergeMap(([user, payments]: [User, Payment[]]) => {
        if (!user) {
          return of([]);
        }
        return from(payments).pipe(
          concatMap(payment =>
            combineLatest([
              this.paymentSubjectsService.getSubjectById(payment.subjectId),
              payment.familyId
                ? this.familiesService.getFamilyById(payment.familyId)
                : of(undefined)
            ]).pipe(
              map(
                ([subject, family]) =>
                  ({
                    _id: payment._id,
                    amount: payment.amount,
                    currency: family ? family.currency : user.currency,
                    receipt: payment.receipt,
                    subject,
                    paidAt: payment.paidAt.toString(),
                    family,
                    member: user,
                    createdAt: payment.createdAt.toString(),
                    updatedAt: payment.updatedAt.toString(),
                    paymentPercentages: payment.paymentPercentages
                  } as UserPaymentView)
              )
            )
          ),
          toArray()
        );
      }),
      map(payments =>
        payments.sort((a, b) => compare(a.paidAt, b.paidAt, false))
      )
    );
  }

  getAggregatedPayments(familyId?: string): Observable<FamilyPaymentView[]> {
    return combineLatest([
      this.paymentsService.getPayments(familyId),
      this.familiesService.getFamilyCurrency(familyId)
    ]).pipe(
      mergeMap(([payments, currency]: [Payment[], string]) => {
        return from(payments).pipe(
          concatMap(payment =>
            combineLatest([
              this.paymentSubjectsService.getSubjectById(
                payment.subjectId,
                familyId
              ),
              this.membersService.getFamilyMemberById(familyId, payment.userId)
            ]).pipe(
              map(
                ([subject, user]) =>
                  ({
                    _id: payment._id,
                    amount: payment.amount,
                    receipt: payment.receipt,
                    subject,
                    paidAt: payment.paidAt.toString(),
                    member: user,
                    currency,
                    familyId: payment.familyId,
                    createdAt: payment.createdAt.toString(),
                    updatedAt: payment.updatedAt.toString(),
                    paymentPercentages: payment.paymentPercentages
                  } as FamilyPaymentView)
              )
            )
          ),
          toArray()
        );
      }),
      map(payments =>
        payments.sort((a, b) => compare(a.paidAt, b.paidAt, false))
      )
    );
  }

  getPaymentTransactions(
    familyId: string,
    paymentsList: FamilyPaymentView[]
  ): Observable<OverpaidDebtPayment[]> {
    return this.membersService.getMembers(familyId).pipe(
      map((members: FamilyMember[]) => {
        if (!paymentsList.length) {
          return [];
        }
        const calc = paymentsList
          .map(payment => this.calcForDifferentPercentages(payment, members))
          .reduce((acc, val) => acc.concat(val), []);
        return calc;
      }),
      map(payments => {
        return payments.sort((a, b) => {
          const compareByCreatedAt = compare(a.paidAt, b.paidAt, true);
          if (!compareByCreatedAt) {
            return compare(a.debt, b.debt, true);
          }
          return compareByCreatedAt;
        });
      })
    );
  }

  getOverpayAndDebtsList(
    familyId: string,
    paymentsList: FamilyPaymentView[]
  ): Observable<PaymentExpense[]> {
    return this.getPaymentTransactions(familyId, paymentsList).pipe(
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
                member: payment.user,
                amount:
                  res[payment.user._id].amount +
                  payment.overpaid -
                  payment.debt,
                currency: payment.currency,
                debt: res[payment.user._id].debt + payment.debt,
                overpaid: res[payment.user._id].overpaid + payment.overpaid
              }
            };
          }
          return {
            ...res,
            [payment.user._id]: {
              ...res[payment.user._id],
              member: payment.user,
              currency: payment.currency,
              amount: payment.overpaid - payment.debt
            }
          };
        }, {});
      }),
      map(debts => {
        return Object.keys(debts)
          .map((userId: string) => ({
            member: debts[userId].member,
            currency: debts[userId].currency,
            amount: debts[userId].amount
          }))
          .reduce((acc, val) => acc.concat(val), []);
      }),
      map((payments: PaymentExpense[]) => {
        return payments.sort((a, b) => compare(a.amount, b.amount, false));
      })
    );
  }

  getTotalExpensesPerMember(
    paymentsList: FamilyPaymentView[]
  ): PaymentExpense[] {
    const calculatedExpenses: {
      [memberId: string]: PaymentExpense;
    } = (paymentsList || []).reduce(
      (
        res: {
          [memberId: string]: PaymentExpense;
        },
        payment: FamilyPaymentView
      ) => {
        if (!res[payment.member._id]) {
          return {
            ...res,
            [payment.member._id]: {
              member: payment.member,
              amount: payment.amount,
              currency: payment.currency
            }
          };
        }
        return {
          ...res,
          [payment.member._id]: {
            member: payment.member,
            amount: res[payment.member._id].amount + payment.amount,
            currency: payment.currency
          }
        };
      },
      {}
    );

    return Object.keys(calculatedExpenses)
      .map((memberId: string) => ({
        amount: calculatedExpenses[memberId].amount,
        currency: calculatedExpenses[memberId].currency,
        member: calculatedExpenses[memberId].member
      }))
      .reduce((acc, val) => acc.concat(val), []);
  }

  getMembersMonthlyExpenses(
    paymentsList: FamilyPaymentView[],
    year: number
  ): {
    data: [
      string,
      ...{
        v: number;
        f: string;
      }[]
    ][];
    columns: string[];
  } {
    const calculatedExpenses: {
      [monthIndex: number]: {
        [id: string]: {
          member: FamilyMember;
          amount: number;
          currency: string;
        };
      };
    } = (paymentsList || [])
      .filter(payment => new Date(payment.paidAt).getFullYear() === year)
      .reduce((res, payment: FamilyPaymentView) => {
        const monthIndex: number = new Date(payment.paidAt).getMonth();
        if (!res[monthIndex]) {
          return {
            ...res,
            [monthIndex]: {
              [payment.member._id]: {
                member: payment.member,
                amount: payment.amount,
                currency: payment.currency
              }
            }
          };
        }
        if (!res[monthIndex][payment.member._id]) {
          return {
            ...res,
            [monthIndex]: {
              ...res[monthIndex],
              [payment.member._id]: {
                member: payment.member,
                amount: payment.amount,
                currency: payment.currency
              }
            }
          };
        }

        return {
          ...res,
          [monthIndex]: {
            ...res[monthIndex],
            [payment.member._id]: {
              ...res[monthIndex][payment.member._id],
              amount:
                res[monthIndex][payment.member._id].amount + payment.amount
            }
          }
        };
      }, {});

    return this.convertToColumnChart(calculatedExpenses);
  }

  getUserMonthlyExpenses(
    paymentsList: UserPaymentView[],
    year: number
  ): {
    data: [string, ...(number | string)[]][];
    columns: (string | { type: string; role: string })[];
  } {
    const calculatedExpenses: {
      [monthIndex: number]: {
        amount: number;
        currency: string;
      };
    } = (paymentsList || [])
      .filter(payment => new Date(payment.paidAt).getFullYear() === year)
      .reduce((res, payment: UserPaymentView) => {
        const monthIndex: number = new Date(payment.paidAt).getMonth();
        if (!res[monthIndex]) {
          return {
            ...res,
            [monthIndex]: {
              amount: payment.amount,
              currency: payment.currency
            }
          };
        }

        return {
          ...res,
          [monthIndex]: {
            ...res[monthIndex],
            amount: res[monthIndex].amount + payment.amount
          }
        };
      }, {});

    return this.convertForChartUserMonthlyExpenses(calculatedExpenses);
  }

  aggregateExpensesPerSubject(
    paymentsList: FamilyPaymentView[],
    year: number,
    month?: number
  ): [string, { v: number; f: string; subject: PaymentSubject }][] {
    const result = (paymentsList || [])
      .filter(payment => new Date(payment.paidAt).getFullYear() === year)
      .filter(
        payment =>
          month === undefined || new Date(payment.paidAt).getMonth() === month
      )
      .reduce(
        (
          res: {
            [subjectName: string]: {
              v: number;
              f: string;
              subject: PaymentSubject;
            };
          },
          payment: FamilyPaymentView
        ) => {
          const value =
            (res[payment.subject.name] || { v: 0 }).v + payment.amount;
          return {
            ...res,
            [payment.subject.name]: {
              subject: payment.subject,
              v: value,
              f: this.currencyPipe.transform(value, payment.currency)
            }
          };
        },
        {}
      );
    return Object.entries(result);
  }

  private calcForDifferentPercentages(
    payment: FamilyPaymentView,
    members: FamilyMember[]
  ): OverpaidDebtPayment[] {
    return payment.paymentPercentages
      .map(percentage => {
        const percentageUser = members.filter(
          member => member._id === percentage.userId
        )[0];
        const debt =
          payment.member._id === percentageUser._id
            ? 0
            : (payment.amount * percentage.paymentPercentage) / 100;
        const overpaid =
          payment.member._id === percentageUser._id
            ? (payment.amount * (100 - percentage.paymentPercentage)) / 100
            : 0;
        return {
          user: percentageUser,
          ...(payment.member._id !== percentageUser._id && {
            toUser: payment.member
          }),
          debt,
          overpaid,
          currency: payment.currency,
          paidAt: payment.paidAt.toString(),
          createdAt: payment.createdAt.toString(),
          updatedAt: payment.updatedAt.toString()
        } as OverpaidDebtPayment;
      })
      .reduce((acc, val) => acc.concat(val), []);
  }

  private convertToColumnChart(aggregation: {
    [monthIndex: number]: {
      [id: string]: { member: FamilyMember; amount: number; currency: string };
    };
  }): { data: [string, ...{ v: number; f: string }[]][]; columns: string[] } {
    const members = [];
    const membersNames: FamilyMember[] = [];
    const paymentsCurrency: string = Object.entries(aggregation).length
      ? Object.entries(Object.entries(aggregation)[0][1])[0][1].currency
      : '';
    const result = Object.keys(aggregation).reduce(
      (res: [string, ...{ v: number; f: string }[]][], monthIndex: string) => {
        const date = new Date();
        date.setMonth(parseInt(monthIndex, 10));
        const month = date.toLocaleString('default', { month: 'long' });
        const memberExpenses: {
          [memberId: string]: {
            member: FamilyMember;
            amount: number;
            currency: string;
          };
        } = aggregation[monthIndex];
        const payments = {};
        Object.keys(memberExpenses).forEach((memberId: string) => {
          if (members.indexOf(memberId) === -1) {
            members.push(memberId);
            membersNames.push(memberExpenses[memberId].member);
          }
          const amount = memberExpenses[memberId].amount;
          payments[members.indexOf(memberId)] = {
            v: amount,
            f: this.currencyPipe.transform(
              amount,
              memberExpenses[memberId].currency
            )
          };
        });

        const membersAmounts: number[] = Object.keys(payments).reduce(
          (amountsInArray: number[], memberIndex) => {
            const extraZeros: number[] = [];
            while (
              amountsInArray.length + extraZeros.length <
              parseInt(memberIndex, 10)
            ) {
              extraZeros.push(0);
            }
            return [...amountsInArray, ...extraZeros, payments[memberIndex]];
          },
          []
        );
        return [...res, [month, ...membersAmounts]];
      },
      []
    ) as [string, ...{ v: number; f: string }[]][];
    result.forEach(monthData => {
      while (monthData.length < members.length + 1) {
        monthData.push({
          v: 0,
          f: this.currencyPipe.transform(0, paymentsCurrency)
        });
      }
    });
    const columns = [
      'month',
      ...membersNames.map(
        member => `${member.firstName} ${member.lastName.slice(0, 1)}.`
      ),
      'Total'
    ];

    const agg = result.map(monthlyPayments => {
      const total = monthlyPayments.slice(1).reduce((res, expenses) => {
        return res + (expenses as { v: number; f: string }).v;
      }, 0);
      return [
        ...monthlyPayments,
        { v: total, f: this.currencyPipe.transform(total, paymentsCurrency) }
      ];
    }) as [string, { v: number; f: string }][];
    return {
      data: agg,
      columns
    };
  }

  private convertForChartUserMonthlyExpenses(aggregation: {
    [monthIndex: number]: { amount: number; currency: string };
  }): {
    data: [string, ...(number | string)[]][];
    columns: (string | { type: string; role: string; p: { html: boolean } })[];
  } {
    const monthNames: { name: string; short: string }[] = [
      { name: 'January', short: 'Jan.' },
      { name: 'February', short: 'Feb.' },
      { name: 'March', short: 'Mar.' },
      { name: 'April', short: 'Apr.' },
      { name: 'May', short: 'May' },
      { name: 'June', short: 'Jun.' },
      { name: 'July', short: 'Jul.' },
      { name: 'August', short: 'Aug.' },
      { name: 'September', short: 'Sep.' },
      { name: 'October', short: 'Oct.' },
      { name: 'November', short: 'Nov.' },
      { name: 'December', short: 'Dec.' }
    ];
    const paymentsCurrency: string = Object.entries(aggregation).length
      ? Object.entries(aggregation)[0][1].currency
      : '';

    const monthsAmounts: number[] = Object.keys(aggregation).reduce(
      (amountsInArray: number[], monthsIndex) => {
        const extraZeros: number[] = [];
        while (
          amountsInArray.length + extraZeros.length <
          parseInt(monthsIndex, 10)
        ) {
          extraZeros.push(0);
        }
        return [
          ...amountsInArray,
          ...extraZeros,
          aggregation[monthsIndex].amount
        ];
      },
      []
    );
    while (monthsAmounts.length < monthNames.length) {
      monthsAmounts.push(0);
    }

    const data: [string, ...(number | string)[]][] = Object.entries(
      monthsAmounts
    ).map((monthAmount: [string, number]) => {
      return [
        monthNames[monthAmount[0]].short,
        monthAmount[1],
        `<div style="padding:5px"><b>${
          monthNames[monthAmount[0]].name
        }</b><br />Total: <b>${this.currencyPipe.transform(
          monthAmount[1],
          paymentsCurrency
        )}</b></div>`
      ];
    });
    const columns = [
      'Month',
      'Total',
      { type: 'string', role: 'tooltip', p: { html: true } }
    ];
    return {
      data,
      columns
    };
  }
}
