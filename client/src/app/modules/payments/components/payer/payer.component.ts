import { Component, Input, OnInit } from '@angular/core';
import { User as Payer } from '@shared/types';

@Component({
  selector: 'payment-payer',
  templateUrl: './payer.component.html',
  styleUrls: ['./payer.component.scss']
})
export class PayerComponent implements OnInit {
  @Input() payer: Payer;
  constructor() {}

  ngOnInit() {}

  public getFullName() {
    return `${this.payer.lastName} ${this.payer.firstName}`;
  }
}
