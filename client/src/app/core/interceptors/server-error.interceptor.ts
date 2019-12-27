import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaderResponse,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  // Refresh Token Subject tracks the current token, or is null if no token is currently
  // available (e.g. refresh pending).
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(private authService: AuthenticationService) {}

  intercept<T>(
    request: HttpRequest<T>,
    next: HttpHandler
  ): Observable<HttpEvent<T>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // We don't want to refresh token for some requests like login or refresh token itself
        // So we verify url and we throw an error if it's the case
        if (
          request.url.includes('refresh-token') ||
          request.url.includes('login')
        ) {
          // We do another check to see if refresh token failed
          // In this case we want to logout user and to redirect it to login page

          if (request.url.includes('refresh-token')) {
            this.authService.logout();
          }

          return throwError(error);
        }

        // If error status is different than 401 we want to skip refresh token
        // So we check that and throw the error if it's the case
        if (error.status !== 401) {
          return throwError(error);
        }

        if (this.refreshTokenInProgress) {
          // If refreshTokenInProgress is true, we will wait until refreshTokenSubject has a non-null value
          // – which means the new token is ready and we can retry the request again
          return this.refreshTokenSubject.pipe(
            filter(result => result !== null),
            take(1),
            switchMap(() => next.handle(this.addAuthenticationToken(request)))
          );
        } else {
          this.refreshTokenInProgress = true;

          // Set the refreshTokenSubject to null so that subsequent API calls will wait until the new token has been retrieved
          this.refreshTokenSubject.next(null);

          // Call auth.refreshAccessToken(this is an Observable that will be returned)
          return this.authService.requestRefreshToken().pipe(
            switchMap((token: string) => {
              // When the call to refreshToken completes we reset the refreshTokenInProgress to false
              // for the next time the token needs to be refreshed
              this.refreshTokenInProgress = false;
              this.refreshTokenSubject.next(token);

              return next.handle(this.addAuthenticationToken(request));
            }),
            catchError((err: HttpHeaderResponse) => {
              this.refreshTokenInProgress = false;

              this.authService.logout();
              return throwError(error);
            })
          );
        }
      })
    );
  }

  addAuthenticationToken<T>(request: HttpRequest<T>) {
    const accessToken = this.authService.token;
    if (!accessToken) {
      return request;
    }
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.authService.token}`
      }
    });
  }
}
