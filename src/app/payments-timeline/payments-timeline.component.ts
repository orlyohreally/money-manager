import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import { PaymentsService } from '../payments.service';
import { PaymentFormComponent } from '../payment-form/payment-form.component';
import { Payment } from '@shared/types/payment';
import { Member } from '@shared/types/member';
import { MembersService } from '../members.service';
import { PaymentSubjectsService } from '../payment-subjects.service';
import { PaymentSubject } from '@shared/types/payment-subject';
import {
  getDischargedTotal,
  getTotal,
  aggregateAmountsByMember
} from '@shared/utils/payments';
@Component({
  selector: 'app-payments-timeline',
  templateUrl: './payments-timeline.component.html',
  styleUrls: ['./payments-timeline.component.scss']
})
export class PaymentsTimelineComponent implements OnInit {
  payments: Payment[];
  paymentAmounts: { [memberId: string]: number };
  curExpandedPaymentIndex: number;
  prevExpandedPaymentIndex: number;
  discharge = {};
  members: Member[];
  transformedMembers: { [id: string]: Member };
  paymentSubjects: { [id: string]: PaymentSubject };
  totalCalculatedAt: Date = new Date();
  constructor(
    private snackBar: MatSnackBar,
    private paymentsService: PaymentsService,
    private membersService: MembersService,
    private paymentSubjectsService: PaymentSubjectsService,
    private paymentForm: MatDialog
  ) {}

  ngOnInit() {
    this.getPayments();
    this.getPaymentSubjects();
    this.getMembers();

    this.calculateTotal();
  }

  private getMembers() {
    this.membersService.get().subscribe(members => {
      this.members = members;
      this.transformedMembers = this.membersService.aggregate(members);
    });
  }
  private getPayments() {
    this.paymentsService.getPayments().subscribe(
      payments => {
        this.payments = payments;
        console.log('getPayments', this.payments);
      },
      error => {
        console.log(error);
      }
    );
  }
  public getData(payment) {
    return {
      payment,
      member: this.transformedMembers[payment.memberId]
    };
  }
  private getPaymentSubjects() {
    this.paymentSubjectsService.get().subscribe(subjects => {
      this.paymentSubjects = this.paymentSubjectsService.aggregate(subjects);
    });
  }
  public convertColorSchemeToClasses(colorScheme: string): string {
    return this.membersService.convertColorSchemeToClasses(colorScheme);
  }
  public getPaymentClasses(payment: Payment) {
    return this.convertColorSchemeToClasses(
      this.transformedMembers[payment.memberId].colorScheme
    );
  }
  private calculateTotal() {
    this.paymentAmounts = aggregateAmountsByMember(
      this.payments,
      this.members.map(member => member._id)
    );
    this.paymentAmounts.sum = getTotal(this.payments);
  }
  public calcDischargedTotal() {
    this.paymentAmounts = {};
    console.log(this.payments, this.members.map(member => member._id));
    this.paymentAmounts = getDischargedTotal(
      this.payments,
      this.members.map(member => member._id)
    );
    this.paymentAmounts.sum = getTotal(this.payments);
  }

  public editPayment(event, payment) {
    this.openForm(payment);
  }
  public openForm(payment: Payment = null): void {
    const dialogRef = this.paymentForm.open(PaymentFormComponent, {
      width: '300px',
      data: payment
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        payment = result;
      }
    });
  }
  public removePayment(event, i) {
    const payment = this.payments[i];
    console.log(payment);
    this.paymentsService.removePayment(payment).subscribe(
      result => {
        if (result.status === 'success') {
          this.snackBar.open(
            `Payment for ₪ ${payment.amount} by ${
              payment.memberId
            } was deleted`,
            null,
            {
              duration: 2000
            }
          );
          this.payments.splice(i, 1);
          this.calculateTotal();
        } else {
          this.snackBar.open(result.msg, null, {
            duration: 2000
          });
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
