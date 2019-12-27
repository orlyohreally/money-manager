import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from '@shared/types';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DataService } from '../data.service';
import { GlobalVariablesService } from '../global-variables/global-variables.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagerService extends DataService {
  defaultIcon = '/assets/images/profile.png';
  constructor(
    http: HttpClient,
    globalVariablesService: GlobalVariablesService,
    private router: Router
  ) {
    super(http, globalVariablesService);
  }

  loadUser(): Observable<User> {
    return this.get<User>('users/user').pipe(
      catchError((error: HttpErrorResponse) => {
        this.router.navigate(['/logout']);
        return throwError(error);
      })
    );
  }

  getFullName(user: User): string {
    return `${user.firstName} ${user.lastName}`;
  }

  getUserIcon(user: User): SafeResourceUrl {
    return user.icon || this.defaultIcon;
  }
}
