import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@shared/types';
import { LocalStorageService } from 'ngx-localstorage';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { DataService } from '../data.service';
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { UserManagerService } from '../user-manager/user-manager.service';

@Injectable()
export class AuthenticationService extends DataService {
  token: string;
  refreshToken: string;

  private authenticated = new BehaviorSubject<boolean>(false);
  private user = new Subject<User>();
  constructor(
    http: HttpClient,
    globalVariablesService: GlobalVariablesService,
    private storageService: LocalStorageService
  ) {
    super(http, globalVariablesService);
    const tokens = JSON.parse(
      this.storageService.get('user_token', 'money-manager')
    );
    if (tokens) {
      this.token = tokens.token;
      this.refreshToken = tokens.refreshToken;
      this.authenticated.next(!!this.token);
      return;
    }
  }

  getUser(): Observable<User> {
    return this.user.asObservable();
  }

  isAuthenticated(): Observable<boolean> {
    return this.authenticated.asObservable();
  }

  register(user: User): Observable<User> {
    return this.post('users/signin', user, { observe: 'response' }).pipe(
      switchMap((response: HttpResponse<User & { refreshToken: string }>) => {
        this.updateTokens(response);
        this.user.next(response.body);
        return of(response.body);
      })
    );
  }

  login(user: { email: string; password: string }): Observable<User> {
    return this.post('users/login', user, { observe: 'response' }).pipe(
      map((response: HttpResponse<User & { refreshToken: string }>) => {
        this.updateTokens(response);
        this.user.next(response.body);
        return response.body;
      })
    );
  }

  logout() {
    this.storageService.remove('user_token', 'money-manager');
    this.user.next(null);
    this.authenticated.next(false);
  }

  requestRefreshToken(): Observable<string> {
    return this.post(
      'users/refresh-token',
      { refreshToken: this.refreshToken },
      { observe: 'response' }
    ).pipe(
      map((response: HttpResponse<{ refreshToken: string }>) => {
        this.updateTokens(response);
        return response.body.refreshToken;
      }),
      catchError(() => {
        return of(null);
      })
    );
  }

  private updateTokens(response: HttpResponse<{ refreshToken: string }>) {
    this.token = response.headers.get('Authorization');
    this.refreshToken = response.body.refreshToken;
    this.storageService.set(
      'user_token',
      JSON.stringify({ token: this.token, refreshToken: this.refreshToken }),
      'money-manager'
    );
    this.authenticated.next(true);
  }
}
