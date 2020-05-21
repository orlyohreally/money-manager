import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UserPaymentView } from '@src/app/types';

@Component({
  selector: 'payment-user-payment-list-wrapper',
  templateUrl: './user-payments-list-wrapper.component.html',
  styleUrls: ['./user-payments-list-wrapper.component.scss']
})
export class UserPaymentsListWrapperComponent implements OnInit {
  @Input() payments: UserPaymentView[];

  displayedColumns: Observable<string[]>;

  private defaultDisplayedColumns: string[] = [
    'subject',
    'amount',
    'family',
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
