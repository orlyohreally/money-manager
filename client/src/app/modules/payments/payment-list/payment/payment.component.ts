import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Payment, User as Payer, PaymentSubject } from "@shared/types";

@Component({
  selector: "payment-payment",
  templateUrl: "./payment.component.html",
  styleUrls: ["./payment.component.scss"]
})
export class PaymentComponent implements OnInit {
  @Input() payment: Payment;
  @Input() payer: Payer;
  @Input() paymentSubject: PaymentSubject;
  @Input() classes: string;
  @Output() editPayment = new EventEmitter();
  @Output() removePayment = new EventEmitter();

  public expanded = false;
  constructor() {}

  ngOnInit() {}

  public onEditPayment() {
    this.editPayment.emit();
  }

  public onRemovePayment() {
    this.removePayment.emit();
  }
  public expandEntry() {
    this.expanded = !this.expanded;
  }
}
