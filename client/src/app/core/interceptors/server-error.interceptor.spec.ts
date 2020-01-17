import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from '../services/authentication/authentication.service';
import {
  HTTP_INTERCEPTORS,
  HttpClient,
  HttpErrorResponse,
  HttpRequest
} from '@angular/common/http';
import { of } from 'rxjs';
import { ServerErrorInterceptor } from './server-error.interceptor';

describe('ServerErrorInterceptor', () => {
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;

  const mockedError = {
    status: 400,
    statusText: 'Bad Request'
  } as HttpErrorResponse;

  const mockedEndpoints = {
    login: '/login',
    register: '/signin',
    refreshToken: '/refresh-token',
    emailVerificationRequest: '/request-email-verification',
    verifyEmail: '/verify'
  };
  const mockedUrl = '/mocked-url';
  const mockedRequest = new HttpRequest<{}>('POST', 'mocked-url-1', null);

  beforeEach(() => {
    authenticationServiceSpy = {
      ...jasmine.createSpyObj('AuthenticationService', [
        'isAuthenticated',
        'addCredentialsToRequest',
        'requestRefreshToken',
        'logout'
      ]),
      token: 'bearerToken',
      authEndpoints: mockedEndpoints
    } as jasmine.SpyObj<AuthenticationService>;
    authenticationServiceSpy.addCredentialsToRequest.and.returnValue(
      mockedRequest
    );
    authenticationServiceSpy.requestRefreshToken.and.returnValue(of(undefined));

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ServerErrorInterceptor,
          multi: true
        },
        { provide: AuthenticationService, useValue: authenticationServiceSpy }
      ]
    });
    http = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should throw error if error status is not 403', () => {
    http.get(mockedUrl).subscribe(
      () => {
        fail('Should throw error');
      },
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(mockedError.status);
        expect(error.statusText).toBe(mockedError.statusText);
      }
    );

    const req = httpTestingController.expectOne({
      url: mockedUrl,
      method: 'GET'
    });
    req.flush(null, mockedError);
    httpTestingController.verify();
  });

  it('should throw error if request was for login endpoint when error status is 403', () => {
    http.get(mockedEndpoints.login).subscribe(
      () => {
        fail('Should throw error');
      },
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(mockedError.status);
        expect(error.statusText).toBe(mockedError.statusText);
      }
    );

    const req = httpTestingController.expectOne({
      url: mockedEndpoints.login,
      method: 'GET'
    });
    req.flush(null, mockedError);
    httpTestingController.verify();
  });

  it('should throw error if request was for registration endpoint', () => {
    http.post(mockedEndpoints.register, {}).subscribe(
      () => {
        fail('Should throw error');
      },
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(mockedError.status);
        expect(error.statusText).toBe(mockedError.statusText);
      }
    );

    const req = httpTestingController.expectOne({
      url: mockedEndpoints.register,
      method: 'POST'
    });
    req.flush(null, mockedError);
    httpTestingController.verify();
  });

  it('should throw error if request was for refresh token in endpoint and call authenticationService.logout', () => {
    http.post(mockedEndpoints.refreshToken, {}).subscribe(
      () => {
        fail('Should throw error');
      },
      (error: HttpErrorResponse) => {
        expect(error.status).toBe(mockedError.status);
        expect(error.statusText).toBe(mockedError.statusText);
        expect(authenticationServiceSpy.logout).toHaveBeenCalledTimes(1);
      }
    );

    const req = httpTestingController.expectOne({
      url: mockedEndpoints.refreshToken,
      method: 'POST'
    });
    req.flush(null, mockedError);
    httpTestingController.verify();
  });

  it('should request refresh token if error status is 403 and repeat request with credentials if refresh request was successful', () => {
    http.post(mockedUrl, { data: 1 }).subscribe(
      () => {
        expect(
          authenticationServiceSpy.requestRefreshToken
        ).toHaveBeenCalledTimes(1);
        expect(
          authenticationServiceSpy.addCredentialsToRequest
        ).toHaveBeenCalledTimes(1);
      },
      () => {
        fail('Should not throw error');
      }
    );

    const req = httpTestingController.expectOne({
      url: mockedUrl,
      method: 'POST'
    });
    req.flush(null, { ...mockedError, status: 401 });

    const reqCloned = httpTestingController.expectOne({
      url: mockedRequest.url,
      method: mockedRequest.method
    });
    reqCloned.flush({});

    httpTestingController.verify();
  });

  it(
    'should request refresh token and call authenticationService.logout' +
      ' if error status is 403 and throw error if request refresh request was not successful',
    () => {
      authenticationServiceSpy.requestRefreshToken.and.returnValue(
        of(new HttpErrorResponse({ status: 401, statusText: 'Invalid token' }))
      );

      http.post(mockedUrl, {}).subscribe(
        () => {
          fail('Should throw error');
        },
        (error: HttpErrorResponse) => {
          expect(error.status).toBe(401);
          expect(error.statusText).toBe('Unauthorized');
          expect(authenticationServiceSpy.logout).toHaveBeenCalledTimes(1);
        }
      );

      const req = httpTestingController.expectOne({
        url: mockedUrl,
        method: 'POST'
      });
      req.flush(null, { status: 401, statusText: 'Unauthorized' });

      const reqCloned = httpTestingController.expectOne({
        url: mockedRequest.url,
        method: mockedRequest.method
      });
      reqCloned.flush(null, { status: 401, statusText: 'Unauthorized' });

      httpTestingController.verify();
    }
  );
});
