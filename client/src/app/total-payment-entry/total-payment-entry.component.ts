import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { User as Member } from '@shared/types';

@Component({
  selector: 'app-total-payment-entry',
  templateUrl: './total-payment-entry.component.html',
  styleUrls: ['./total-payment-entry.component.scss']
})
export class TotalPaymentEntryComponent implements OnInit {
  @Input() paymentAmounts: { [memberId: string]: number };
  @Input() members: { [memberId: string]: Member };
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
