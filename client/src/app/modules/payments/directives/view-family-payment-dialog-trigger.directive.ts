import { Directive, HostListener, Input } from '@angular/core';
import { combineLatest, of } from 'rxjs';
import { first, switchMap } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
import { DialogService } from '@core-client/services/dialog/dialog.service';
import { MembersService } from '@core-client/services/members/members.service';
import { FamilyPaymentView } from '@src/app/types';
// tslint:disable-next-line: max-line-length
import { EditPaymentFormComponent } from '../components/edit-payment-form/edit-payment-form.component';
// tslint:disable-next-line: max-line-length
import { PaymentDetailsComponent } from '../components/payment-details/payment-details.component';

@Directive({
  selector: '[paymentViewFamilyPayment]'
})
export class ViewFamilyPaymentDialogTriggerDirective {
  constructor(
    private dialog: DialogService,
    private authenticationService: AuthenticationService,
    private membersService: MembersService
  ) {}
  @Input('paymentViewFamilyPayment') payment: FamilyPaymentView;
  @Input() familyId: string;

  @HostListener('click', ['$event']) onClick() {
    this.showPaymentDetails();
  }

  showPaymentDetails() {
    this.authenticationService
      .getUser()
      .pipe(
        first(),
        switchMap(user => {
          return combineLatest([
            this.membersService.userIsFamilyAdmin(user._id, this.familyId),
            of(this.payment.member._id === user._id)
          ]);
        })
      )
      .subscribe(([isAdminMode, userIsPayer]: [boolean, boolean]) => {
        if (userIsPayer || isAdminMode) {
          this.dialog.open(EditPaymentFormComponent, {
            data: {
              isAdminMode,
              familyId: this.familyId,
              payment: this.payment
            },
            width: '80%',
            maxWidth: '500px'
          });
          return;
        }
        this.dialog.open(
          PaymentDetailsComponent,
          {
            maxWidth: '450px',
            width: '60%',
            data: {
              payment: this.payment
            }
          },
          false
        );
      });
  }
}
