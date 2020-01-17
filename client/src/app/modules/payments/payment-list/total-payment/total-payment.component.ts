import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User as Member } from '@shared/types';

@Component({
  selector: 'payment-total-payment',
  templateUrl: './total-payment.component.html',
  styleUrls: ['./total-payment.component.scss']
})
export class TotalPaymentComponent implements OnInit {
  @Input() paymentAmounts: { [memberId: string]: number; sum: number };
  @Input() payers: { [memberId: string]: Member };
  @Input() date: Date;
  @Output() showTotalAmounts = new EventEmitter();
  @Output() calcDischargedTotal = new EventEmitter();

  public displayMode = 'total';

  constructor() {}

  ngOnInit() {}

  public onShowTotalAmounts() {
    this.displayMode = 'total';
    this.showTotalAmounts.emit();
  }

  public onShowDischargedAmounts() {
    this.displayMode = 'discharged';
    this.calcDischargedTotal.emit();
  }
}
