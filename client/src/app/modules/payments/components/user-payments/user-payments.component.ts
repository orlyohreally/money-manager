import { Component, OnInit } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { PaymentsService } from '@core-client/services/payments/payments.service';
// tslint:disable-next-line: max-line-length
import { PaymentView } from '@shared/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'payment-user-payments',
  templateUrl: './user-payments.component.html',
  styleUrls: ['./user-payments.component.scss']
})
export class UserPaymentsComponent implements OnInit {
  payments: Observable<
    {
      amount: number;
      paidAt: Date;
      currency: string;
      familyName: string;
      familyId: string;
      subjectName: string;
      subjectIcon: string;
      createdAt: Date;
      updatedAt: Date;
    }[]
  >;

  displayedColumns: string[] = [
    'subject',
    'amount',
    'memberFullName',
    'paidAt',
    'createdAt',
    'updatedAt',
    'actions'
  ];

  familyId: Observable<string>;

  constructor(private paymentsService: PaymentsService) {}

  ngOnInit() {
    this.getUserPayments();
  }

  private getUserPayments(familyId?: string) {
    this.payments = this.paymentsService
      .getAggregatedUserPayments(familyId)
      .pipe(
        map((payments: PaymentView[]) =>
          payments
            .map((payment: PaymentView) => {
              return {
                amount: payment.amount,
                paidAt: payment.paidAt,
                createdAt: payment.createdAt,
                familyName: payment.family ? payment.family.name : undefined,
                familyId: payment.family ? payment.family._id : undefined,
                updatedAt: payment.updatedAt,
                subjectName: payment.subject.name,
                subjectIcon: payment.subject.icon,
                currency: payment.currency
              };
            })
            .sort((a, b) =>
              a.createdAt > b.createdAt ? -1 : a.createdAt < b.createdAt ? 1 : 0
            )
        )
      );
  }

  // private calculateTotal() {
  //   this.paymentAmounts = aggregateAmountsByMember(
  //     this.payments,
  //     this.payers.map(member => member._id)
  //   );
  //   this.paymentAmounts.sum = getTotalPaymentAmount(
  //     unnormalizeArray(this.payments)
  //   );
  // }
  // public calcDischargedTotal() {
  //   this.paymentAmounts = {};
  //   this.paymentAmounts = getDischargedTotal(
  //     this.payments,
  //     this.payers.map(member => member._id)
  //   );
  //   this.paymentAmounts.sum = getTotalPaymentAmount(
  //     unnormalizeArray(this.payments)
  //   );
  // }

  // public editPayment(payment: Payment) {
  //   this.openForm(payment);
  // }
  // public openForm(payment: Payment): void {
  //   const dialogRef = this.paymentForm.open(PaymentFormComponent, {
  //     width: '300px',
  //     restoreFocus: false,
  //     data: payment
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     this.calculateTotal();
  //   });
  // }
  // public removePayment(payment: Payment) {
  //   this.paymentsService.removePayment(payment).subscribe(
  //     result => {
  //       if (result.status === 'success') {
  //         this.snackBar.open(
  // tslint:disable-next-line: max-line-length
  //           `Payment for ₪ ${payment.amount} by ${payment.memberId} was deleted`,
  //           null,
  //           {
  //             duration: 2000
  //           }
  //         );

  //         this.calculateTotal();
  //       } else {
  //         this.snackBar.open(result.msg, null, {
  //           duration: 2000
  //         });
  //       }
  //     },
  //     error => {
  //       // TODO: add handling
  //       // console.log(error);
  //     }
  //   );
  // }
}
