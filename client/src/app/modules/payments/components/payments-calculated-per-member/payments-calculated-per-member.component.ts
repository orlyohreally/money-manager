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
import { UserFullNamePipe } from '@shared-client/pipes/user-full-name.pipe';
import { FamilyMember } from '@shared/types';
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
    member: FamilyMember;
    amount: number;
    currency: string;
  }[];
  displayedColumns: string[] = ['memberFullName', 'amount'];
  dataSource: MatTableDataSource<{
    member: FamilyMember;
    amount: number;
    currency: string;
  }>;

  private paginator: MatPaginator;
  private sort: MatSort;

  constructor(private userFullNamePipe: UserFullNamePipe) {}

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
      .map((memberId: string) => ({
        amount: aggregatedPayments[memberId].amount,
        currency: aggregatedPayments[memberId].currency,
        member: aggregatedPayments[memberId].member
      }))
      .reduce((acc, val) => acc.concat(val), []);

    this.dataSource = new MatTableDataSource<{
      member: FamilyMember;
      amount: number;
      currency: string;
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
          return compare(
            this.userFullNamePipe.transform(a.member),
            this.userFullNamePipe.transform(b.member),
            isAsc
          );

        default:
          return 0;
      }
    });

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  private aggregatePayments(): {
    [memberId: string]: {
      amount: number;
      currency: string;
      member: FamilyMember;
    };
  } {
    return (this.payments || []).reduce(
      (
        res: {
          [memberId: string]: {
            member: FamilyMember;
            amount: number;
            currency: string;
          };
        },
        payment: FamilyPaymentView
      ) => {
        if (!res[payment.member._id]) {
          return {
            ...res,
            // tslint:disable-next-line: max-line-length
            [payment.member._id]: {
              member: payment.member,
              amount: payment.amount,
              currency: payment.currency
            }
          };
        }
        return {
          ...res,
          [payment.member._id]: {
            member: payment.member,
            amount: res[payment.member._id].amount + payment.amount,
            currency: payment.currency
          }
        };
      },
      {}
    );
  }
}
