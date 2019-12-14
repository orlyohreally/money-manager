import { Injectable } from '@angular/core';
import { User } from '@shared/types';
import { DataService } from '../data.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-localstorage';
import { GlobalVariablesService } from '../global-variables/global-variables.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService extends DataService {
  user: User;
  token: string;

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
      switchMap((response: HttpResponse<User>) => {
        this.updateToken(response);
        return of(response.body);
      })
    );
  }

  login(user: { email: string; password: string }): Observable<User> {
    return this.post('users/login', user, { observe: 'response' }).pipe(
      switchMap((response: HttpResponse<User>) => {
        this.updateToken(response);
        return of(response.body);
      })
    );
  }

  logout() {
    this.storageService.remove('user_token', 'money-manager');
    this.authenticated.next(false);
  }

  private updateToken(response: HttpResponse<User>) {
    this.token = response.headers.get('Authorization');
    if (this.token) {
      this.storageService.set('user_token', this.token, 'money-manager');
      this.authenticated.next(true);
    }
  }
}
