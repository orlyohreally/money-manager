import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@shared/types';
import { LocalStorageService } from 'ngx-localstorage';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { DataService } from '../data.service';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends DataService {
  user: User;
  token: string;
  refreshToken: string;

  private authenticated = new BehaviorSubject<boolean>(false);

  constructor(
    http: HttpClient,
    globalVariablesService: GlobalVariablesService,
    private storageService: LocalStorageService
  ) {
    super(http, globalVariablesService);

    this.token = this.storageService.get('user_token', 'money-manager');
    this.authenticated.next(!!this.token);
  }

  getUser(): User {
    return this.user;
  }

  isAuthenticated(): Observable<boolean> {
    return this.authenticated.asObservable();
  }

  register(user: User): Observable<User> {
    return this.post('users/signin', user, { observe: 'response' }).pipe(
      switchMap((response: HttpResponse<User & { refreshToken: string }>) => {
        this.updateTokens(response);
        return of(response.body);
      })
    );
  }

  login(user: { email: string; password: string }): Observable<User> {
    return this.post('users/login', user, { observe: 'response' }).pipe(
      switchMap((response: HttpResponse<User & { refreshToken: string }>) => {
        this.updateTokens(response);
        return of(response.body);
      })
    );
  }

  logout() {
    this.storageService.remove('user_token', 'money-manager');
    this.authenticated.next(false);
  }

  private updateTokens(response: HttpResponse<{ refreshToken: string }>) {
    this.token = response.headers.get('Authorization');
    if (this.token) {
      this.storageService.set('user_token', this.token, 'money-manager');
      this.authenticated.next(true);
    }
    this.refreshToken = response.body.refreshToken;
  }

  requestRefreshToken(): Observable<boolean> {
    return this.post(
      'users/refresh-token',
      { refreshToken: this.refreshToken },
      { observe: 'response' }
    ).pipe(
      switchMap((response: HttpResponse<{ refreshToken: string }>) => {
        this.updateTokens(response);
        return of(true);
      }),
      catchError(() => {
        return of(false);
      })
    );
  }
}
