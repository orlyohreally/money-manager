import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Payment } from '@shared/types';
import { compare } from '@src/app/modules/shared/functions';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { DataService } from '../data.service';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';

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
    globalVariablesService: GlobalVariablesService
  ) {
    super(http, globalVariablesService);
  }

  getPayments(familyId: string): Observable<Payment[]> {
    const familyIdPrefix = familyId ? familyId : 'user';
    return this.paymentsList.asObservable().pipe(
      switchMap(payments => {
        if (!payments[familyIdPrefix]) {
          return this.loadPayments(familyId).pipe(
            map(() => this.paymentsList.getValue()[familyIdPrefix])
          );
        }
        return of(payments[familyIdPrefix]);
      }),
      map(payments =>
        payments.sort((a, b) => compare(a.paidAt, b.paidAt, true))
      )
    );
  }

  getUserPayments(): Observable<Payment[]> {
    return this.paymentsList.asObservable().pipe(
      switchMap(payments => {
        if (!payments['user']) {
          return this.loadPayments().pipe(
            map(() =>
              Object.values(this.paymentsList.getValue()).reduce(
                (acc, val) => acc.concat(val),
                []
              )
            )
          );
        }
        return of(
          Object.values(payments).reduce((acc, val) => acc.concat(val), [])
        );
      }),
      map(payments =>
        payments.sort((a, b) => compare(a.paidAt, b.paidAt, true))
      )
    );
  }

  createPayment(
    payment: Partial<Payment>,
    familyId?: string
  ): Observable<Payment> {
    return this.post(`${this.paymentsApiUrl}/${familyId ? familyId : ''}`, {
      payment
    }).pipe(
      switchMap((createdPayment: Payment) => {
        return this.paymentsList.asObservable().pipe(
          take(1),
          switchMap((payments: { [familyId: string]: Payment<string>[] }) => {
            const familyPrefix = familyId ? familyId : 'user';
            const familyPayments: Payment[] = payments[familyPrefix] || [];
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
    const paymentsUrl = `${this.paymentsApiUrl}/${familyId ? familyId : ''}`;
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
