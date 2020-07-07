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
    backgroundColor: 'transparent'
  };

  expensesData: Observable<{
    data: [string, ...{ v: number; f: string }[]][];
    columns: string[];
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
