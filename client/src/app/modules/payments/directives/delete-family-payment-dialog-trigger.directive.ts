import { Directive, HostListener, Input, Optional } from '@angular/core';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { MatDialogRef } from '@angular/material';
import { DialogService } from '@core-client/services/dialog/dialog.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
// tslint:disable-next-line: max-line-length
import { PaymentsService } from '@core-client/services/payments/payments.service';
import { NotificationType } from '@src/app/types';
// tslint:disable-next-line: max-line-length
import { DeletePaymentDialogComponent } from '../components/delete-payment-dialog/delete-payment-dialog.component';
// tslint:disable-next-line: max-line-length
import { EditFamilyPaymentFormComponent } from '../components/edit-family-payment-form/edit-family-payment-form.component';

@Directive({
  selector: '[paymentDeleteFamilyPaymentDialogTrigger]'
})
export class DeleteFamilyPaymentDialogTriggerDirective {
  constructor(
    private dialog: DialogService,
    private paymentsService: PaymentsService,
    private notificationsService: NotificationsService,
    @Optional()
    private editFamilyPaymentDialog: MatDialogRef<
      EditFamilyPaymentFormComponent
    >
  ) {}
  @Input('paymentDeleteFamilyPaymentDialogTrigger') paymentId: string;
  @Input() familyId: string;

  @HostListener('click', ['$event']) onClick() {
    if (this.editFamilyPaymentDialog) {
      this.editFamilyPaymentDialog.close();
    }
    const dialogRef = this.dialog.open(
      DeletePaymentDialogComponent,
      {
        width: '400px',
        maxWidth: '80%',
        panelClass: 'full-width-dialog'
      },
      false
    );

    dialogRef
      .afterClosed()
      .pipe(
        switchMap(result => {
          return result
            ? this.paymentsService.deletePayment(this.paymentId, this.familyId)
            : of();
        })
      )
      .subscribe(
        () => {
          this.notificationsService.showNotification(
            'Payment has been successfully deleted'
          );
        },
        () => {
          this.notificationsService.showNotification(
            'Error ocurred while deleting the payment',
            NotificationType.Error,
            { duration: 3000 }
          );
        }
      );
  }
}
