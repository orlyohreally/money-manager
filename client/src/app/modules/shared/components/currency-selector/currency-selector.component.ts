import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'shared-currency-selector',
  templateUrl: './currency-selector.component.html',
  styleUrls: ['./currency-selector.component.scss']
})
export class CurrencySelectorComponent implements OnInit {
  @Input() currencyControl: FormControl;

  constructor() {}

  ngOnInit() {}
}
