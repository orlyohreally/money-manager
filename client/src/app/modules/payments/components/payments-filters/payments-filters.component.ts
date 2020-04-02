import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import {
  PaymentFilter,
  PaymentFilters
} from '@shared-client/types/payment-filters';
import { FamilyMember, PaymentSubject } from '@shared/types';

@Component({
  selector: 'payment-payments-filters',
  templateUrl: './payments-filters.component.html',
  styleUrls: ['./payments-filters.component.scss']
})
export class PaymentsFiltersComponent implements OnInit {
  @Input() members: FamilyMember[];
  @Input() subjects: PaymentSubject[];

  @Output() filtersUpdated = new EventEmitter<PaymentFilters>();

  selectedFiltersValues: PaymentFilters;
  defaultStartDate: Date;
  defaultEndDate: Date;
  selectedStartDate: Date;
  filterDebounceTime = 300;

  constructor() {
    this.selectedFiltersValues = {
      member: null,
      paymentSubject: null,
      startDate: null,
      endDate: null
    };
    this.defaultStartDate = new Date();
    this.defaultStartDate.setDate(this.defaultStartDate.getDate() - 7);
    this.defaultEndDate = new Date();
    this.defaultEndDate.setDate(this.defaultEndDate.getDate() + 1);
  }

  ngOnInit() {}

  onFilterUpdated(filterName: PaymentFilter, value: string) {
    this.selectedFiltersValues[filterName] = value;
    this.filtersUpdated.emit(this.selectedFiltersValues);
  }

  onStartDateUpdated(startDate: string) {
    this.selectedStartDate = new Date(startDate);
    this.onFilterUpdated('startDate', startDate);
  }
}
