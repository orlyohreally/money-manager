import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private refreshTokenSubject: Subject<boolean> = new Subject<boolean>();

  constructor(private authService: AuthenticationService) {}

  intercept<T>(
    request: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          request.url.includes(this.authService.authEndpoints.login) ||
          request.url.includes(this.authService.authEndpoints.register) ||
          request.url.includes(this.authService.authEndpoints.refreshToken)
        ) {
          if (
            request.url.includes(this.authService.authEndpoints.refreshToken)
          ) {
            this.authService.logout();
          }

          return throwError(error);
        }

        if (error.status !== 401) {
          return throwError(error);
        }

        if (this.refreshTokenInProgress) {
          return this.refreshTokenSubject.pipe(
            filter((result: boolean) => result),
            take(1),
            switchMap(() =>
              next.handle(this.authService.addCredentialsToRequest(request))
            )
          );
        }
        this.refreshTokenInProgress = true;

        this.refreshTokenSubject.next(false);
        return this.authService.requestRefreshToken().pipe(
          switchMap(() => {
            this.refreshTokenInProgress = false;
            this.refreshTokenSubject.next(true);
            return next.handle(
              this.authService.addCredentialsToRequest(request)
            );
          }),
          catchError(() => {
            this.refreshTokenInProgress = false;
            this.authService.logout();
            return throwError(error);
          })
        );
      })
    );
  }
}
