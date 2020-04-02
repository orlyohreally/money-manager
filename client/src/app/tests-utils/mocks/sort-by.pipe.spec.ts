import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'sharedSortBy' })
export class SortByPipeMock implements PipeTransform {
  transform<T>(value: T[], order?: 'asc' | 'desc', column?: string): T[] {
    return value;
  }
}
