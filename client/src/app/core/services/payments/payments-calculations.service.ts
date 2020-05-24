import { Injectable } from '@angular/core';
import { combineLatest, from, Observable, of } from 'rxjs';

import { compare } from '@shared-client/functions';
import { OverpaidDebtPayment, PaymentExpense } from '@shared-client/types';
import { PaymentView } from '@shared-client/types/payment-view';
import { FamilyMember, Payment, User } from '@shared/types';
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
    private authenticationService: AuthenticationService
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
    return combineLatest(
      this.paymentsService.getPayments(familyId),
      this.familiesService.getFamilyCurrency(familyId)
    ).pipe(
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
}
