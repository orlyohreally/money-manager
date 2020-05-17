import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  MatPaginator,
  MatSort,
  MatTableDataSource,
  Sort
} from '@angular/material';
import { compare } from '@shared-client/functions';
import { UserPaymentView } from '@src/app/types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'payment-user-payment-list',
  templateUrl: './user-payment-list.component.html',
  styleUrls: ['./user-payment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPaymentsListComponent implements OnInit, OnChanges {
  @Input() payments: UserPaymentView[];
  displayedColumns: Observable<string[]>;
  dataSource: MatTableDataSource<UserPaymentView>;

  private paginator: MatPaginator;
  private sort: MatSort;
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
    this.dataSource = new MatTableDataSource<UserPaymentView>(this.payments);
    this.setDataSourceAttributes();
    if (this.sort) {
      this.sortData(this.sort);
    }
  }

  sortData(sort: Sort) {
    const data = [...this.dataSource.data];
    if (!sort.active || sort.direction === '') {
      this.dataSource.data = data;
      return;
    }

    this.dataSource.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'amount': {
          const compareByCurrency = compare(a.currency, b.currency, true);
          return compareByCurrency === 0
            ? compare(a.amount, b.amount, isAsc)
            : compareByCurrency;
        }
        case 'subject':
          return compare(a.subject.name, b.subject.name, isAsc);
        case 'family':
          return compare(a.family.name, b.family.name, isAsc);
        case 'paidAt':
          return compare(a.paidAt, b.paidAt, isAsc);
      }
    });
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
