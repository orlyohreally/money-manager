import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sharedFilter',
  pure: false
})
export class FilterPipeMock implements PipeTransform {
  transform(items: any[], callback: (item: any) => boolean): any {
    if (!items || !callback) {
      return items;
    }
    return items.filter(item => callback(item));
  }
}
