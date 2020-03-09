import {
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
import { FamilyPaymentView } from '@src/app/types';
import { compare } from '../../shared/functions';

@Component({
  selector: 'payment-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit, OnChanges {
  @HostBinding('style.width') width = '100%';

  @Input() payments: FamilyPaymentView[];

  displayedColumns: string[] = [
    'subject',
    'amount',
    'member',
    'paidAt',
    'createdAt',
    'updatedAt'
  ];
  dataSource: MatTableDataSource<FamilyPaymentView>;

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
    this.dataSource = new MatTableDataSource<FamilyPaymentView>(this.payments);
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
        case 'amount':
          return compare(a.amount, b.amount, isAsc);
        case 'subject':
          return compare(a.subjectName, b.subjectName, isAsc);
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
