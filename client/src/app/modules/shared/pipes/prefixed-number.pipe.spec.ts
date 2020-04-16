import { DecimalPipe } from '@angular/common';
import { async, TestBed } from '@angular/core/testing';

import { CurrencySymbolPipe } from './currency-symbol.pipe';
import { PrefixedNumberPipe } from './prefixed-number.pipe';

describe('PrefixedNumberPipe', () => {
  let pipe: PrefixedNumberPipe;
  let currencySymbolPipeSpy: jasmine.SpyObj<CurrencySymbolPipe>;
  let numberPipeSpy: jasmine.SpyObj<DecimalPipe>;

  beforeEach(async(() => {
    currencySymbolPipeSpy = jasmine.createSpyObj('CurrencySymbolPipe', [
      'transform'
    ]);
    currencySymbolPipeSpy.transform.and.callFake((currency: string) => {
      return currency;
    });
    numberPipeSpy = jasmine.createSpyObj('DecimalPipe', ['transform']);
    numberPipeSpy.transform.and.callFake(
      (value: number, digitsInfo?: string, locale?: string) => {
        return `${value} - ${digitsInfo} - ${locale}`;
      }
    );
    TestBed.configureTestingModule({
      providers: [
        { provider: CurrencySymbolPipe, useValue: currencySymbolPipeSpy }
      ]
    });
  }));

  beforeEach(() => {
    pipe = new PrefixedNumberPipe(currencySymbolPipeSpy, numberPipeSpy);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return USD1K for 1000, "USD"', () => {
    expect(pipe.transform(1000, 'USD', '1.0-5', 'ru-RU')).toEqual(
      'USD1 - 1.0-5 - ru-RUK'
    );
  });

  it('should return USD0 for 0, "USD"', () => {
    expect(pipe.transform(0, 'USD', '1.0-0', 'en-US')).toEqual(
      'USD0 - 1.0-0 - en-US'
    );
  });
});
