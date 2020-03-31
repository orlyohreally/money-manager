import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectsService } from '@core-client/services/payment-subject/payment-subjects.service';
// tslint:disable-next-line: max-line-length
import { PaymentsCalculationsService } from '@core-client/services/payments/payments-calculations.service';
import { FamilyMember, PaymentSubject } from '@shared/types';
import { MembersService } from '@src/app/core/services/members/members.service';
import { PaymentFilters } from '@src/app/modules/shared/types/payment-filters';
import { FamilyPaymentView } from '@src/app/types';

@Component({
  selector: 'app-payments',
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

  private getPayments(familyId?: string) {
    // tslint:disable-next-line: max-line-length
    this.payments = this.paymentsCalculationsService.getAggregatedPayments(
      familyId
    );
    this.filterPayments();
  }

  onFiltersUpdated(filterUpdate: PaymentFilters) {
    this.filters = filterUpdate;
    this.filterPayments();
  }

  filterPayments() {
    this.filteredPayments = this.payments.pipe(
      map(payments => {
        return [...payments].filter(payment => {
          return (
            !this.filters.member || payment.member._id === this.filters.member
          );
        });
      }),
      map(payments => {
        return payments.filter(payment => {
          return (
            !this.filters.paymentSubject ||
            payment.subject._id === this.filters.paymentSubject
          );
        });
      }),
      map(payments => {
        return payments.filter(payment => {
          return (
            !this.filters.startDate ||
            new Date(payment.paidAt).getTime() >=
              this.filters.startDate.getTime()
          );
        });
      }),
      map(payments => {
        return payments.filter(payment => {
          return (
            !this.filters.endDate ||
            new Date(payment.paidAt).getTime() < this.filters.endDate.getTime()
          );
        });
      })
    );
  }
}
