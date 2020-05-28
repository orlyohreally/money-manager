import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';

// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectsService } from '@core-client/services/payment-subject/payment-subjects.service';
// tslint:disable-next-line: max-line-length
import { PaymentsService } from '@core-client/services/payments/payments.service';
import { Payment, PaymentSubject } from '@shared/types';
import { UserPaymentView } from '@src/app/types';

@Component({
  selector: 'payment-user-payment-edit-form',
  templateUrl: './edit-user-payment-form.component.html',
  styleUrls: ['./edit-user-payment-form.component.scss']
})
export class EditUserPaymentFormComponent implements OnInit {
  payment: Payment & { currency: string };
  paymentCurrency: string;

  subjects: Observable<PaymentSubject[]>;
  errorMessage: string;
  submittingForm: boolean;

  constructor(
    private dialogRef: MatDialogRef<EditUserPaymentFormComponent>,
    private paymentsService: PaymentsService,
    private paymentSubjectsService: PaymentSubjectsService,
    private notificationsService: NotificationsService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      payment: UserPaymentView;
    }
  ) {}

  ngOnInit() {
    this.subjects = this.paymentSubjectsService.getSubjects();
    this.payment = {
      _id: this.data.payment._id,
      amount: this.data.payment.amount,
      receipt: this.data.payment.receipt,
      subjectId: this.data.payment.subject._id,
      paidAt: new Date(this.data.payment.paidAt),
      userId: this.data.payment.member ? this.data.payment.member._id : '',
      createdAt: new Date(this.data.payment.createdAt),
      updatedAt: new Date(this.data.payment.updatedAt),
      paymentPercentages: this.data.payment.paymentPercentages,
      currency: this.data.payment.currency
    };
  }

  onFormSubmitted(form: Pick<Payment, 'amount' | 'subjectId' | 'paidAt'>) {
    this.submittingForm = true;
    this.errorMessage = undefined;
    this.paymentsService
      .updateUserPayment({ ...form, _id: this.data.payment._id })
      .subscribe(
        () => {
          this.submittingForm = false;
          this.notificationsService.showNotification(
            'Payment has been successfully updated'
          );
          this.dialogRef.close();
        },
        (error: HttpErrorResponse) => {
          this.submittingForm = false;
          this.errorMessage = error.error.message
            ? error.error.message
            : error.statusText;
        }
      );
  }
}
