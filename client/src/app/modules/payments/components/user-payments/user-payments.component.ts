import { Component, OnInit } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { PaymentsService } from '@core-client/services/payments/payments.service';
import { compare } from '@shared-client/functions';
// tslint:disable-next-line: max-line-length
import { PaymentView } from '@shared/types';
import { UserPaymentView } from '@src/app/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'payment-user-payments',
  templateUrl: './user-payments.component.html',
  styleUrls: ['./user-payments.component.scss']
})
export class UserPaymentsComponent implements OnInit {
  payments: Observable<UserPaymentView[]>;

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
                paidAt: payment.paidAt.toString(),
                createdAt: payment.createdAt.toString(),
                familyName: payment.family ? payment.family.name : undefined,
                familyId: payment.family ? payment.family._id : undefined,
                updatedAt: payment.updatedAt.toString(),
                subjectName: payment.subject.name,
                subjectIcon: payment.subject.icon,
                currency: payment.currency
              };
            })
            .sort((a, b) => compare(a.createdAt, b.createdAt, true))
        )
      );
  }
}
