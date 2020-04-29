import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { FamilyPaymentView } from '@src/app/types';

@Component({
  selector: 'payment-details',
  templateUrl: './payment-details.component.html',
  styleUrls: ['./payment-details.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentDetailsComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isAdminMode: boolean;
      familyId: string;
      payment: FamilyPaymentView;
    }
  ) {}

  ngOnInit() {}
}
