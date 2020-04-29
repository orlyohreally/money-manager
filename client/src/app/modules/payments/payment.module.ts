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
import { EditFamilyPaymentFormComponent } from './components/edit-family-payment-form/edit-family-payment-form.component';
// tslint:disable-next-line: max-line-length
import { EditPaymentFormComponent } from './components/edit-payment-form/edit-payment-form.component';
// tslint:disable-next-line: max-line-length
import { MemberPaymentDebtListComponent } from './components/member-payment-debt-list/member-payment-debt-list.component';
// tslint:disable-next-line: max-line-length
import { MemberPaymentOverpayAndDebtListComponent } from './components/member-payment-overpay-and-debt-list/member-payment-overpay-and-debt-list.component';
// tslint:disable-next-line: max-line-length
import { MemberPaymentOverpayAndDebtComponent } from './components/member-payment-overpay-and-debt/member-payment-overpay-and-debt.component';
// tslint:disable-next-line: max-line-length
import { MoneyAmountComponent } from './components/money-amount/money-amount.component';
// tslint:disable-next-line: max-line-length
import { NewPaymentFormComponent } from './components/new-payment-form/new-payment-form.component';
// tslint:disable-next-line: max-line-length
import { PaymentDetailsComponent } from './components/payment-details/payment-details.component';
// tslint:disable-next-line: max-line-length
import { PaymentFormComponent } from './components/payment-form/payment-form.component';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectFormComponent } from './components/payment-subject-form/payment-subject-form.component';
// tslint:disable-next-line: max-line-length
import { PaymentsCalculatedPerMemberComponent } from './components/payments-calculated-per-member/payments-calculated-per-member.component';
// tslint:disable-next-line: max-line-length
import { PaymentsFiltersComponent } from './components/payments-filters/payments-filters.component';
import { PaymentsComponent } from './components/payments/payments.component';
// tslint:disable-next-line: max-line-length
import { UserPaymentsListComponent } from './components/user-payment-list/user-payment-list.component';
// tslint:disable-next-line: max-line-length
import { UserPaymentsCalculatedPerMemberComponent } from './components/user-payments-calculated-per-member/user-payments-calculated-per-member.component';
// tslint:disable-next-line: max-line-length
import { UserPaymentsComponent } from './components/user-payments/user-payments.component';
// tslint:disable-next-line: max-line-length
import { NewPaymentDialogTriggerDirective } from './directives/new-payment-dialog-trigger.directive';
// tslint:disable-next-line: max-line-length
import { ViewFamilyPaymentDialogTriggerDirective } from './directives/view-family-payment-dialog-trigger.directive';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { PaymentRoutingModule } from './payment-routing.module';

@NgModule({
  declarations: [
    PaymentFormComponent,
    PaymentListComponent,
    PaymentSubjectFormComponent,
    MoneyAmountComponent,
    PaymentsComponent,
    NewPaymentDialogTriggerDirective,
    ViewFamilyPaymentDialogTriggerDirective,
    NewPaymentFormComponent,
    UserPaymentsListComponent,
    UserPaymentsComponent,
    PaymentsCalculatedPerMemberComponent,
    UserPaymentsCalculatedPerMemberComponent,
    MemberPaymentOverpayAndDebtComponent,
    MemberPaymentOverpayAndDebtListComponent,
    MemberPaymentDebtListComponent,
    PaymentsFiltersComponent,
    EditPaymentFormComponent,
    EditFamilyPaymentFormComponent,
    PaymentDetailsComponent
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
    PaymentFormComponent,
    PaymentListComponent,
    PaymentSubjectFormComponent,
    MoneyAmountComponent,
    UserPaymentsComponent
  ],
  providers: [
    MatDatepickerModule,
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' }
  ],
  entryComponents: [
    NewPaymentFormComponent,
    EditPaymentFormComponent,
    PaymentSubjectFormComponent,
    PaymentDetailsComponent
  ]
})
export class PaymentModule {}
