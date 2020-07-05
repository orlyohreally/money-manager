import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GoogleChartsModule } from 'angular-google-charts';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from '../shared/shared.module';
import { ReportsRoutingModule } from './reports-routing.module';

// tslint:disable-next-line: max-line-length
import { MonthlyExpensesReportComponent } from './monthly-expenses-report/monthly-expenses-report.component';
import { ReportsComponent } from './reports.component';

@NgModule({
  declarations: [ReportsComponent, MonthlyExpensesReportComponent],
  imports: [
    CommonModule,
    FormsModule,
    FlexLayoutModule,
    GoogleChartsModule,
    MatSelectModule,
    ReportsRoutingModule,
    SharedModule
  ]
})
export class ReportsModule {}
