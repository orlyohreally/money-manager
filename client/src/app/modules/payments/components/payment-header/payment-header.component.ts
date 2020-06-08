import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Payment } from '@shared/types';

@Component({
  selector: 'payment-header',
  templateUrl: './payment-header.component.html',
  styleUrls: ['./payment-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentHeaderComponent implements OnInit {
  @Input() payment: Payment & { currency: string };

  constructor() {}

  ngOnInit() {}
}
