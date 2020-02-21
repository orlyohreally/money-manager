import { getCurrencySymbol } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencySymbol'
})
export class CurrencySymbolPipe implements PipeTransform {
  transform(
    code: string,
    format: 'wide' | 'narrow' = 'narrow',
    locale?: string
  ): string {
    return getCurrencySymbol(code, format, locale);
  }
}
