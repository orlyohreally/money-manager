import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { compare } from '@src/app/modules/shared/functions';
import { PaymentExpense } from '@src/app/modules/shared/types';

@Component({
  selector: 'payment-member-debt-list',
  templateUrl: './member-payment-debt-list.component.html',
  styleUrls: ['./member-payment-debt-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberPaymentDebtListComponent implements OnInit, OnChanges {
  @Input() debts: PaymentExpense[];

  displayedColumns = ['member', 'amount'];

  constructor() {}
  dataSource: MatTableDataSource<PaymentExpense>;

  private sort: MatSort;

  ngOnInit() {}

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.sort = sort;
    this.setDataSourceAttributes();
  }

  ngOnChanges(): void {
    this.dataSource = new MatTableDataSource<PaymentExpense>(this.debts);
    this.setDataSourceAttributes();
    if (this.sort) {
      this.sortData(this.sort);
    }
  }

  setDataSourceAttributes() {
    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }
  }

  sortData(sort: Sort) {
    const data = [...(this.dataSource.data || [])];
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'amount':
          return compare(a.amount, b.amount, isAsc);
        case 'member': {
          const comparisonByLastName = compare(
            a.member.lastName,
            b.member.lastName,
            isAsc
          );
          return !comparisonByLastName
            ? compare(a.member.firstName, b.member.firstName, isAsc)
            : comparisonByLastName;
        }
        default:
          return 0;
      }
    });
  }
}
