// tslint:disable-next-line: max-line-length
import { CurrencyService } from '@core-client/services/currency/currency.service';
import { Currency } from '@src/app/types/currency';

const currencies: Currency[] = [
  { symbol: 'USD', currency: 'United States Dollars' },
  { symbol: 'EUR', currency: 'Euro' }
];

export function getCurrencyServiceSpy(): jasmine.SpyObj<CurrencyService> {
  const currencyServiceSpy = jasmine.createSpyObj('CurrencyService', [
    'getCurrencies'
  ]);
  currencyServiceSpy.getCurrencies.and.returnValue(currencies);
  return currencyServiceSpy;
}
