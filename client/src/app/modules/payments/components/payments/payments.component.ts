import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { PaymentsCalculationsService } from '@core-client/services/payments/payments-calculations.service';
import { FamilyPaymentView } from '@src/app/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  payments: Observable<FamilyPaymentView[]>;

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

  constructor(
    private route: ActivatedRoute,
    private paymentsCalculationsService: PaymentsCalculationsService
  ) {}

  ngOnInit() {
    this.familyId = this.route.parent.paramMap.pipe(
      map((params: ParamMap) => {
        const familyId = params.get('familyId');
        this.getPayments(familyId);
        return familyId;
      })
    );
  }

  private getPayments(familyId?: string) {
    // tslint:disable-next-line: max-line-length
    this.payments = this.paymentsCalculationsService.getAggregatedPayments(
      familyId
    );
  }
}
