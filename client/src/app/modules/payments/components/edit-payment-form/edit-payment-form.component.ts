import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';

import { MembersService } from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectsService } from '@core-client/services/payment-subject/payment-subjects.service';
// tslint:disable-next-line: max-line-length
import { PaymentsService } from '@core-client/services/payments/payments.service';
import { FamilyMember, Payment, PaymentSubject, User } from '@shared/types';
import { FamilyPaymentView, UserPaymentView } from '@src/app/types';

@Component({
  selector: 'payment-edit-form',
  templateUrl: './edit-payment-form.component.html',
  styleUrls: ['./edit-payment-form.component.scss']
})
export class EditPaymentFormComponent implements OnInit {
  subjects: Observable<PaymentSubject[]>;
  familyMembers: Observable<FamilyMember[]>;
  errorMessage: string;
  submittingForm: boolean;

  constructor(
    private dialogRef: MatDialogRef<EditPaymentFormComponent>,
    private paymentsService: PaymentsService,
    private paymentSubjectsService: PaymentSubjectsService,
    private membersService: MembersService,
    private notificationsService: NotificationsService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isAdminMode: boolean;
      familyId: string;
      payment: FamilyPaymentView;
    }
  ) {}

  ngOnInit() {
    this.subjects = this.paymentSubjectsService.getSubjects(this.data.familyId);
    this.familyMembers = this.membersService.getMembers(this.data.familyId);
  }

  onFormSubmitted(payment: Partial<Payment>) {
    this.submittingForm = true;
    this.errorMessage = undefined;
    this.paymentsService.updatePayment(payment, payment.familyId).subscribe(
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
