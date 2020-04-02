import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { MembersService } from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectsService } from '@core-client/services/payment-subject/payment-subjects.service';
// tslint:disable-next-line: max-line-length
import { PaymentsCalculationsService } from '@core-client/services/payments/payments-calculations.service';
import { PaymentFilters } from '@shared-client/types/payment-filters';
import { FamilyMember, PaymentSubject } from '@shared/types';
import { FamilyPaymentView } from '@src/app/types';

@Component({
  selector: 'payment-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  payments: Observable<FamilyPaymentView[]>;
  filteredPayments: Observable<FamilyPaymentView[]>;
  subjects: Observable<PaymentSubject[]>;
  currency: Observable<string>;
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
  familyMembers: Observable<FamilyMember[]>;
  filters: PaymentFilters;
  filteringPayments: boolean;

  constructor(
    private route: ActivatedRoute,
    private paymentsCalculationsService: PaymentsCalculationsService,
    private familiesService: FamiliesService,
    private membersService: MembersService,
    private paymentSubjectsService: PaymentSubjectsService
  ) {}

  ngOnInit() {
    this.familyId = this.route.parent.paramMap.pipe(
      map((params: ParamMap) => {
        const familyId = params.get('familyId');
        this.currency = this.familiesService.getFamilyCurrency(familyId);
        this.filters = {
          member: null,
          paymentSubject: null,
          startDate: null,
          endDate: null
        };
        this.getPayments(familyId);
        this.familyMembers = this.membersService.getMembers(familyId);
        this.subjects = this.paymentSubjectsService.getSubjects(familyId);
        return familyId;
      })
    );
  }

  onFiltersUpdated(filterUpdate: PaymentFilters) {
    this.filters = filterUpdate;
    this.filterPayments();
  }

  filterPayments() {
    this.filteringPayments = true;
    this.filteredPayments = this.payments.pipe(
      map(payments =>
        [...(payments || [])].filter(
          payment =>
            !this.filters.member || payment.member._id === this.filters.member
        )
      ),
      map(payments =>
        payments.filter(
          payment =>
            !this.filters.paymentSubject ||
            payment.subject._id === this.filters.paymentSubject
        )
      ),
      map(payments =>
        payments.filter(
          payment =>
            !this.filters.startDate ||
            new Date(payment.paidAt) >= new Date(this.filters.startDate)
        )
      ),
      map(payments =>
        payments.filter(
          payment =>
            !this.filters.endDate ||
            new Date(payment.paidAt) < new Date(this.filters.endDate)
        )
      )
    );

    this.filteringPayments = false;
  }

  private getPayments(familyId?: string) {
    // tslint:disable-next-line: max-line-length
    this.payments = this.paymentsCalculationsService.getAggregatedPayments(
      familyId
    );
    this.filterPayments();
  }
}
