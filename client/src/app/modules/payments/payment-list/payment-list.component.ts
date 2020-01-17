import { Component, OnInit } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectsService } from '@core-client/services/payment-subject/payment-subjects.service';
// tslint:disable-next-line: max-line-length
import { PaymentsService } from '@core-client/services/payments/payments.service';
import { Payment, PaymentSubject, User as Payer } from '@shared/types';
import {
  aggregateAmountsByMember,
  getDischargedTotal,
  getTotalPaymentAmount,
  normalizedArray,
  orderNormalizedArrayByKey,
  unnormalizeArray
} from '@shared/utils';
import { PaymentFormComponent } from '../payment-form/payment-form.component';

@Component({
  selector: 'payment-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  payments: normalizedArray<Payment>;
  paymentAmounts: { [memberId: string]: number };
  payers: Payer[];
  transformedMembers: { [id: string]: Payer };
  paymentSubjects: { [id: string]: PaymentSubject };
  totalCalculatedAt: Date = new Date();
  constructor(
    private snackBar: MatSnackBar,
    private paymentsService: PaymentsService,
    private paymentSubjectsService: PaymentSubjectsService,
    private paymentForm: MatDialog
  ) {}

  ngOnInit() {
    this.getPayments();
    this.getPaymentSubjects();
    this.calculateTotal();
  }

  // private getMembers(familyId: string) {
  // tslint:disable-next-line: max-line-length
  //   // this.payers = this.membersService.getMembers(familyId).subscribe(members => {
  //   //    = members;
  //   //   this.transformedMembers = normalize(members);
  //   // });
  // }
  private getPayments() {
    this.paymentsService.getPayments().subscribe(
      payments => {
        this.payments = payments;
      },
      error => {
        // TODO: add handling
        // console.log(error);
      }
    );
  }

  private getPaymentSubjects() {
    this.paymentSubjectsService.getSubjects().subscribe(subjects => {
      this.paymentSubjects = subjects;
    });
  }

  public convertColorSchemeToClasses(colorScheme: string): string {
    return `background-color-${colorScheme}`;
  }

  public getPaymentClasses(payment: Payment) {
    return this.convertColorSchemeToClasses(
      this.transformedMembers[payment.memberId].colorScheme
    );
  }
  private calculateTotal() {
    this.paymentAmounts = aggregateAmountsByMember(
      this.payments,
      this.payers.map(member => member._id)
    );
    this.paymentAmounts.sum = getTotalPaymentAmount(
      unnormalizeArray(this.payments)
    );
  }
  public calcDischargedTotal() {
    this.paymentAmounts = {};
    this.paymentAmounts = getDischargedTotal(
      this.payments,
      this.payers.map(member => member._id)
    );
    this.paymentAmounts.sum = getTotalPaymentAmount(
      unnormalizeArray(this.payments)
    );
  }

  public editPayment(payment: Payment) {
    this.openForm(payment);
  }
  public openForm(payment: Payment): void {
    const dialogRef = this.paymentForm.open(PaymentFormComponent, {
      width: '300px',
      restoreFocus: false,
      data: payment
    });

    dialogRef.afterClosed().subscribe(result => {
      this.calculateTotal();
    });
  }
  public removePayment(payment: Payment) {
    this.paymentsService.removePayment(payment).subscribe(
      result => {
        if (result.status === 'success') {
          this.snackBar.open(
            // tslint:disable-next-line: max-line-length
            `Payment for ₪ ${payment.amount} by ${payment.memberId} was deleted`,
            null,
            {
              duration: 2000
            }
          );

          this.calculateTotal();
        } else {
          this.snackBar.open(result.msg, null, {
            duration: 2000
          });
        }
      },
      error => {
        // TODO: add handling
        // console.log(error);
      }
    );
  }

  public orderByKey(key) {
    return orderNormalizedArrayByKey(key);
  }
}
