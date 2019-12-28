import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, map, retry } from 'rxjs/operators';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '../services/authentication/authentication.service';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authService.requestRefreshToken().pipe(
            map((response: boolean) => {
              if (response) {
                return retry(1);
              }
              this.router.navigate(['/auth/login']);
              return throwError(error);
            })
          );
        }
        return throwError(error);
      })
    );
  }
}
