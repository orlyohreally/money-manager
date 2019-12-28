import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
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
