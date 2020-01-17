import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'payment-money-amount',
  templateUrl: './money-amount.component.html',
  styleUrls: ['./money-amount.component.scss']
})
export class MoneyAmountComponent implements OnInit {
  @Input() public amount: number;
  @Input() public colorize: boolean;
  @Input() public humanizeLook: boolean;
  @Input() public humanizeLookType: string;
  constructor() {}

  ngOnInit() {}

  public getColoringClass(): string {
    if (this.colorize) {
      return this.amount > 0
        ? 'color-success'
        : this.amount < 0
        ? 'color-danger'
        : 'color-warning';
    }
    return null;
  }

  public getDisplayValue(): string {
    const formatedAmount = Math.abs(this.amount)
      .toFixed(2)
      .replace(/[.,]00/, '');
    if (this.humanizeLook) {
      if (this.humanizeLookType === 'negative') {
        return this.amount > 0
          ? `overpaid ₪ ${formatedAmount}`
          : this.amount < 0
          ? `needs to pay ₪ ${formatedAmount}`
          : 'all paid';
      } else {
        return `spent ₪ ${formatedAmount}`;
      }
    }
    return `₪ ${formatedAmount}`;
  }
}
