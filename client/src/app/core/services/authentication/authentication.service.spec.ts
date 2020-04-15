import { HttpRequest } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from '@shared/types';
// tslint:disable-next-line: ordered-imports
import { AppModule } from '@src/app/app.module';
import { LocalStorageService } from 'ngx-localstorage';
import { take } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let httpTestingController: HttpTestingController;

  const mockedUser: User = {
    lastName: 'lastNameMock',
    firstName: 'firstNameMock',
    email: 'emailMock',
    password: 'password'
  } as User;

  beforeEach(() => {
    localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', [
      'set',
      'get'
    ]);
    localStorageServiceSpy.get.and.returnValue(null);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AppModule],
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: GlobalVariablesService, useValue: { apiURL: 'apiURL' } }
      ]
    });
  });

  it('should be created', () => {
    createService();
    expect(service).toBeTruthy();
  });

  it('should be created', () => {
    createService();
    expect(service).toBeTruthy();
  });

  it('token should be fetched from local storage', () => {
    createService();
    expect(localStorageServiceSpy.get).toHaveBeenCalledTimes(1);
    expect(localStorageServiceSpy.get).toHaveBeenCalledWith(
      'user_token',
      'money-manager'
    );
  });

  it(
    'isAuthenticated should return true' +
      ' when token is set in local storage',
    () => {
      localStorageServiceSpy.get.and.returnValue('{"token":"savedToken"}');
      createService();
      const scheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
      scheduler.run(({ expectObservable }) => {
        expectObservable(service.isAuthenticated()).toBe('a', { a: true });
      });
    }
  );

  it(
    'isAuthenticated should return false' +
      ' when token is not set in local storage',
    () => {
      localStorageServiceSpy.get.and.returnValue(null);
      createService();
      const scheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
      });
      scheduler.run(({ expectObservable }) => {
        expectObservable(service.isAuthenticated()).toBe('a', { a: false });
      });
    }
  );

  it(
    'register should return Observable of response' + ' from api/users/signin',
    () => {
      createService();
      const mockedResponse = {
        email: 'email@gmail.com',
        verificationToken: 'verificationToken'
      };
      service
        .register(mockedUser)
        .subscribe((response: { email: string; verificationToken: string }) => {
          expect(response).toBe(mockedResponse);
        });

      const mockReq = httpTestingController.expectOne('apiURL/users/signin');
      mockReq.flush(mockedResponse);
      httpTestingController.verify();
    }
  );

  it(
    'login should set token and refresh token in local storage fetched' +
      ' from Authorization header of response' +
      ' from api/users/login',
    () => {
      createService();
      service
        .login({ email: mockedUser.email, password: 'passwordMock' })
        .subscribe(() => {
          expect(localStorageServiceSpy.set).toHaveBeenCalledTimes(1);
          expect(localStorageServiceSpy.set).toHaveBeenCalledWith(
            'user_token',
            '{"token":"bearerToken","refreshToken":"refresh-token"}',
            'money-manager'
          );
        });

      const mockReq = httpTestingController.expectOne('apiURL/users/login');
      expect(mockReq.request.method).toBe('POST');
      mockReq.flush(
        { refreshToken: 'refresh-token' },
        {
          headers: { Authorization: 'bearerToken' },
          status: 200,
          statusText: 'OK'
        }
      );
      httpTestingController.verify();
    }
  );

  it(
    'login should make isAuthenticated return true' +
      ' when token was provided in header',
    () => {
      createService();
      service
        .login({ email: mockedUser.email, password: 'passwordMock' })
        .subscribe(() => {
          const scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
          });
          scheduler.run(({ expectObservable }) => {
            expectObservable(service.isAuthenticated().pipe(take(1))).toBe(
              '(a|)',
              {
                a: true
              }
            );
          });
        });

      const mockReq = httpTestingController.expectOne('apiURL/users/login');
      mockReq.flush(
        {},
        {
          headers: { Authorization: 'bearerToken' },
          status: 200,
          statusText: 'OK'
        }
      );
      httpTestingController.verify();
    }
  );

  it(
    'login should make isAuthenticated return false' +
      ' when token was not provided in header',
    () => {
      createService();
      service
        .login({ email: mockedUser.email, password: 'passwordMock' })
        .subscribe(() => {
          const scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
          });
          scheduler.run(({ expectObservable }) => {
            expectObservable(service.isAuthenticated().pipe(take(1))).toBe(
              '(a|)',
              {
                a: false
              }
            );
          });
        });

      const mockReq = httpTestingController.expectOne('apiURL/users/login');
      mockReq.flush({});
      httpTestingController.verify();
    }
  );

  it('login should return Observable of response from api/users/login', () => {
    createService();
    const mockedResponse = {
      user: { ...mockedUser }
    };

    service
      .login({ email: mockedUser.email, password: 'passwordMock' })
      .subscribe(response => {
        expect(response).toBe(mockedResponse.user);
      });

    const mockReq = httpTestingController.expectOne('apiURL/users/login');
    mockReq.flush(mockedResponse);
    httpTestingController.verify();
  });

  it(
    'addCredentialsToRequest should add header to request' +
      ' after login response has Authorization header',
    () => {
      createService();
      const mockedResponse = { user: { ...mockedUser } };
      service
        .login({ email: mockedUser.email, password: 'passwordMock' })
        .subscribe(() => {
          const mockedRequest = new HttpRequest<{}>('GET', '/mocked-url');
          const updatedRequest = service.addCredentialsToRequest(mockedRequest);
          expect(updatedRequest.headers.has('Authorization')).toBeTruthy();
          expect(updatedRequest.headers.get('Authorization')).toBe(
            `Bearer bearerToken`
          );
          expect(updatedRequest.method).toEqual(mockedRequest.method);
          expect(updatedRequest.url).toEqual(mockedRequest.url);
        });

      const mockReq = httpTestingController.expectOne({
        url: 'apiURL/users/login',
        method: 'POST'
      });
      mockReq.flush(mockedResponse, {
        headers: {
          Authorization: 'bearerToken'
        }
      });
    }
  );

  it(
    'addCredentialsToRequest should return cloned request' +
      ' if login response does not have Authorization header',
    () => {
      createService();
      const mockedResponse = {
        firstName: 'firstNameMock',
        lastName: 'lastNameMock'
      } as User;
      service
        .login({ email: mockedUser.email, password: 'passwordMock' })
        .subscribe(() => {
          const mockedRequest = new HttpRequest<{}>('GET', '/mocked-url');
          const updatedRequest = service.addCredentialsToRequest(mockedRequest);
          expect(updatedRequest).toBe(mockedRequest);
        });

      const mockReq = httpTestingController.expectOne({
        url: 'apiURL/users/login',
        method: 'POST'
      });
      mockReq.flush(mockedResponse);
    }
  );

  it(
    'requestRefreshToken should make isAuthenticated return true' +
      ' when token was provided in header',
    () => {
      createService();
      const mockedResponse = {
        firstName: 'firstNameMock',
        lastName: 'lastNameMock'
      } as User;
      service
        .login({ email: mockedUser.email, password: 'passwordMock' })
        .subscribe(() => {
          service.requestRefreshToken().subscribe(() => {
            const scheduler = new TestScheduler((actual, expected) => {
              expect(actual).toEqual(expected);
            });
            scheduler.run(({ expectObservable }) => {
              expectObservable(service.isAuthenticated().pipe(take(1))).toBe(
                '(a|)',
                {
                  a: true
                }
              );
            });
          });
        });

      const reqLogin = httpTestingController.expectOne({
        url: 'apiURL/users/login',
        method: 'POST'
      });
      reqLogin.flush(
        { ...mockedResponse, refreshToken: 'refreshToken' },
        {
          headers: { Authorization: 'oldBearerToken' },
          status: 200,
          statusText: 'OK'
        }
      );

      const mockReq = httpTestingController.expectOne({
        url: 'apiURL/users/refresh-token',
        method: 'POST'
      });
      expect(mockReq.request.body).toEqual({ refreshToken: 'refreshToken' });
      mockReq.flush(
        { refreshToken: 'refreshToken' },
        {
          headers: { Authorization: 'bearerToken' },
          status: 200,
          statusText: 'OK'
        }
      );
      httpTestingController.verify();
    }
  );

  it(
    'verifyEmail should make isAuthenticated return true' +
      ' when token was provided in header',
    () => {
      createService();
      service.verifyEmail('email@gmail.com', 'bearerToken').subscribe(() => {
        const scheduler = new TestScheduler((actual, expected) => {
          expect(actual).toEqual(expected);
        });
        scheduler.run(({ expectObservable }) => {
          expectObservable(service.isAuthenticated().pipe(take(1))).toBe(
            '(a|)',
            {
              a: true
            }
          );
        });
      });

      const mockReq = httpTestingController.expectOne('apiURL/users/verify');
      mockReq.flush(
        {},
        {
          headers: { Authorization: 'bearerToken' },
          status: 200,
          statusText: 'OK'
        }
      );
      httpTestingController.verify();
    }
  );

  function createService() {
    service = TestBed.get(AuthenticationService);
    httpTestingController = TestBed.get(HttpTestingController);
  }
});
