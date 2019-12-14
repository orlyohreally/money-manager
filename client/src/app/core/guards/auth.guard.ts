import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from '@angular/router';
import { AuthenticationService } from '../services/authentication/authentication.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.isAuthenticated().pipe(
      switchMap((authenticated: boolean) => {
        if (authenticated) {
          return of(true);
        }

        this.router.navigate(['auth/login'], {
          queryParams: { returnUrl: state.url }
        });
        return of(false);
      })
    );
  }
}
