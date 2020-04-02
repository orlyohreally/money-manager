import { Pipe, PipeTransform } from '@angular/core';
import { orderBy } from 'lodash';

@Pipe({ name: 'sharedSortBy' })
export class SortByPipe implements PipeTransform {
  transform<T>(value: T[], order?: 'asc' | 'desc', column?: string): T[] {
    if (!value || !value.length) {
      return value;
    }

    if (!column) {
      return !order || order === 'asc'
        ? [...value].sort()
        : [...value].sort().reverse();
    }
    return orderBy(value, [column], [order]);
  }
}
