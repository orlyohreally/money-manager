import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FlexModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from '../shared/shared.module';
// tslint:disable-next-line: max-line-length
import { DeletePaymentDialogComponent } from './components/delete-payment-dialog/delete-payment-dialog.component';
// tslint:disable-next-line: max-line-length
import { EditFamilyPaymentFormComponent } from './components/edit-family-payment-form/edit-family-payment-form.component';
// tslint:disable-next-line: max-line-length
import { EditPaymentFormComponent } from './components/edit-payment-form/edit-payment-form.component';
// tslint:disable-next-line: max-line-length
import { EditUserPaymentFormComponent } from './components/edit-user-payment-form/edit-user-payment-form.component';
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
import { PaymentHeaderComponent } from './components/payment-header/payment-header.component';
// tslint:disable-next-line: max-line-length
import { PaymentListComponent } from './components/payment-list/payment-list.component';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectFormComponent } from './components/payment-subject-form/payment-subject-form.component';
// tslint:disable-next-line: max-line-length
import { PaymentsCalculatedPerMemberComponent } from './components/payments-calculated-per-member/payments-calculated-per-member.component';
// tslint:disable-next-line: max-line-length
import { PaymentsFiltersComponent } from './components/payments-filters/payments-filters.component';
// tslint:disable-next-line: max-line-length
import { PaymentsListWrapperComponent } from './components/payments-list-wrapper/payments-list-wrapper.component';
import { PaymentsComponent } from './components/payments/payments.component';
// tslint:disable-next-line: max-line-length
import { PaymentActionButtonsComponent } from './components/user-payment-list/payment-action-buttons/payment-action-buttons.component';
// tslint:disable-next-line: max-line-length
import { UserPaymentsListComponent } from './components/user-payment-list/user-payment-list.component';
// tslint:disable-next-line: max-line-length
import { UserPaymentComponent } from './components/user-payment-list/user-payment/user-payment.component';
// tslint:disable-next-line: max-line-length
import { UserPaymentsCalculatedPerMemberComponent } from './components/user-payments-calculated-per-member/user-payments-calculated-per-member.component';
// tslint:disable-next-line: max-line-length
import { UserPaymentsListWrapperComponent } from './components/user-payments-list-wrapper/user-payments-list-wrapper.component';
// tslint:disable-next-line: max-line-length
import { UserPaymentsComponent } from './components/user-payments/user-payments.component';
// tslint:disable-next-line: max-line-length
import { DeleteFamilyPaymentDialogTriggerDirective } from './directives/delete-family-payment-dialog-trigger.directive';
// tslint:disable-next-line: max-line-length
import { EditUserPaymentDialogTriggerDirective } from './directives/edit-user-payment-dialog-trigger.directive';
// tslint:disable-next-line: max-line-length
import { NewPaymentDialogTriggerDirective } from './directives/new-payment-dialog-trigger.directive';
// tslint:disable-next-line: max-line-length
import { ViewFamilyPaymentDialogTriggerDirective } from './directives/view-family-payment-dialog-trigger.directive';
import { PaymentRoutingModule } from './payment-routing.module';

@NgModule({
  declarations: [
    EditFamilyPaymentFormComponent,
    EditPaymentFormComponent,
    MemberPaymentDebtListComponent,
    MemberPaymentOverpayAndDebtComponent,
    MemberPaymentOverpayAndDebtListComponent,
    MoneyAmountComponent,
    NewPaymentFormComponent,
    PaymentDetailsComponent,
    PaymentFormComponent,
    PaymentListComponent,
    PaymentsCalculatedPerMemberComponent,
    PaymentsComponent,
    PaymentsFiltersComponent,
    PaymentSubjectFormComponent,
    UserPaymentsCalculatedPerMemberComponent,
    UserPaymentsComponent,
    UserPaymentsListComponent,
    EditUserPaymentFormComponent,

    NewPaymentDialogTriggerDirective,
    ViewFamilyPaymentDialogTriggerDirective,
    EditUserPaymentDialogTriggerDirective,
    PaymentActionButtonsComponent,
    UserPaymentComponent,
    PaymentsListWrapperComponent,
    UserPaymentsListWrapperComponent,
    DeleteFamilyPaymentDialogTriggerDirective,
    DeletePaymentDialogComponent,
    PaymentHeaderComponent
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
  entryComponents: [
    NewPaymentFormComponent,
    EditPaymentFormComponent,
    EditUserPaymentFormComponent,
    PaymentSubjectFormComponent,
    PaymentDetailsComponent,
    DeletePaymentDialogComponent
  ]
})
export class PaymentModule {}
