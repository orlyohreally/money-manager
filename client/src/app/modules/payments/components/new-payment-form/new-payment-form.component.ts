import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { MembersService } from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectsService } from '@core-client/services/payment-subject/payment-subjects.service';
// tslint:disable-next-line: max-line-length
import { PaymentsService } from '@core-client/services/payments/payments.service';
import { FamilyMember, Payment, PaymentSubject } from '@shared/types';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

@Component({
  selector: 'app-new-payment-form',
  templateUrl: './new-payment-form.component.html',
  styleUrls: ['./new-payment-form.component.scss']
})
export class NewPaymentFormComponent implements OnInit {
  subjects: Observable<PaymentSubject[]>;
  payment: Observable<Partial<Payment>>;
  adminView: Observable<boolean>;
  familyMembers: Observable<FamilyMember[]>;
  errorMessage: string;

  constructor(
    private dialogRef: MatDialogRef<NewPaymentFormComponent>,
    private paymentsService: PaymentsService,
    private paymentSubjectsService: PaymentSubjectsService,
    private familiesService: FamiliesService,
    private membersService: MembersService,
    private notificationsService: NotificationsService,
    @Inject(MAT_DIALOG_DATA)
    public data: { defaultUserId: string; familyId: string }
  ) {}

  ngOnInit() {
    this.subjects = this.paymentSubjectsService.getSubjects(this.data.familyId);
    this.adminView = this.membersService.userIsFamilyAdmin(
      this.data.defaultUserId,
      this.data.familyId
    );
    this.familyMembers = this.membersService
      .getMembers(this.data.familyId)
      .pipe(
        map(members =>
          members.filter(member =>
            this.membersService.familyMemberCanManageFamilyPayments(member)
          )
        )
      );
    this.payment = this.familiesService
      .getFamilyCurrency(this.data.familyId)
      .pipe(
        take(1),
        map((currency: string) => {
          return {
            userId: this.data.defaultUserId,
            familyId: this.data.familyId,
            paidAt: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
            subjectId: null,
            amount: 0,
            currency
          };
        })
      );
  }

  createPayment(payment: Partial<Payment>) {
    this.paymentsService.createPayment(this.data.familyId, payment).subscribe(
      result => {
        this.dialogRef.close(result);
        this.notificationsService.showNotification('Payment has been added');
      },
      error => {
        this.errorMessage = error.error.message;
      }
    );
  }

  // private updatePayment() {
  //   this.paymentsService.updatePayment(this.paymentForm.value).subscribe(
  //     result => {
  //       this.dialogRef.close(result);
  //     },
  //     () => {
  //       // TODO: add handling
  //       // console.log(error);
  //     }
  //   );
  // }
}
