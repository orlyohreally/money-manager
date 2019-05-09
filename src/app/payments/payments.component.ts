import { Component, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material";
import { Payment } from "../payment";
import { Payer } from "../payer";
@Component({
  selector: "app-payments",
  templateUrl: "./payments.component.html",
  styleUrls: ["./payments.component.scss"]
})
export class PaymentsComponent implements OnInit {
  payments: Payment[];
  total = { amounts: {}, sum: 0, expand: false };
  payers: Payer[] = [];
  constructor(private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.payments = [
      {
        _id: "1",
        user: { _id: "1", name: "Alex", color: "primary" },
        receipt: "/assets/receipts/receipt.jpg",
        date: new Date().getTime(),
        created: new Date().getTime(),
        updated: new Date().getTime(),
        amount: 1100,
        message: "shopping",
        expanded: false
      },
      {
        _id: "2",
        user: { _id: "2", name: "Orly", color: "accent" },
        date: new Date().getTime(),
        created: new Date().getTime(),
        updated: new Date().getTime(),
        amount: 400,
        message: "shopping",
        expanded: false
      },
      {
        _id: "3",
        user: { _id: "2", name: "Orly", color: "accent" },
        date: new Date("6 May 2019 13:30:00").getTime(),
        created: new Date("6 May 2019 13:30:00").getTime(),
        updated: new Date().getTime(),
        amount: 100,
        message: "shopping",
        expanded: false
      }
    ];
    this.calculateTotal();
  }

  private calculateTotal() {
    this.payments.forEach(payment => {
      if (this.total.amounts[payment.user.name]) {
        this.total.amounts[payment.user.name] += payment.amount;
      } else {
        this.total.amounts[payment.user.name] = payment.amount;
        this.payers.push(payment.user);
      }
      this.total.sum += payment.amount;
    });
  }
  public editPayment(event, payment) {
    console.log(payment);
    this.snackBar.open(
      `Payment for ₪ ${payment.amount} by ${payment.user.name} was updated`,
      null,
      {
        duration: 2000
      }
    );
    event.stopPropagation();
  }
  public removePayment(event, payment) {
    console.log(payment);
    this.snackBar.open(
      `Payment for ₪ ${payment.amount} by ${payment.user.name} was deleted`,
      null,
      {
        duration: 2000
      }
    );
    event.stopPropagation();
  }
  onHeaderClick(event) {}

  onDotClick(event) {}

  onExpandEntry(expand, entry) {
    if (entry.expand) {
      setTimeout(() => {
        entry.expand = expand;
      }, 400);
    } else {
      entry.expand = expand;
    }
  }
}
