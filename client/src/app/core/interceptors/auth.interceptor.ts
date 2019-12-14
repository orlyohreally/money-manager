import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { take, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.authService.token;
    return this.authService.isAuthenticated().pipe(
      take(1),
      switchMap((isAuthenticated: boolean) => {
        if (isAuthenticated) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${this.authService.token}`
            }
          });
        }

        return next.handle(request);
      })
    );
  }
}
