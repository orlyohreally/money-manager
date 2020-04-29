import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  Sort
} from '@angular/material';
import { compare } from '@shared-client/functions';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { FamilyPaymentView } from '@src/app/types';

@Component({
  selector: 'payment-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit, OnChanges {
  @Input() payments: FamilyPaymentView[];
  @Input() currency: string;
  @Input() familyId: string;

  displayedColumns: Observable<string[]>;
  dataSource: MatTableDataSource<FamilyPaymentView>;

  private paginator: MatPaginator;
  private sort: MatSort;
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
        switchMap((change: BreakpointState) => {
          return of(
            this.defaultDisplayedColumns.slice(
              0,
              change.matches ? -1 : this.defaultDisplayedColumns.length
            )
          );
        })
      );
  }

  @ViewChild(MatSort) set matSort(sort: MatSort) {
    this.sort = sort;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.paginator = paginator;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }

  ngOnChanges() {
    this.dataSource = new MatTableDataSource<FamilyPaymentView>(
      this.payments || []
    );
    this.setDataSourceAttributes();
    if (this.sort) {
      this.sortData(this.sort);
    }
  }

  sortData(sort: Sort) {
    if (!this.dataSource.data) {
      return;
    }
    const data = [...this.dataSource.data];
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'amount':
          return compare(a.amount, b.amount, isAsc);
        case 'subject':
          return compare(a.subject.name, b.subject.name, isAsc);
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
        case 'paidAt':
          return compare(a.paidAt, b.paidAt, isAsc);
      }
    });
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
