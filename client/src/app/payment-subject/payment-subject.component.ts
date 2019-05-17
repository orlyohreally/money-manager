import { Component, OnInit, Input } from '@angular/core';
import { PaymentSubject } from '@shared/types/payment-subject';

@Component({
  selector: 'app-payment-subject',
  templateUrl: './payment-subject.component.html',
  styleUrls: ['./payment-subject.component.scss']
})
export class PaymentSubjectComponent implements OnInit {
  @Input() paymentSubject: PaymentSubject;
  constructor() {}

  ngOnInit() {}
}
