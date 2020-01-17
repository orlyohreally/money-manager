import { HttpClient, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '@shared/types';
import { LocalStorageService } from 'ngx-localstorage';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DataService } from '../data.service';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';

@Injectable()
export class AuthenticationService extends DataService {
  readonly authApi = 'users';

  authEndpoints = {
    login: `${this.authApi}/login`,
    register: `${this.authApi}/signin`,
    refreshToken: `${this.authApi}/refresh-token`,
    emailVerificationRequest: `${this.authApi}/request-email-verification`,
    verifyEmail: `${this.authApi}/verify`
  };

  private authenticated = new BehaviorSubject<boolean>(false);
  private refreshToken: string;
  private user = new Subject<User>();
  private token: string;

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

  register(
    user: User
  ): Observable<{ email: string; verificationToken: string }> {
    return this.post(this.authEndpoints.register, user);
  }

  sendEmailVerificationEmail(
    email: string,
    verificationToken: string
  ): Observable<string> {
    return this.post(this.authEndpoints.emailVerificationRequest, {
      email,
      verificationToken
    });
  }

  login(user: { email: string; password: string }): Observable<User> {
    return this.post(this.authEndpoints.login, user, {
      observe: 'response'
    }).pipe(
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

  requestRefreshToken(): Observable<void> {
    return this.post(
      this.authEndpoints.refreshToken,
      { refreshToken: this.refreshToken },
      { observe: 'response' }
    ).pipe(
      map((response: HttpResponse<{ refreshToken: string }>) => {
        this.updateTokens(response);
      }),
      catchError(() => {
        return of(null);
      })
    );
  }

  verifyEmail(email: string, token: string): Observable<void> {
    return this.post(
      this.authEndpoints.verifyEmail,
      { email, token },
      { observe: 'response' }
    ).pipe(
      map((response: HttpResponse<User & { refreshToken: string }>) => {
        this.updateTokens(response);
        this.user.next(response.body);
      })
    );
  }

  addCredentialsToRequest<T>(request: HttpRequest<T>) {
    if (!this.authenticated.getValue()) {
      return request;
    }
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.token}`
      }
    });
  }

  private updateTokens(response: HttpResponse<{ refreshToken: string }>) {
    this.token = response.headers.get('Authorization');
    this.refreshToken = response.body.refreshToken;
    this.storageService.set(
      'user_token',
      JSON.stringify({ token: this.token, refreshToken: this.refreshToken }),
      'money-manager'
    );
    this.authenticated.next(!!this.token);
  }
}
