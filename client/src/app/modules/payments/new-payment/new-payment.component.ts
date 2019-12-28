import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PaymentFormComponent } from '../payment-form/payment-form.component';

@Component({
  selector: 'payment-new-payment',
  templateUrl: './new-payment.component.html',
  styleUrls: ['./new-payment.component.scss']
})
export class NewPaymentComponent implements OnInit {
  constructor(private paymentForm: MatDialog) {}

  ngOnInit() {}
  public newPayment() {
    this.openForm();
  }
  public openForm(): void {
    const dialogRef = this.paymentForm.open(PaymentFormComponent, {
      width: '300px',
      restoreFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      // TODO: add handling
      // console.log(result);
    });
  }
}
