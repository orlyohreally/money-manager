import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { PaymentsCalculationsService } from '@core-client/services/payments/payments-calculations.service';

@Component({
  selector: 'reports-monthly-expenses-report',
  templateUrl: './monthly-expenses-report.component.html',
  styleUrls: ['./monthly-expenses-report.component.scss']
})
export class MonthlyExpensesReportComponent implements OnInit, OnChanges {
  @Input() familyId: string;

  chartType = ChartType.ColumnChart;
  options = {
    isStacked: true,
    legend: { position: 'top', maxLines: 3 },
    title: 'Monthly expenses of family members',
    chart: {
      subtitle: 'Sales, Expenses, and Profit: 2014-2017',
      height: '100%'
    },
    backgroundColor: 'transparent',
    width: '100%'
    // chartArea: {
    //   backgroundColor: '#000'
    // }
  };

  payments: Observable<{ data: [string, ...number[]][]; columns: string[] }>;
  isColumnChartReady = false;
  years: number[];
  selectedYear = new Date().getFullYear();

  private minYear = 2019;

  constructor(
    private paymentsCalculationsService: PaymentsCalculationsService
  ) {}

  ngOnInit(): void {
    this.years = Array.from(
      Array(new Date().getFullYear() - this.minYear + 1),
      (_, i) => i + this.minYear
    );
  }

  ngOnChanges(): void {
    this.getReportData(this.selectedYear);
  }

  onChartReady() {
    this.isColumnChartReady = true;
  }

  getReportData(year: number) {
    this.payments = this.paymentsCalculationsService
      .getAggregatedPayments(this.familyId)
      .pipe(
        map(payments => {
          return this.paymentsCalculationsService.convertToColumnChart(
            this.paymentsCalculationsService.getTotalExpensesPerMonthPerMember(
              payments,
              year
            )
          );
        })
      );
  }
}
