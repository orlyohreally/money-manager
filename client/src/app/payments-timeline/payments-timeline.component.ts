import { Component, OnInit } from "@angular/core";
import { MatSnackBar, MatDialog } from "@angular/material";
import { PaymentFormComponent } from "../payment-form/payment-form.component";
import { MembersService } from "../members.service";
import { PaymentsService } from "../payments.service";
import { PaymentSubjectsService } from "../payment-subjects.service";
import { PaymentSubject, Payment, User as Member } from "@shared/types";
import {
  normalize,
  getDischargedTotal,
  getTotalPaymentAmount,
  aggregateAmountsByMember,
  normalizedArray,
  unnormalizeArray
} from "@shared/utils";

@Component({
  selector: "app-payments-timeline",
  templateUrl: "./payments-timeline.component.html",
  styleUrls: ["./payments-timeline.component.scss"]
})
export class PaymentsTimelineComponent implements OnInit {
  payments: normalizedArray<Payment>;
  paymentAmounts: { [memberId: string]: number };
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
      this.transformedMembers = normalize(members);
    });
  }
  private getPayments() {
    this.paymentsService.getPayments().subscribe(
      payments => {
        this.payments = payments;
      },
      error => {
        console.log(error);
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
      this.members.map(member => member._id)
    );
    this.paymentAmounts.sum = getTotalPaymentAmount(
      unnormalizeArray(this.payments)
    );
  }
  public calcDischargedTotal() {
    this.paymentAmounts = {};
    this.paymentAmounts = getDischargedTotal(
      this.payments,
      this.members.map(member => member._id)
    );
    this.paymentAmounts.sum = getTotalPaymentAmount(
      unnormalizeArray(this.payments)
    );
  }

  public editPayment(payment: Payment) {
    console.log(payment);
    this.openForm(payment);
  }
  public openForm(payment: Payment): void {
    const dialogRef = this.paymentForm.open(PaymentFormComponent, {
      width: "300px",
      restoreFocus: false,
      data: payment
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result, payment);
      this.payments[payment._id] = result;
      this.calculateTotal();
      console.log(this.payments);
    });
  }
  public removePayment(payment: Payment) {
    this.paymentsService.removePayment(payment).subscribe(
      result => {
        if (result.status === "success") {
          this.snackBar.open(
            `Payment for ₪ ${payment.amount} by ${
              payment.memberId
            } was deleted`,
            null,
            {
              duration: 2000
            }
          );
          delete this.payments[payment._id];
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
