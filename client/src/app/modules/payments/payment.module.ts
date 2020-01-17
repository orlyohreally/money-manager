import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
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
  MatSelectModule,
  MatSnackBarModule
} from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { MoneyAmountComponent } from './money-amount/money-amount.component';
import { NewPaymentComponent } from './new-payment/new-payment.component';
import { PayerComponent } from './payer/payer.component';
import { PaymentFormComponent } from './payment-form/payment-form.component';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { PaymentComponent } from './payment-list/payment/payment.component';
// tslint:disable-next-line: max-line-length
import { TotalPaymentComponent } from './payment-list/total-payment/total-payment.component';
import { PaymentRoutingModule } from './payment-routing.module';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectFormComponent } from './payment-subject-form/payment-subject-form.component';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectComponent } from './payment-subject/payment-subject.component';

@NgModule({
  declarations: [
    NewPaymentComponent,
    PayerComponent,
    PaymentComponent,
    PaymentFormComponent,
    PaymentListComponent,
    PaymentSubjectComponent,
    PaymentSubjectFormComponent,
    MoneyAmountComponent,
    TotalPaymentComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    SharedModule,

    MatSnackBarModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,

    PaymentRoutingModule
  ],
  exports: [
    NewPaymentComponent,
    PayerComponent,
    PaymentComponent,
    PaymentFormComponent,
    PaymentListComponent,
    PaymentSubjectComponent,
    PaymentSubjectFormComponent,
    MoneyAmountComponent,
    TotalPaymentComponent
  ],
  providers: [
    MatDatepickerModule,
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' }
  ],
  entryComponents: [PaymentFormComponent, PaymentSubjectFormComponent]
})
export class PaymentModule {}
