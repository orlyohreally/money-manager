import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Payment, PaymentView } from '@shared/types';
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import {
  concatMap,
  map,
  mergeMap,
  switchMap,
  take,
  toArray
} from 'rxjs/operators';
import { DataService } from '../data.service';
import { FamiliesService } from '../families/families.service';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { MembersService } from '../members/members.service';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectsService } from '../payment-subject/payment-subjects.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService extends DataService {
  private readonly paymentsApiUrl = 'payments';
  private paymentsList = new BehaviorSubject<{
    [familyId: string]: Payment[];
  }>({});

  constructor(
    http: HttpClient,
    globalVariablesService: GlobalVariablesService,
    private paymentSubjectsService: PaymentSubjectsService,
    private familiesService: FamiliesService,
    private membersService: MembersService
  ) {
    super(http, globalVariablesService);
  }

  getPayments(familyId?: string): Observable<Payment[]> {
    const familyIdPrefix = familyId ? familyId : 'user';
    return this.paymentsList.asObservable().pipe(
      switchMap(payments => {
        if (!payments[familyIdPrefix]) {
          return this.loadPayments(familyId).pipe(
            map(() => this.paymentsList.getValue()[familyIdPrefix])
          );
        }
        return of(payments[familyIdPrefix]);
      })
    );
  }

  getAggregatedUserPayments(familyId?: string): Observable<PaymentView[]> {
    return this.getPayments(familyId).pipe(
      mergeMap((payments: Payment[]) => {
        return from(payments).pipe(
          concatMap(payment =>
            combineLatest([
              this.paymentSubjectsService.getSubjectById(
                payment.subjectId,
                familyId
              ),
              payment.familyId
                ? this.familiesService.getFamilyById(payment.familyId)
                : of(undefined)
            ]).pipe(
              map(([subject, family]) => ({
                _id: payment._id,
                amount: payment.amount,
                currency: payment.currency,
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
      })
    );
  }

  getAggregatedPayments(familyId?: string): Observable<PaymentView[]> {
    return this.getPayments(familyId).pipe(
      mergeMap((payments: Payment[]) => {
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
                currency: payment.currency,
                receipt: payment.receipt,
                subject,
                paidAt: payment.paidAt,
                user,
                familyId: payment.familyId,
                createdAt: payment.createdAt,
                updatedAt: payment.updatedAt,
                paymentPercentages: payment.paymentPercentages
              }))
            )
          ),
          toArray()
        );
      })
    );
  }

  createPayment(
    familyId: string,
    payment: Partial<Payment>
  ): Observable<Payment> {
    return this.post(`${this.paymentsApiUrl}/${familyId ? familyId : ''}`, {
      payment
    }).pipe(
      switchMap((createdPayment: Payment) => {
        return this.paymentsList.asObservable().pipe(
          take(1),
          switchMap((payments: { [familyId: string]: Payment<string>[] }) => {
            const familyPrefix = familyId ? familyId : 'user';
            const familyPayments: Payment[] = payments[familyPrefix];
            this.paymentsList.next({
              ...payments,
              [familyPrefix]: [...familyPayments, createdPayment]
            });
            return of(createdPayment);
          })
        );
      })
    );
  }

  updatePayment() {
    // this.payments[payment._id] = payment;
    return of({
      status: 'success',
      msg: null
    });
  }

  removePayment() {
    // delete this.payments[payment._id];
    return of({
      status: 'success',
      msg: null
    });
  }

  private loadPayments(familyId?: string): Observable<Payment[]> {
    const paymentsUrl = familyId
      ? `${this.paymentsApiUrl}/${familyId}`
      : this.paymentsApiUrl;
    return this.get(paymentsUrl).pipe(
      map((payments: Payment[]) => {
        this.paymentsList.next({
          ...this.paymentsList.getValue(),
          [familyId ? familyId : 'user']: payments
        });
        return payments;
      })
    );
  }
}
