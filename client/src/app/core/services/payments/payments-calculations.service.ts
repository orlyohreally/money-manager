import { Injectable } from '@angular/core';
import { FamilyMember, Payment, User } from '@shared/types';
import { compare } from '@src/app/modules/shared/functions';
import {
  OverpaidDebtPayment,
  PaymentDebt
} from '@src/app/modules/shared/types';
import { PaymentView } from '@src/app/modules/shared/types/payment-view';
import { FamilyPaymentView, UserPaymentView } from '@src/app/types';
import { combineLatest, from, Observable, of } from 'rxjs';
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
              map(([subject, family]) => ({
                _id: payment._id,
                amount: payment.amount,
                currency: family ? family.currency : user.currency,
                receipt: payment.receipt,
                subject,
                paidAt: payment.paidAt,
                family,
                createdAt: payment.createdAt,
                updatedAt: payment.updatedAt,
                paymentPercentages: payment.paymentPercentages
              }))
            )
          ),
          toArray()
        );
      }),
      map((payments: (PaymentView & { currency: string })[]) =>
        payments.map((payment: PaymentView & { currency: string }) => ({
          _id: payment._id,
          amount: payment.amount,
          paidAt: payment.paidAt.toString(),
          createdAt: payment.createdAt.toString(),
          family: payment.family,
          receipt: payment.receipt,
          updatedAt: payment.updatedAt.toString(),
          subject: payment.subject,
          currency: payment.currency
        }))
      ),
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
              map(([subject, user]) => ({
                _id: payment._id,
                amount: payment.amount,
                receipt: payment.receipt,
                subject,
                paidAt: payment.paidAt,
                user,
                currency,
                familyId: payment.familyId,
                createdAt: payment.createdAt,
                updatedAt: payment.updatedAt,
                paymentPercentages: payment.paymentPercentages
              }))
            )
          ),
          toArray()
        );
      }),
      map((payments: PaymentView[]) =>
        payments
          .map((payment: PaymentView) => ({
            _id: payment._id,
            amount: payment.amount,
            currency: payment.currency,
            paidAt: payment.paidAt.toString(),
            createdAt: payment.createdAt.toString(),
            receipt: payment.receipt,
            member: payment.user,
            memberEmail: payment.user.email,
            updatedAt: payment.updatedAt.toString(),
            subject: payment.subject,
            paymentPercentages: payment.paymentPercentages
          }))
          .sort((a, b) => compare(a.paidAt, b.paidAt, false))
      )
    );
  }

  getPaymentTransactions(familyId: string): Observable<OverpaidDebtPayment[]> {
    return combineLatest([
      this.membersService.getMembers(familyId),
      this.paymentsService.getPayments(familyId),
      this.familiesService.getFamilyCurrency(familyId)
    ]).pipe(
      map(
        ([members, payments, currency]: [
          FamilyMember[],
          Payment[],
          string
        ]) => {
          if (!payments.length) {
            return [];
          }
          const calc = payments
            .map(payment =>
              this.calcForDifferentPercentages(
                { ...payment, currency },
                members
              )
            )
            .reduce((acc, val) => acc.concat(val), []);
          return calc;
        }
      ),
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

  getOverpayAndDebtsList(familyId: string): Observable<PaymentDebt[]> {
    return this.getPaymentTransactions(familyId).pipe(
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
              user: payment.user,
              currency: payment.currency,
              amount: payment.overpaid - payment.debt
            }
          };
        }, {});
      }),
      map(debts => {
        return Object.keys(debts)
          .map((userId: string) => ({
            user: debts[userId].user,
            currency: debts[userId].currency,
            amount: debts[userId].amount
          }))
          .reduce((acc, val) => acc.concat(val), []);
      }),
      map(payments => {
        return payments.sort((a, b) => compare(a.amount, b.amount, false));
      })
    );
  }

  private calcForDifferentPercentages(
    payment: Payment & { currency: string },
    members: FamilyMember[]
  ): OverpaidDebtPayment[] {
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
          ...(user._id !== percentageUser._id && { toUser: user }),
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
