import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { PaymentsCalculationsService } from '@core-client/services/payments/payments-calculations.service';

@Component({
  selector: 'reports-user-monthly-expenses-report',
  templateUrl: './user-monthly-expenses-report.component.html',
  styleUrls: ['./user-monthly-expenses-report.component.scss']
})
export class UserMonthlyExpensesReportComponent implements OnInit, OnChanges {
  chartType = ChartType.LineChart;
  options = {
    isStacked: true,
    legend: { position: 'none' },
    backgroundColor: 'transparent',
    tooltip: { isHtml: true }
  };

  expensesData: Observable<{
    data: [string, ...(string | number)[]][];
    columns: (string | { type: string; role: string })[];
  }>;
  isChartReady = false;
  selectedYear: number;

  constructor(
    private paymentsCalculationsService: PaymentsCalculationsService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.getReportData(this.selectedYear);
  }

  onChartReady() {
    this.isChartReady = true;
  }

  getReportData(year: number) {
    this.selectedYear = year;
    this.expensesData = this.paymentsCalculationsService
      .getAggregatedUserPayments()
      .pipe(
        map(payments => {
          return this.paymentsCalculationsService.getUserMonthlyExpenses(
            payments,
            year
          );
        })
      );
  }
}
