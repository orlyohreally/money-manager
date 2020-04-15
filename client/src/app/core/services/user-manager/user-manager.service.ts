import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@shared/types';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '../authentication/authentication.service';
import { DataService } from '../data.service';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagerService extends DataService {
  constructor(
    http: HttpClient,
    globalVariablesService: GlobalVariablesService,
    private authenticationService: AuthenticationService,
    private router: Router
  ) {
    super(http, globalVariablesService);
  }

  updateUser(userInfo: User): Observable<void> {
    return this.put(`users/update/${userInfo._id}`, {
      userSettings: userInfo
    }).pipe(
      map((response: { user: User }) => {
        return this.authenticationService.setUser(response.user);
      })
    );
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
}
