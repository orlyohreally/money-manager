import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sharedPrefixedNumber'
})
export class PrefixedNumberPipeMock implements PipeTransform {
  transform(value: number | string, currency: string): string {
    return `${value} - ${currency}`;
  }
}
