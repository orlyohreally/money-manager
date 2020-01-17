import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpRequest } from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let http: HttpClient;
  let httpTestingController: HttpTestingController;

  const mockedRequest = new HttpRequest<{}>('POST', 'mocked-url-1', null);

  beforeEach(() => {
    authenticationServiceSpy = {
      ...jasmine.createSpyObj('AuthenticationService', [
        'addCredentialsToRequest'
      ])
    } as jasmine.SpyObj<AuthenticationService>;
    authenticationServiceSpy.addCredentialsToRequest.and.returnValue(
      mockedRequest
    );

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
    'should return request returned' +
      ' from authenticationService.addCredentialsToRequest',
    () => {
      http.get('/mocked-url').subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpTestingController.expectOne(mockedRequest.url);
      expect(req.request).toBe(mockedRequest);
      req.flush({});

      httpTestingController.verify();
    }
  );
});
