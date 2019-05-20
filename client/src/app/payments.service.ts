import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Payment } from "@shared/types";
import { normalize, normalizedArray } from "@shared/utils";
@Injectable({
  providedIn: "root"
})
export class PaymentsService {
  payments: normalizedArray<Payment>;
  constructor() {
    this.payments = normalize([
      {
        _id: "1",
        amount: 1100,
        createdAt: new Date(),
        familyId: "1",
        memberId: "1",
        paidAt: new Date(),
        receipt: "/assets/receipts/receipt.jpg",
        subjectId: "1",
        updatedAt: new Date()
      },
      {
        _id: "2",
        amount: 400,
        createdAt: new Date(),
        familyId: "1",
        memberId: "2",
        paidAt: new Date(),
        subjectId: "2",
        updatedAt: new Date()
      },
      {
        _id: "3",
        amount: 5,
        createdAt: new Date(),
        familyId: "1",
        memberId: "2",
        paidAt: new Date(),
        subjectId: "1",
        updatedAt: new Date()
      }
    ]);
  }

  public getPayments(): Observable<normalizedArray<Payment>> {
    return of(this.payments);
  }
  public createPayment(payment: Payment) {
    this.payments[payment._id] = payment;
  }
  public updatePayment(payment: Payment) {
    console.log("updatePayment", payment);
    this.payments[payment._id] = payment;
    return of({
      status: "success",
      msg: null
    });
  }

  public removePayment(payment: Payment) {
    delete this.payments[payment._id];
    return of({
      status: "success",
      msg: null
    });
  }
}
