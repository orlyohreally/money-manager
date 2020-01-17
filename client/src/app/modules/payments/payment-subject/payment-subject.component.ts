import { Component, Input, OnInit } from '@angular/core';
import { PaymentSubject } from '@shared/types';

@Component({
  selector: 'payment-payment-subject',
  templateUrl: './payment-subject.component.html',
  styleUrls: ['./payment-subject.component.scss']
})
export class PaymentSubjectComponent implements OnInit {
  @Input() paymentSubject: PaymentSubject;
  constructor() {}

  ngOnInit() {}
}
