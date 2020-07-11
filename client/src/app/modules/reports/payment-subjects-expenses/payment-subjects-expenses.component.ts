import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
// tslint:disable-next-line: max-line-length
import { PaymentsCalculationsService } from '@core-client/services/payments/payments-calculations.service';
import { PaymentSubject } from '@shared/types';

@Component({
  selector: 'reports-payment-subjects-expenses',
  templateUrl: './payment-subjects-expenses.component.html',
  styleUrls: ['./payment-subjects-expenses.component.scss']
})
export class PaymentSubjectsExpensesComponent implements OnInit, OnChanges {
  @Input() familyId: string;

  chartType = ChartType.PieChart;
  columns: ['Payment subject', 'Spent', { type: 'string'; role: 'annotation' }];
  options = {
    legend: { position: 'top' },
    backgroundColor: 'transparent'
  };
  expenses: Observable<
    [string, { v: number; f: string; subject: PaymentSubject }][]
  >;
  selectedYear: number;
  selectedMonth: number;
  isChartReady = false;
  displayedColumns = ['subject', 'spent'];

  constructor(
    private paymentsCalculationsService: PaymentsCalculationsService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.getReportData(this.selectedYear, this.selectedMonth);
  }

  getReportData(year: number, month: number) {
    this.selectedYear = year;
    this.selectedMonth = month;
    this.expenses = this.paymentsCalculationsService
      .getAggregatedPayments(this.familyId)
      .pipe(
        map(payments => {
          // tslint:disable-next-line: max-line-length
          return this.paymentsCalculationsService.aggregateExpensesPerSubject(
            payments,
            year,
            month
          );
        })
      );
  }

  onChartReady() {
    this.isChartReady = true;
  }
}
