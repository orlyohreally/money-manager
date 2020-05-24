import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { UserPaymentView } from '@src/app/types';

@Component({
  selector: 'payment-action-buttons',
  templateUrl: './payment-action-buttons.component.html',
  styleUrls: ['./payment-action-buttons.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentActionButtonsComponent implements OnInit {
  @Input() payment: UserPaymentView;

  constructor() {}

  ngOnInit() {}
}
