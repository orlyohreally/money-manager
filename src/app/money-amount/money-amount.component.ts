import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-money-amount',
  templateUrl: './money-amount.component.html',
  styleUrls: ['./money-amount.component.scss']
})
export class MoneyAmountComponent implements OnInit {
  @Input() amount: number;
  constructor() {}

  ngOnInit() {}
}
