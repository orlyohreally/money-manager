import { Component, OnInit } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { PaymentsCalculationsService } from '@core-client/services/payments/payments-calculations.service';
import { UserPaymentView } from '@src/app/types';
import { Observable } from 'rxjs';

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

  constructor(
    private paymentsCalculationsService: PaymentsCalculationsService
  ) {}

  ngOnInit() {
    // tslint:disable-next-line: max-line-length
    this.payments = this.paymentsCalculationsService.getAggregatedUserPayments();
  }
}
