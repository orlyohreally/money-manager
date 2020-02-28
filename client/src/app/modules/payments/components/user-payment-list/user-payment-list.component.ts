import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
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

export interface UserPaymentView {
  amount: number;
  paidAt: string;
  createdAt: string;
  familyName: string;
  familyId: string;
  updatedAt: string;
  subjectName: string;
  subjectIcon: string;
  currency: string;
}

@Component({
  selector: 'payment-user-payment-list',
  templateUrl: './user-payment-list.component.html',
  styleUrls: ['./user-payment-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPaymentsListComponent implements OnInit, OnChanges {
  @HostBinding('style.width') width = '100%';

  @Input() payments: UserPaymentView[];
  dataSource: MatTableDataSource<UserPaymentView>;
  displayedColumns: string[] = [
    'subject',
    'amount',
    'familyName',
    'paidAt',
    'createdAt',
    'updatedAt'
  ];

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
    const data = this.dataSource.data.slice();
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
          return compare(a.subjectName, b.subjectName, isAsc);
        case 'familyName':
          return compare(a.familyName, b.familyName, isAsc);
        case 'paidAt':
          return compare(a.paidAt, b.paidAt, isAsc);
        case 'createdAt':
          return compare(a.createdAt, b.createdAt, isAsc);
        case 'updatedAt':
          return compare(a.updatedAt, b.updatedAt, isAsc);
        default:
          return 0;
      }
    });
    this.dataSource.paginator.firstPage();
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}