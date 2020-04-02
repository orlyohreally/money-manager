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

@Component({
  selector: 'payment-user-payment-list',
  templateUrl: './user-payment-list.component.html',
  styleUrls: ['./user-payment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPaymentsListComponent implements OnInit, OnChanges {
  @Input() payments: UserPaymentView[];

  dataSource: MatTableDataSource<UserPaymentView>;
  displayedColumns: string[] = ['subject', 'amount', 'family', 'paidAt'];

  private paginator: MatPaginator;
  private sort: MatSort;

  ngOnInit() {}

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
