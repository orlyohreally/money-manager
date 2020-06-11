import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

import { PaymentSubject } from '@shared/types';

@Component({
  selector: 'shared-payment-subject',
  templateUrl: './payment-subject.component.html',
  styleUrls: ['./payment-subject.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentSubjectComponent implements OnInit {
  @Input() paymentSubject: PaymentSubject;

  constructor() {}

  ngOnInit() {}
}
