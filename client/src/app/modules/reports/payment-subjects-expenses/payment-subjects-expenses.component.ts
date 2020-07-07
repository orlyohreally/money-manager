import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ChartType } from 'angular-google-charts';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
// tslint:disable-next-line: max-line-length
import { PaymentsCalculationsService } from '@core-client/services/payments/payments-calculations.service';

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
    isStacked: true,
    legend: { position: 'top', maxLines: 3 },
    backgroundColor: 'transparent'
  };
  expenses: Observable<[string, { v: number; f: string }][]>;
  selectedYear: number;
  isChartReady = false;

  constructor(
    private paymentsCalculationsService: PaymentsCalculationsService
  ) {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.getReportData(this.selectedYear);
  }

  getReportData(year: number) {
    this.selectedYear = year;
    this.expenses = this.paymentsCalculationsService
      .getAggregatedPayments(this.familyId)
      .pipe(
        map(payments => {
          // tslint:disable-next-line: max-line-length
          return this.paymentsCalculationsService.aggregateFamilyExpensesPerPaymentSubject(
            payments,
            year
          );
        })
      );
  }

  onChartReady() {
    this.isChartReady = true;
  }
}
