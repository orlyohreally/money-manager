import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Payment } from '@shared/types/payment';
import { getDischargedTotal } from '@shared/utils/payments';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  payments: Payment[];
  constructor() {
    this.payments = [
      {
        _id: '1',
        amount: 1100,
        createdAt: new Date(),
        familyId: '1',
        memberId: '1',
        paidAt: new Date(),
        receipt: '/assets/receipts/receipt.jpg',
        subjectId: '1',
        updatedAt: new Date()
      },
      {
        _id: '2',
        amount: 400,
        createdAt: new Date(),
        familyId: '1',
        memberId: '2',
        paidAt: new Date(),
        subjectId: '2',
        updatedAt: new Date()
      },
      {
        _id: '3',
        amount: 5,
        createdAt: new Date(),
        familyId: '1',
        memberId: '2',
        paidAt: new Date(),
        subjectId: '1',
        updatedAt: new Date()
      }
    ];
  }

  public getPayments(): Observable<Payment[]> {
    return of(this.payments);
  }
  public createPayment(payment: Payment) {
    this.payments.push(payment);
  }
  public updatePayment(payment: any) {
    console.log('updatePayment');
    delete payment.newSubject;
    payment.subjectId = '1';
    return of(payment);
  }

  public removePayment(payment: Payment): any {
    return of({
      status: 'success'
    });
  }
}
