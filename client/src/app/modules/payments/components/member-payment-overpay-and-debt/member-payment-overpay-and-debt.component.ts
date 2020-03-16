import { Component, Input, OnInit } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { PaymentsCalculationsService } from '@core-client/services/payments/payments-calculations.service';
import { OverpaidDebtPayment, PaymentDebt } from '@shared-client/types';
import { Observable } from 'rxjs';

@Component({
  selector: 'payment-member-overpay-and-debt',
  templateUrl: './member-payment-overpay-and-debt.component.html',
  styleUrls: ['./member-payment-overpay-and-debt.component.scss']
})
export class MemberPaymentOverpayAndDebtComponent implements OnInit {
  @Input() familyId: string;

  paymentTransactions: Observable<OverpaidDebtPayment[]>;
  overpaysAndDebtsList: Observable<PaymentDebt[]>;
  showMoreDetailedList = false;

  constructor(
    private paymentsCalculationsService: PaymentsCalculationsService
  ) {}

  ngOnInit() {
    // tslint:disable-next-line: max-line-length
    this.paymentTransactions = this.paymentsCalculationsService.getPaymentTransactions(
      this.familyId
    );
    // tslint:disable-next-line: max-line-length
    this.overpaysAndDebtsList = this.paymentsCalculationsService.getOverpayAndDebtsList(
      this.familyId
    );
  }

  showMoreLessDetails() {
    this.showMoreDetailedList = !this.showMoreDetailedList;
  }
}
