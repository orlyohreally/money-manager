import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormComponent } from '@shared-client/components/form/form.component';
import { FamilyMember, Payment, PaymentSubject, User } from '@shared/types';

@Component({
  selector: 'payment-form',
  templateUrl: './payment-form.component.html',
  styleUrls: ['./payment-form.component.scss']
})
export class PaymentFormComponent extends FormComponent<Payment>
  implements OnInit {
  @Input() payment: Payment & { currency: string };
  @Input() adminView: boolean;
  @Input() subjects: PaymentSubject[];
  @Input() defaultPayer: User;
  @Input() payersList: FamilyMember[];
  @Input() errorMessage: string;
  @Input() submittingForm: boolean;
  @Input() formLabel: string;

  constructor() {
    super();
  }

  ngOnInit() {
    this.initPaymentForm(this.payment);
  }

  initPaymentForm(payment: Payment) {
    this.form = new FormGroup({
      userId: new FormControl(
        payment.userId,
        payment.familyId ? [Validators.required] : []
      ),
      paidAt: new FormControl(payment.paidAt, [Validators.required]),
      subjectId: new FormControl(payment.subjectId, [Validators.required]),
      amount: new FormControl(payment.amount, [
        Validators.required,
        Validators.pattern(
          '^([0-9]*[1-9][0-9]*(.[0-9]+)?|[0]+.[0-9]*[1-9][0-9]*)$'
        )
      ]),
      receipt: new FormControl(payment.receipt, [])
    });
  }
}
