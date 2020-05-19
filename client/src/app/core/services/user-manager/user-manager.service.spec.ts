import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

// tslint:disable-next-line: max-line-length
import { User } from '@shared/types';
import {
  AuthenticationServiceMock,
  MembersServiceMock,
  UserManagerServiceMock
} from '@src/app/tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '../authentication/authentication.service';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { MembersService } from '../members/members.service';
import { UserManagerService } from './user-manager.service';

describe('UserManagerService', () => {
  let service: UserManagerService;
  let httpTestingController: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let membersServiceSpy: jasmine.SpyObj<MembersService>;

  const userManagerServiceMock = UserManagerServiceMock();

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    authenticationServiceSpy = AuthenticationServiceMock().getService();
    membersServiceSpy = MembersServiceMock().getService();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: GlobalVariablesService, useValue: { apiURL: 'apiURL' } },
        { provide: Router, useValue: routerSpy },
        { provide: AuthenticationService, useValue: authenticationServiceSpy },
        { provide: MembersService, useValue: membersServiceSpy }
      ]
    });
    service = TestBed.get(UserManagerService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('updateUser should make PUT request to api/users/update/:userId', done => {
    const mockedUser: User = {
      ...userManagerServiceMock.user,
      lastName: 'Samuel',
      icon: 'icon-1-new.png'
    };
    const response = { user: { ...mockedUser, updatedAt: new Date() } };

    service.updateUser(mockedUser).subscribe(() => {
      done();
    });

    const req = httpTestingController.expectOne({
      url: `apiURL/users/update/${mockedUser._id}`,
      method: 'PUT'
    });
    expect(req.request.body).toEqual({ userSettings: mockedUser });
    req.flush(response);
  });

  it('updateUser should call membersService.updateMember', done => {
    const mockedUser: User = {
      ...userManagerServiceMock.user,
      lastName: 'Samuel',
      icon: 'icon-1-new.png'
    };
    const response = { user: { ...mockedUser, updatedAt: new Date() } };

    service.updateUser(mockedUser).subscribe(() => {
      expect(membersServiceSpy.updateMember).toHaveBeenCalledTimes(1);
      expect(membersServiceSpy.updateMember).toHaveBeenCalledWith(
        response.user._id,
        response.user
      );
      done();
    });

    const req = httpTestingController.expectOne({
      url: `apiURL/users/update/${mockedUser._id}`,
      method: 'PUT'
    });
    req.flush(response);
  });
});
