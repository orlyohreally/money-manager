import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Payment } from '@shared/types/payment';
import { Member } from '@shared/types/member';
import { PaymentSubject } from '@shared/types/payment-subject';

@Component({
  selector: 'app-payment-timeline-entry',
  templateUrl: './payment-timeline-entry.component.html',
  styleUrls: ['./payment-timeline-entry.component.scss']
})
export class PaymentTimelineEntryComponent implements OnInit {
  @Input() payment: Payment;
  @Input() member: Member;
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
