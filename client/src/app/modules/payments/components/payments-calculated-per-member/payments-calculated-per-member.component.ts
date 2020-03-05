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
import { FamilyPaymentView } from '@src/app/types';

@Component({
  selector: 'payment-payments-calculated-per-member',
  templateUrl: './payments-calculated-per-member.component.html',
  styleUrls: ['./payments-calculated-per-member.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.width]': '"100%"'
  }
})
export class PaymentsCalculatedPerMemberComponent implements OnInit, OnChanges {
  @Input() payments: FamilyPaymentView[];

  calculatedPayments: {
    memberFullName: string;
    currency: string;
    amount: number;
  }[];
  displayedColumns: string[] = ['memberFullName', 'amount'];
  dataSource: MatTableDataSource<{
    memberFullName: string;
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
      .map((memberFullName: string) =>
        Object.keys(aggregatedPayments[memberFullName]).map(currency => ({
          amount: aggregatedPayments[memberFullName][currency],
          memberFullName,
          currency
        }))
      )
      .reduce((acc, val) => acc.concat(val), []);

    this.dataSource = new MatTableDataSource<{
      memberFullName: string;
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
        case 'memberFullName':
          return compare(a.memberFullName, b.memberFullName, isAsc);

        default:
          return 0;
      }
    });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private aggregatePayments(): {
    [memberFullName: string]: { [currency: string]: number };
  } {
    return (this.payments || []).reduce(
      (
        res: { [memberFullName: string]: { [currency: string]: number } },
        payment: FamilyPaymentView
      ) => {
        if (!res[payment.memberFullName]) {
          return {
            ...res,
            [payment.memberFullName]: { [payment.currency]: payment.amount }
          };
        }
        if (!res[payment.memberFullName][payment.currency]) {
          return {
            ...res,
            [payment.memberFullName]: {
              ...res[payment.memberFullName],
              [payment.currency]: payment.amount
            }
          };
        }

        return {
          ...res,
          [payment.memberFullName]: {
            ...res[payment.memberFullName],
            [payment.currency]:
              res[payment.memberFullName][payment.currency] + payment.amount
          }
        };
      },
      {}
    );
  }
}
