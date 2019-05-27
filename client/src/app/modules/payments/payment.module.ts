import { NgModule } from "@angular/core";

import {
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatIconModule,
  MatDatepickerModule,
  MAT_DATE_LOCALE,
  MatSelectModule
} from "@angular/material";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { ReactiveFormsModule } from "@angular/forms";
import { PayerComponent } from "./payer/payer.component";
import { NewPaymentComponent } from "./new-payment/new-payment.component";
import { PaymentFormComponent } from "./payment-form/payment-form.component";
import { PaymentListComponent } from "./payment-list/payment-list.component";
import { PaymentSubjectComponent } from "./payment-subject/payment-subject.component";
import { PaymentSubjectFormComponent } from "./payment-subject-form/payment-subject-form.component";
import { PaymentComponent } from "./payment-list/payment/payment.component";
import { MoneyAmountComponent } from "./money-amount/money-amount.component";
import { TotalPaymentComponent } from "./payment-list/total-payment/total-payment.component";

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
    BrowserModule,
    CommonModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
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
    { provide: MAT_DATE_LOCALE, useValue: "ru-RU" }
  ],
  entryComponents: [PaymentSubjectFormComponent]
})
export class PaymentModule {}
