import { Directive, HostListener, Input } from '@angular/core';
import { take } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
import { DialogService } from '@core-client/services/dialog/dialog.service';
import { User } from '@shared/types';
// tslint:disable-next-line: max-line-length
import { NewPaymentFormComponent } from '../components/new-payment-form/new-payment-form.component';

@Directive({
  selector: '[paymentNewPayment]'
})
export class NewPaymentDialogTriggerDirective {
  constructor(
    private dialog: DialogService,
    private authenticationService: AuthenticationService
  ) {}
  @Input('paymentNewPayment') familyId: string;

  @HostListener('click', ['$event']) onClick() {
    this.newPayment();
  }

  /**
   * new family payment
   *   currency - family currency
   *   subjects - family subjects
   *   familyId
   * - admin view
   *   select with members
   * - payer view
   *   payer (the viewer) as read only value
   * - another user view
   *   everything is read only value
   */

  newPayment() {
    this.authenticationService
      .getUser()
      .pipe(take(1))
      .subscribe((user: User) => {
        this.dialog.open(NewPaymentFormComponent, {
          width: '80%',
          maxWidth: '500px',
          data: {
            defaultUserId: user._id,
            familyId: this.familyId
          }
        });
      });
  }
}
