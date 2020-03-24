import { async, TestBed } from '@angular/core/testing';
import { CurrencySymbolPipe } from './currency-symbol.pipe';
import { PrefixedNumberPipe } from './prefixed-number.pipe';

describe('PrefixedNumberPipe', () => {
  let pipe: PrefixedNumberPipe;
  let currencySymbolPipeSpy: jasmine.SpyObj<CurrencySymbolPipe>;

  beforeEach(async(() => {
    currencySymbolPipeSpy = jasmine.createSpyObj('CurrencySymbolPipe', [
      'transform'
    ]);
    currencySymbolPipeSpy.transform.and.callFake((currency: string) => {
      return currency;
    });
    TestBed.configureTestingModule({
      providers: [
        { provider: CurrencySymbolPipe, useValue: currencySymbolPipeSpy }
      ]
    });
  }));

  beforeEach(() => {
    pipe = new PrefixedNumberPipe(currencySymbolPipeSpy);
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return USD1K for 1000, "USD"', () => {
    expect(pipe.transform(1000, 'USD')).toEqual('USD1K');
  });

  it('should return USD0 for 0, "USD"', () => {
    expect(pipe.transform(0, 'USD')).toEqual('USD0');
  });
});
