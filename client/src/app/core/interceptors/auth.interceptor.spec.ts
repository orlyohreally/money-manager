import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '../services/authentication/authentication.service';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    authenticationServiceSpy = {
      ...jasmine.createSpyObj('AuthenticationService', ['isAuthenticated']),
      token: 'bearerToken'
    } as jasmine.SpyObj<AuthenticationService>;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: AuthenticationService, useValue: authenticationServiceSpy }
      ]
    });
    http = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it(
    'should add auth header to http request' +
      ' when authenticationService.isAuthenticated is of(true)',
    () => {
      authenticationServiceSpy.isAuthenticated.and.returnValue(of(true));

      http.get('/mocked-url').subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpTestingController.expectOne('/mocked-url');
      expect(req.request.headers.has('Authorization')).toBeTruthy();
      expect(req.request.headers.get('Authorization')).toBe(
        `Bearer bearerToken`
      );
      expect(req.request.method).toEqual('GET');

      req.flush({});
      httpTestingController.verify();
    }
  );

  it(
    'should not add auth header to http request' +
      ' when authenticationService.isAuthenticated is of(false)',
    () => {
      authenticationServiceSpy.isAuthenticated.and.returnValue(of(false));

      http.get('/mocked-url').subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpTestingController.expectOne('/mocked-url');
      expect(req.request.headers.has('Authorization')).toBeFalsy();
      expect(req.request.method).toEqual('GET');

      req.flush({});
      httpTestingController.verify();
    }
  );
});
