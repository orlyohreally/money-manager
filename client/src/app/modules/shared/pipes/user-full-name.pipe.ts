import { Pipe, PipeTransform } from '@angular/core';
// tslint:disable-next-line: max-line-length
import { UserManagerService } from '@core-client/services/user-manager/user-manager.service';

@Pipe({
  name: 'sharedUserFullName'
})
export class UserFullNamePipe implements PipeTransform {
  constructor(private userManagerService: UserManagerService) {}

  transform<T extends { firstName: string; lastName: string }>(user: T): any {
    return this.userManagerService.getFullName(user);
  }
}
