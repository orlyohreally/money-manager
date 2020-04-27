import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencySymbol'
})
export class CurrencySymbolPipeMock implements PipeTransform {
  transform(
    code: string,
    format: 'wide' | 'narrow' = 'narrow',
    locale?: string
  ): string {
    return `${code}-${format}${locale ? `-${locale}` : ''}`;
  }
}
