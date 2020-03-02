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
import { UserPaymentView } from '@src/app/types';

@Component({
  selector: 'payment-user-payments-calculated-per-member',
  templateUrl: './user-payments-calculated-per-member.component.html',
  styleUrls: ['./user-payments-calculated-per-member.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.width]': '"100%"'
  }
})
export class UserPaymentsCalculatedPerMemberComponent
  implements OnInit, OnChanges {
  @Input() payments: UserPaymentView[];

  calculatedPayments: {
    familyName: string;
    currency: string;
    amount: number;
  }[];
  displayedColumns: string[] = ['familyName', 'amount'];
  dataSource: MatTableDataSource<{
    familyName: string;
    currency: string;
    amount: number;
  }>;

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
    if (!this.payments) {
      return;
    }
    const aggregatedPayments = this.aggregatePayments();
    this.calculatedPayments = Object.keys(aggregatedPayments)
      .map((familyName: string) =>
        Object.keys(aggregatedPayments[familyName]).map(currency => ({
          amount: aggregatedPayments[familyName][currency],
          familyName: familyName === 'user' ? '' : familyName,
          currency
        }))
      )
      .reduce((acc, val) => acc.concat(val), []);

    this.dataSource = new MatTableDataSource<{
      familyName: string;
      currency: string;
      amount: number;
    }>(this.calculatedPayments);
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
        case 'familyName':
          return compare(a.familyName, b.familyName, isAsc);

        default:
          return 0;
      }
    });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private aggregatePayments(): {
    [familyName: string]: { [currency: string]: number };
  } {
    return (this.payments || []).reduce(
      (
        res: { [familyName: string]: { [currency: string]: number } },
        payment: UserPaymentView
      ) => {
        const familyName = payment.familyName ? payment.familyName : 'user';
        if (!res[familyName]) {
          return {
            ...res,
            [familyName]: { [payment.currency]: payment.amount }
          };
        }
        if (!res[familyName][payment.currency]) {
          return {
            ...res,
            [familyName]: {
              ...res[familyName],
              [payment.currency]: payment.amount
            }
          };
        }

        return {
          ...res,
          [familyName]: {
            ...res[familyName],
            [payment.currency]:
              res[familyName][payment.currency] + payment.amount
          }
        };
      },
      {}
    );
  }
}
