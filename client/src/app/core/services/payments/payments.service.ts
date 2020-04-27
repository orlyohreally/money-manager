import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { first, map, switchMap } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
import { DataService } from '@core-client/services/data.service';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '@core-client/services/global-variables/global-variables.service';
import { Payment, User } from '@shared/types';
import { compare, updateArrayElement } from '@src/app/modules/shared/functions';

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
    private authenticationService: AuthenticationService
  ) {
    super(http, globalVariablesService);
    authenticationService.getUser().subscribe(user => {
      if (!user) {
        this.paymentsList.next({});
      }
    });
  }

  getPayments(familyId?: string): Observable<Payment[]> {
    const familyIdPrefix = familyId ? familyId : 'user';
    return this.paymentsList.asObservable().pipe(
      switchMap(payments => {
        if (!payments[familyIdPrefix]) {
          return this.loadPayments(familyId).pipe(
            switchMap(() => {
              return this.getPayments(familyId);
            })
          );
        }
        return of(
          payments[familyIdPrefix].sort((a, b) =>
            compare(a.paidAt, b.paidAt, true)
          )
        );
      })
    );
  }

  getUserPayments(): Observable<Payment[]> {
    return this.paymentsList.asObservable().pipe(
      switchMap(payments => {
        if (!payments['user']) {
          return this.loadPayments().pipe(
            map(() =>
              Object.values(this.paymentsList.getValue()['user']).reduce(
                (acc, val) => acc.concat(val),
                []
              )
            )
          );
        }
        return of(payments['user']);
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
        return combineLatest([
          this.authenticationService.getUser(),
          this.paymentsList.asObservable()
        ]).pipe(
          first(),
          switchMap(
            ([user, payments]: [
              User,
              { [familyId: string]: Payment<string>[] }
            ]) => {
              const familyPrefix = familyId ? familyId : 'user';
              const familyPayments: Payment[] = payments[familyPrefix] || [];
              this.paymentsList.next({
                ...payments,
                [familyPrefix]: [...familyPayments, createdPayment],
                ...(!!familyId &&
                  createdPayment.userId === user._id && {
                    user: [...(payments['user'] || []), createdPayment]
                  })
              });
              return of(createdPayment);
            }
          )
        );
      })
    );
  }

  updatePayment(payment: Partial<Payment>, familyId: string): Observable<void> {
    return this.put(
      `${this.paymentsApiUrl}${familyId ? `/${familyId}` : ''}/${payment._id}`,
      {
        payment
      }
    ).pipe(
      switchMap((updatedPayment: Payment) => {
        const alreadyLoadedUserPayments = this.paymentsAlreadyLoaded();
        if (
          !(!!familyId && this.paymentsAlreadyLoaded(familyId)) &&
          !alreadyLoadedUserPayments
        ) {
          return of(undefined);
        }
        return combineLatest([
          this.authenticationService.getUser(),
          this.paymentsList.asObservable()
        ]).pipe(
          first(),
          switchMap(([user, payments]) => {
            const familyPrefix = familyId ? familyId : 'user';
            const familyPayments: Payment[] = payments[familyPrefix] || [];
            this.paymentsList.next({
              ...payments,
              [familyPrefix]: updateArrayElement(
                familyPayments,
                updatedPayment
              ),
              ...(!!familyId &&
                alreadyLoadedUserPayments &&
                updatedPayment.userId === user._id && {
                  user: updateArrayElement(
                    payments['user'] || [],
                    updatedPayment
                  )
                })
            });
            return of(undefined);
          })
        );
      })
    );
  }

  updatePaymentsByExchangeRate(
    familyId: string,
    exchangeRate: number
  ): Observable<void> {
    return this.put(`${this.paymentsApiUrl}/${familyId}/update-exchange-rate`, {
      exchangeRate
    }).pipe(
      switchMap(() => {
        // no need to update payments if they are not loaded yet
        if (!this.paymentsAlreadyLoaded(familyId)) {
          return of(undefined);
        }
        return this.getPayments(familyId).pipe(
          first(),
          map(payments => {
            this.paymentsList.next({
              ...this.paymentsList.getValue(),
              [familyId]: payments.map(payment => ({
                ...payment,
                amount: payment.amount * exchangeRate
              }))
            });
          })
        );
      })
    );
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

  private paymentsAlreadyLoaded(familyId?: string): boolean {
    const familyIdPrefix = familyId ? familyId : 'user';
    return !!this.paymentsList.getValue()[familyIdPrefix];
  }
}
