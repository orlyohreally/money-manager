import { Component, OnInit, Input } from '@angular/core';
import { Payment } from '@shared/types/payment';
import { Member } from '@shared/types/member';
import { PaymentSubject } from '@shared/types/payment-subject';

@Component({
  selector: 'app-payment-timeline-entry',
  templateUrl: './payment-timeline-entry.component.html',
  styleUrls: ['./payment-timeline-entry.component.scss']
})
export class PaymentTimelineEntryComponent implements OnInit {
  @Input() appPaymentTimelineEntry;
  @Input() payment: Payment;
  @Input() member: Member;
  @Input() paymentSubject: PaymentSubject;
  @Input() onEdit;
  @Input() onRemove;
  @Input() classes;

  public expanded = false;
  constructor() {}

  ngOnInit() {}

  public editPayment(event) {
    this.onEdit(event, this.payment);
  }

  public removePayment(event, index) {
    this.onRemove(event, index);
  }
  public expandEntry() {
    this.expanded = !this.expanded;
  }
  public getMemberFullName(member: Member) {
    return `${member.lastName} ${member.firstName}`;
  }
}
