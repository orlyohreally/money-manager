import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Payment, PaymentView } from '@shared/types';
import { BehaviorSubject, combineLatest, from, Observable, of } from 'rxjs';
import { map, mergeMap, switchMap, take, toArray } from 'rxjs/operators';
import { DataService } from '../data.service';
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
    private membersService: MembersService
  ) {
    super(http, globalVariablesService);
  }

  loadPayments(familyId: string): Observable<Payment[]> {
    return this.get(`${this.paymentsApiUrl}/${familyId}`).pipe(
      map((payments: Payment[]) => {
        this.paymentsList.next({
          ...this.paymentsList.getValue(),
          [familyId]: payments
        });
        return payments;
      })
    );
  }

  getPayments(familyId: string): Observable<Payment[]> {
    return this.paymentsList.asObservable().pipe(
      switchMap(payments => {
        if (!payments[familyId]) {
          return this.loadPayments(familyId).pipe(
            map(() => this.paymentsList.getValue()[familyId])
          );
        }
        return of(payments[familyId]);
      })
    );
  }

  getAggregatedPayments(familyId: string): Observable<PaymentView[]> {
    return this.getPayments(familyId).pipe(
      mergeMap((payments: Payment[]) => {
        return from(payments).pipe(
          mergeMap(payment =>
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
                updatedAt: payment.updatedAt
              }))
            )
          ),
          toArray()
        );
      })
    );
  }

  public createPayment(
    familyId: string,
    payment: Partial<Payment>
  ): Observable<Payment> {
    return this.post(`${this.paymentsApiUrl}/${familyId}`, { payment }).pipe(
      switchMap((createdPayment: Payment) => {
        return this.paymentsList.asObservable().pipe(
          take(1),
          switchMap((payments: { [familyId: string]: Payment<string>[] }) => {
            const familyPayments: Payment[] = payments[familyId];
            this.paymentsList.next({
              ...payments,
              [familyId]: [...familyPayments, createdPayment]
            });
            return of(createdPayment);
          })
        );
      })
    );
  }

  public updatePayment() {
    // this.payments[payment._id] = payment;
    return of({
      status: 'success',
      msg: null
    });
  }

  public removePayment() {
    // delete this.payments[payment._id];
    return of({
      status: 'success',
      msg: null
    });
  }
}
