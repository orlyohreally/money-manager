import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FamilyMember, Payment, PaymentSubject } from '@shared/types';
import { FamilyPaymentView } from '@src/app/types';

@Component({
  selector: 'payment-family-payment-edit-form',
  templateUrl: './edit-family-payment-form.component.html',
  styleUrls: ['./edit-family-payment-form.component.scss']
})
export class EditFamilyPaymentFormComponent implements OnInit {
  @Input() subjects: PaymentSubject[];
  @Input() adminView: boolean;
  @Input() familyMembers: FamilyMember[];
  @Input() editedPayment: FamilyPaymentView;
  @Input() familyId: string;
  @Input() errorMessage: string;
  @Input() submittingForm = false;

  @Output() formSubmitted = new EventEmitter<Payment>();

  payment: Payment;
  paymentCurrency: string;

  constructor() {}

  ngOnInit() {
    this.payment = {
      _id: this.editedPayment._id,
      amount: this.editedPayment.amount,
      receipt: this.editedPayment.receipt,
      subjectId: this.editedPayment.subject._id,
      paidAt: new Date(this.editedPayment.paidAt),
      userId: this.editedPayment.member ? this.editedPayment.member._id : '',
      familyId: this.familyId,
      createdAt: new Date(this.editedPayment.createdAt),
      updatedAt: new Date(this.editedPayment.updatedAt),
      paymentPercentages: this.editedPayment.paymentPercentages
    };
  }

  updatePayment(payment: Payment) {
    this.formSubmitted.emit({
      ...payment,
      _id: this.editedPayment._id,
      familyId: this.familyId
    });
  }
}
