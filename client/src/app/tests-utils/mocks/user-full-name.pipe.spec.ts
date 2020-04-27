import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sharedUserFullName'
})
export class UserFullNamePipeMock implements PipeTransform {
  constructor() {}

  transform<T extends { firstName: string; lastName: string }>(user: T): any {
    return `${user.firstName} ${user.lastName}`;
  }
}
