import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

// tslint:disable-next-line: max-line-length
import { PaymentsCalculationsService } from '@core-client/services/payments/payments-calculations.service';
import { compare } from '@shared-client/functions';
import { UserFullNamePipe } from '@shared-client/pipes/user-full-name.pipe';
import { PaymentExpense } from '@src/app/modules/shared/types';
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

  expenses: PaymentExpense[];
  displayedColumns: string[] = ['memberFullName', 'amount'];
  dataSource: MatTableDataSource<PaymentExpense>;

  private paginator: MatPaginator;
  private sort: MatSort;

  constructor(
    private userFullNamePipe: UserFullNamePipe,
    private paymentsCalculationsService: PaymentsCalculationsService
  ) {}

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
    this.expenses = this.paymentsCalculationsService.getTotalExpensesPerMember(
      this.payments
    );
    this.dataSource = new MatTableDataSource<PaymentExpense>(this.expenses);
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
}
