import { TestBed } from '@angular/core/testing';

import { Router, RouterStateSnapshot } from '@angular/router';
import { of } from 'rxjs';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '../services/authentication/authentication.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', [
      'isAuthenticated'
    ]);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthenticationService, useValue: authenticationServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });
  });

  it(
    'should return of(true)' +
      ' when authenticationService.isAuthenticated returns true',
    () => {
      authenticationServiceSpy.isAuthenticated.and.returnValue(of(true));
      const guard: AuthGuard = TestBed.get(AuthGuard);
      guard
        .canActivate(null, {} as RouterStateSnapshot)
        .subscribe((response: boolean) => {
          expect(response).toBe(true);
          expect(routerSpy.navigate).not.toHaveBeenCalled();
        });
    }
  );

  it(
    'should return of(false) and redirect to login page' +
      ' when authenticationService.isAuthenticated returns false',
    () => {
      authenticationServiceSpy.isAuthenticated.and.returnValue(of(false));
      const guard: AuthGuard = TestBed.get(AuthGuard);
      guard
        .canActivate(null, { url: 'current-page' } as RouterStateSnapshot)
        .subscribe((response: boolean) => {
          expect(response).toBe(false);
          expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
          expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login'], {
            queryParams: { returnUrl: 'current-page' }
          });
        });
    }
  );
});
