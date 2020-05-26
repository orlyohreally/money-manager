import { Directive, HostListener, Input } from '@angular/core';

import { DialogService } from '@core-client/services/dialog/dialog.service';
import { UserPaymentView } from '@src/app/types';
// tslint:disable-next-line: max-line-length
import { EditUserPaymentFormComponent } from '../components/edit-user-payment-form/edit-user-payment-form.component';

@Directive({
  selector: '[paymentEditUserPayment]'
})
export class EditUserPaymentDialogTriggerDirective {
  constructor(private dialog: DialogService) {}
  @Input('paymentEditUserPayment') payment: UserPaymentView;

  @HostListener('click', ['$event']) onClick() {
    this.dialog.open(EditUserPaymentFormComponent, {
      data: {
        payment: this.payment
      },
      width: '80%',
      maxWidth: '500px'
    });
  }
}
