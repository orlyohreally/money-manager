import { Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
// tslint:disable-next-line: max-line-length
import { CurrencyService } from '@core-client/services/currency/currency.service';
import { Currency } from '@src/app/types/currency';

@Component({
  selector: 'shared-currency-selector',
  templateUrl: './currency-selector.component.html',
  styleUrls: ['./currency-selector.component.scss']
})
export class CurrencySelectorComponent implements OnInit {
  @Input() currencyControl: FormControl;

  currencyList: Currency[];

  constructor(private currencyService: CurrencyService) {}

  ngOnInit() {
    this.currencyList = this.currencyService.getCurrencies();
  }
}
