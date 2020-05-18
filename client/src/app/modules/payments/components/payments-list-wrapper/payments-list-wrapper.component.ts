import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FamilyPaymentView } from '@src/app/types';

@Component({
  selector: 'payment-payments-list-wrapper',
  templateUrl: './payments-list-wrapper.component.html',
  styleUrls: ['./payments-list-wrapper.component.scss']
})
export class PaymentsListWrapperComponent implements OnInit {
  @Input() payments: FamilyPaymentView[];
  @Input() currency: string;
  @Input() familyId: string;

  displayedColumns: Observable<string[]>;
  private defaultDisplayedColumns: string[] = [
    'subject',
    'amount',
    'member',
    'paidAt',
    'actions'
  ];

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.displayedColumns = this.breakpointObserver
      .observe(['(min-width: 600px'])
      .pipe(
        map((change: BreakpointState) => {
          return this.defaultDisplayedColumns.slice(
            0,
            change.matches ? -1 : this.defaultDisplayedColumns.length
          );
        })
      );
  }
}
