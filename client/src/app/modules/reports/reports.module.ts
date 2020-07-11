import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { GoogleChartsModule } from 'angular-google-charts';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { ReportsRoutingModule } from './reports-routing.module';

// tslint:disable-next-line: max-line-length
import { MonthSelectorComponent } from './month-selector/month-selector.component';
// tslint:disable-next-line: max-line-length
import { MonthlyExpensesReportComponent } from './monthly-expenses-report/monthly-expenses-report.component';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectsExpensesComponent } from './payment-subjects-expenses/payment-subjects-expenses.component';
import { ReportsComponent } from './reports.component';
import { YearSelectorComponent } from './year-selector/year-selector.component';

@NgModule({
  declarations: [
    ReportsComponent,
    MonthlyExpensesReportComponent,
    PaymentSubjectsExpensesComponent,
    YearSelectorComponent,
    MonthSelectorComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    GoogleChartsModule,
    MatSelectModule,
    MatTableModule,
    ReportsRoutingModule,
    SharedModule
  ]
})
export class ReportsModule {}
