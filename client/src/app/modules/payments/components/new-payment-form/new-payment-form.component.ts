import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { MembersService } from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectsService } from '@core-client/services/payment-subject/payment-subjects.service';
// tslint:disable-next-line: max-line-length
import { PaymentsService } from '@core-client/services/payments/payments.service';
import { FamilyMember, Payment, PaymentSubject, User } from '@shared/types';

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
  paymentCurrency: string;
  submittingForm = false;

  constructor(
    private dialogRef: MatDialogRef<NewPaymentFormComponent>,
    private paymentsService: PaymentsService,
    private paymentSubjectsService: PaymentSubjectsService,
    private familiesService: FamiliesService,
    private membersService: MembersService,
    private notificationsService: NotificationsService,
    private authService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA)
    public data: { defaultUserId: string; familyId: string }
  ) {}

  ngOnInit() {
    this.subjects = this.paymentSubjectsService.getSubjects(this.data.familyId);

    if (this.data.familyId) {
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
    }
    this.payment = this.data.familyId
      ? this.createDefaultFamilyPayment()
      : this.createDefaultUserPayment();
  }

  createPayment(payment: Partial<Payment>) {
    this.submittingForm = true;
    this.paymentsService.createPayment(payment, this.data.familyId).subscribe(
      result => {
        this.submittingForm = false;
        this.dialogRef.close(result);
        this.notificationsService.showNotification('Payment has been added');
      },
      (error: HttpErrorResponse) => {
        this.submittingForm = false;
        this.errorMessage = error.error.message
          ? error.error.message
          : error.statusText;
      }
    );
  }

  private createDefaultFamilyPayment(): Observable<Partial<Payment>> {
    return this.familiesService.getFamilyCurrency(this.data.familyId).pipe(
      take(1),
      map((currency: string) => {
        this.paymentCurrency = currency;
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

  private createDefaultUserPayment(): Observable<Partial<Payment>> {
    return this.authService.getUser().pipe(
      take(1),
      map((user: User) => {
        this.paymentCurrency = user.currency;

        return {
          userId: this.data.defaultUserId,
          familyId: this.data.familyId,
          paidAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
          subjectId: null,
          amount: 0,
          currency: user.currency
        };
      })
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
