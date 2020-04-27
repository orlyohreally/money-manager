import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '../authentication/authentication.service';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { UserManagerService } from './user-manager.service';

describe('UserManagerService', () => {
  let service: UserManagerService;
  let httpTestingController: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', [
      'setUser'
    ]);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: GlobalVariablesService, useValue: { apiURL: 'apiURL' } },
        { provide: Router, useValue: routerSpy },
        { provide: AuthenticationService, useValue: authenticationServiceSpy }
      ]
    });
    service = TestBed.get(UserManagerService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
