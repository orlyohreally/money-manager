import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { UserPaymentView } from '@src/app/types';

@Component({
  selector: 'payment-user-payment',
  templateUrl: './user-payment.component.html',
  styleUrls: ['./user-payment.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserPaymentComponent implements OnInit {
  @Input() element: UserPaymentView;

  constructor() {}

  ngOnInit() {}
}
