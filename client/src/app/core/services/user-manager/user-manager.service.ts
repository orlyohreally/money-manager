import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FamilyMember, User } from '@shared/types';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '../authentication/authentication.service';
import { DataService } from '../data.service';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { Member } from '../members/members.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagerService extends DataService {
  private defaultIcon = '/assets/images/profile.png';

  constructor(
    http: HttpClient,
    globalVariablesService: GlobalVariablesService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    super(http, globalVariablesService);
  }

  loadUser(): Observable<User> {
    return this.get<User>('users/user').pipe(
      map((user: User) => {
        this.authenticationService.setUser(user);
        return user;
      }),
      catchError((error: HttpErrorResponse) => {
        this.router.navigate(['/auth/logout']);
        return throwError(error);
      })
    );
  }

  getFullName(user: { firstName: string; lastName: string }): string {
    if (!user) {
      return;
    }
    return `${user.firstName} ${user.lastName}`;
  }

  getUserIcon(user: User | FamilyMember | Member): SafeResourceUrl {
    return user.icon || this.defaultIcon;
  }
}
