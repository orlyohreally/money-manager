import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from '@shared/types';
import { LocalStorageService } from 'ngx-localstorage';
import { take } from 'rxjs/operators';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;
  let httpController: HttpTestingController;

  beforeEach(() => {
    localStorageServiceSpy = jasmine.createSpyObj('LocalStorageService', [
      'set',
      'get'
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: LocalStorageService, useValue: localStorageServiceSpy },
        { provide: GlobalVariablesService, useValue: { apiURL: 'apiURL' } }
      ],
      imports: [HttpClientTestingModule]
    });
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
    done => {
      localStorageServiceSpy.get.and.returnValue('savedToken');
      createService();
      service.isAuthenticated().subscribe(isAuthenticated => {
        expect(isAuthenticated).toBe(true);
        done();
      });
    }
  );

  it(
    'isAuthenticated should return false' +
      ' when token is not set in local storage',
    done => {
      localStorageServiceSpy.get.and.returnValue('');
      createService();
      service.isAuthenticated().subscribe(isAuthenticated => {
        expect(isAuthenticated).toBe(false);
        done();
      });
    }
  );

  it(
    'register should set token in local storage fetched' +
      ' from Authorization header of response from api/users/signin',
    done => {
      createService();
      const mockedUser = {
        lastName: 'lastNameMock',
        firstName: 'firstNameMock',
        password: 'passwordMock',
        email: 'emailMock'
      } as User;
      service.register(mockedUser).subscribe(() => {
        expect(localStorageServiceSpy.set).toHaveBeenCalledTimes(1);
        expect(localStorageServiceSpy.set).toHaveBeenCalledWith(
          'user_token',
          'bearerToken',
          'money-manager'
        );
        done();
      });

      const mockReq = httpController.expectOne('apiURL/users/signin');

      expect(mockReq.request.method).toBe('POST');

      mockReq.flush(
        {},
        {
          headers: { Authorization: 'bearerToken' },
          status: 200,
          statusText: 'OK'
        }
      );

      httpController.verify();
    }
  );

  it(
    'register should make isAuthenticated return true' +
      ' when token was provided in header',
    done => {
      createService();
      const mockedUser = {
        lastName: 'lastNameMock',
        firstName: 'firstNameMock',
        password: 'passwordMock',
        email: 'emailMock'
      } as User;

      service.register(mockedUser).subscribe(() => {
        service
          .isAuthenticated()
          .pipe(take(1))
          .subscribe(isAuthenticated => {
            expect(isAuthenticated).toBe(true);
            done();
          });
      });
      const mockReq = httpController.expectOne('apiURL/users/signin');
      mockReq.flush(
        {},
        {
          headers: { Authorization: 'bearerToken' },
          status: 200,
          statusText: 'OK'
        }
      );
      httpController.verify();
    }
  );

  it(
    'register should make isAuthenticated return false' +
      ' when token was not provided in header',
    done => {
      createService();
      const mockedUser = {
        lastName: 'lastNameMock',
        firstName: 'firstNameMock',
        password: 'passwordMock',
        email: 'emailMock'
      } as User;

      service.register(mockedUser).subscribe(() => {
        service
          .isAuthenticated()
          .pipe(take(1))
          .subscribe(isAuthenticated => {
            expect(isAuthenticated).toBe(false);
            done();
          });
      });

      const mockReq = httpController.expectOne('apiURL/users/signin');
      mockReq.flush({});
      httpController.verify();
    }
  );

  it(
    'register should return Observable of response' + ' from api/users/signin',
    () => {
      createService();
      const mockedResponse = {
        firstName: 'firstNameMock',
        lastName: 'lastNameMock'
      } as User;

      const mockedUser = {
        lastName: 'lastNameMock',
        firstName: 'firstNameMock',
        password: 'passwordMock',
        email: 'emailMock'
      } as User;

      service.register(mockedUser).subscribe((user: User) => {
        expect(user).toBe(mockedResponse);
      });

      const mockReq = httpController.expectOne('apiURL/users/signin');
      mockReq.flush(mockedResponse);
      httpController.verify();
    }
  );

  it(
    'login should set token in local storage fetched' +
      ' from Authorization header of response from api/users/login',
    done => {
      createService();
      const mockedUser = {
        lastName: 'lastNameMock',
        firstName: 'firstNameMock',
        password: 'passwordMock',
        email: 'emailMock'
      } as User;
      service.login(mockedUser).subscribe(() => {
        expect(localStorageServiceSpy.set).toHaveBeenCalledTimes(1);
        expect(localStorageServiceSpy.set).toHaveBeenCalledWith(
          'user_token',
          'bearerToken',
          'money-manager'
        );
        done();
      });

      const mockReq = httpController.expectOne('apiURL/users/login');
      expect(mockReq.request.method).toBe('POST');
      mockReq.flush(
        {},
        {
          headers: { Authorization: 'bearerToken' },
          status: 200,
          statusText: 'OK'
        }
      );
      httpController.verify();
    }
  );

  it(
    'login should make isAuthenticated return true' +
      ' when token was provided in header',
    done => {
      createService();
      const mockedUser = {
        lastName: 'lastNameMock',
        firstName: 'firstNameMock',
        password: 'passwordMock',
        email: 'emailMock'
      } as User;
      service.login(mockedUser).subscribe(() => {
        service
          .isAuthenticated()
          .pipe(take(1))
          .subscribe(isAuthenticated => {
            expect(isAuthenticated).toBe(true);
            done();
          });
      });
      const mockReq = httpController.expectOne('apiURL/users/login');
      mockReq.flush(
        {},
        {
          headers: { Authorization: 'bearerToken' },
          status: 200,
          statusText: 'OK'
        }
      );
      httpController.verify();
    }
  );

  it(
    'login should make isAuthenticated return false' +
      ' when token was not provided in header',
    done => {
      createService();
      const mockedUser = {
        lastName: 'lastNameMock',
        firstName: 'firstNameMock',
        password: 'passwordMock',
        email: 'emailMock'
      } as User;
      service.login(mockedUser).subscribe(() => {
        service
          .isAuthenticated()
          .pipe(take(1))
          .subscribe(isAuthenticated => {
            expect(isAuthenticated).toBe(false);
            done();
          });
      });

      const mockReq = httpController.expectOne('apiURL/users/login');
      expect(mockReq.cancelled).toBeFalsy();
      mockReq.flush({});
      httpController.verify();
    }
  );

  it('login should return Observable of response from api/users/login', () => {
    createService();
    const mockedResponse = {
      firstName: 'firstNameMock',
      lastName: 'lastNameMock'
    } as User;

    const mockedUser = {
      lastName: 'lastNameMock',
      firstName: 'firstNameMock',
      password: 'passwordMock',
      email: 'emailMock'
    } as User;

    service.login(mockedUser).subscribe((user: User) => {
      expect(user).toBe(mockedResponse);
    });

    const mockReq = httpController.expectOne('apiURL/users/login');
    mockReq.flush(mockedResponse);
    httpController.verify();
  });

  function createService() {
    service = TestBed.get(AuthenticationService);
    httpController = TestBed.get(HttpTestingController);
  }
});
