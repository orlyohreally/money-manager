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
import { compare } from '@src/app/modules/shared/functions';
import { OverpaidDebtPayment } from '@src/app/modules/shared/types';
// tslint:disable-next-line: max-line-length

@Component({
  selector: 'payment-member-overpay-and-debt-list',
  templateUrl: './member-payment-overpay-and-debt-list.component.html',
  styleUrls: ['./member-payment-overpay-and-debt-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MemberPaymentOverpayAndDebtListComponent
  implements OnInit, OnChanges {
  @Input() calculatedPayments: OverpaidDebtPayment[];

  displayedColumns = [
    'user',
    'debt',
    'overpaid',
    'toUser',
    'createdAt',
    'updatedAt'
  ];

  constructor() {}
  dataSource: MatTableDataSource<OverpaidDebtPayment>;

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

  ngOnChanges(): void {
    if (!this.calculatedPayments) {
      return;
    }

    this.dataSource = new MatTableDataSource<OverpaidDebtPayment>(
      this.calculatedPayments
    );
    this.setDataSourceAttributes();
    if (this.sort) {
      this.sortData(this.sort);
    }
  }

  setDataSourceAttributes() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
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
        case 'amount':
          return compare(a.overpaid, b.overpaid, isAsc);
        case 'user': {
          const comparisonByLastName = compare(
            a.user.lastName,
            b.user.lastName,
            isAsc
          );
          return !comparisonByLastName
            ? compare(a.user.firstName, b.user.firstName, isAsc)
            : comparisonByLastName;
        }
        case 'toUser': {
          const comparisonByLastName = compare(
            a.toUser ? a.toUser.lastName : '',
            b.toUser ? b.toUser.lastName : '',
            isAsc
          );
          return !comparisonByLastName
            ? compare(
                a.toUser ? a.toUser.firstName : '',
                b.toUser ? b.toUser.firstName : '',
                isAsc
              )
            : comparisonByLastName;
        }
        case 'debt':
          return compare(a.debt, b.debt, isAsc);
        case 'overpaid':
          return compare(a.overpaid, b.overpaid, isAsc);
        case 'createdAt':
          return compare(a.createdAt, b.createdAt, isAsc);
        case 'updatedAt':
          return compare(a.updatedAt, b.updatedAt, isAsc);
        default:
          return 0;
      }
    });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
