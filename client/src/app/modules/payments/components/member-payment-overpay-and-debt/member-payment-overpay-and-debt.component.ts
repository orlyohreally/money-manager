import { Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';

// tslint:disable-next-line: max-line-length
import { PaymentsCalculationsService } from '@core-client/services/payments/payments-calculations.service';
import { OverpaidDebtPayment, PaymentExpense } from '@shared-client/types';
import { FamilyPaymentView } from '@src/app/types';

@Component({
  selector: 'payment-member-overpay-and-debt',
  templateUrl: './member-payment-overpay-and-debt.component.html',
  styleUrls: ['./member-payment-overpay-and-debt.component.scss']
})
export class MemberPaymentOverpayAndDebtComponent implements OnChanges {
  @Input() familyId: string;
  @Input() payments: FamilyPaymentView[];

  paymentTransactions: Observable<OverpaidDebtPayment[]>;
  overpaysAndDebtsList: Observable<PaymentExpense[]>;
  showMoreDetailedList = false;

  constructor(
    private paymentsCalculationsService: PaymentsCalculationsService
  ) {}

  ngOnChanges(): void {
    // tslint:disable-next-line: max-line-length
    this.paymentTransactions = this.paymentsCalculationsService.getPaymentTransactions(
      this.familyId,
      this.payments || []
    );
    // tslint:disable-next-line: max-line-length
    this.overpaysAndDebtsList = this.paymentsCalculationsService.getOverpayAndDebtsList(
      this.familyId,
      this.payments || []
    );
  }

  showMoreLessDetails() {
    this.showMoreDetailedList = !this.showMoreDetailedList;
  }
}
