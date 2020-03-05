import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { PaymentsService } from '@core-client/services/payments/payments.service';
// tslint:disable-next-line: max-line-length
import { UserManagerService } from '@core-client/services/user-manager/user-manager.service';
import { compare } from '@shared-client/functions';
import { PaymentView } from '@shared/types';
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
    private paymentsService: PaymentsService,
    private userManagerService: UserManagerService
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
    this.payments = this.paymentsService.getAggregatedPayments(familyId).pipe(
      map((payments: PaymentView[]) =>
        payments
          .map((payment: PaymentView) => ({
            amount: payment.amount,
            paidAt: payment.paidAt.toString(),
            createdAt: payment.createdAt.toString(),
            memberFullName: this.userManagerService.getFullName(payment.user),
            memberEmail: payment.user.email,
            updatedAt: payment.updatedAt.toString(),
            subjectName: payment.subject ? payment.subject.name : '',
            subjectIcon: payment.subject ? payment.subject.icon : '',
            currency: payment.currency,
            paymentPercentages: payment.paymentPercentages
          }))
          .sort((a, b) => compare(a.createdAt, b.createdAt, true))
      )
    );
  }
}
