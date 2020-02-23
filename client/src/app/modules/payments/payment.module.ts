import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DATE_LOCALE,
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatSelectModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import { SharedModule } from '../shared/shared.module';
// tslint:disable-next-line: max-line-length
import { MoneyAmountComponent } from './components/money-amount/money-amount.component';
// tslint:disable-next-line: max-line-length
import { NewPaymentFormComponent } from './components/new-payment-form/new-payment-form.component';
import { PayerComponent } from './components/payer/payer.component';
// tslint:disable-next-line: max-line-length
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectFormComponent } from './components/payment-subject-form/payment-subject-form.component';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectComponent } from './components/payment-subject/payment-subject.component';
import { PaymentsComponent } from './components/payments/payments.component';
// tslint:disable-next-line: max-line-length
import { UserPaymentsListComponent } from './components/user-payment-list/user-payment-list.component';
// tslint:disable-next-line: max-line-length
import { UserPaymentsComponent } from './components/user-payments/user-payments.component';
// tslint:disable-next-line: max-line-length
import { NewPaymentDialogTriggerDirective } from './directives/new-payment-dialog-trigger.directive';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { PaymentComponent } from './payment-list/payment/payment.component';
// tslint:disable-next-line: max-line-length
import { TotalPaymentComponent } from './payment-list/total-payment/total-payment.component';
import { PaymentRoutingModule } from './payment-routing.module';

@NgModule({
  declarations: [
    PayerComponent,
    PaymentComponent,
    PaymentFormComponent,
    PaymentListComponent,
    PaymentSubjectComponent,
    PaymentSubjectFormComponent,
    MoneyAmountComponent,
    TotalPaymentComponent,
    PaymentsComponent,
    NewPaymentDialogTriggerDirective,
    NewPaymentFormComponent,
    UserPaymentsListComponent,
    UserPaymentsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    SharedModule,

    MatSnackBarModule,
    MatButtonModule,
    MatTableModule,
    MatTooltipModule,
    FlexModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatPaginatorModule,
    MatSortModule,

    PaymentRoutingModule
  ],
  exports: [
    PayerComponent,
    PaymentComponent,
    PaymentFormComponent,
    PaymentListComponent,
    PaymentSubjectComponent,
    PaymentSubjectFormComponent,
    MoneyAmountComponent,
    TotalPaymentComponent,
    UserPaymentsComponent
  ],
  providers: [
    MatDatepickerModule,
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' }
  ],
  entryComponents: [NewPaymentFormComponent, PaymentSubjectFormComponent]
})
export class PaymentModule {}
