import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
// tslint:disable-next-line: max-line-length
import { UserManagerService } from '@core-client/services/user-manager/user-manager.service';
// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
import {
  AuthenticationServiceMock,
  UserManagerServiceMock
} from '@tests-utils/mocks';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { UserMenuOpenerComponent } from './user-menu-opener.component';

describe('UserMenuOpenerComponent', () => {
  let component: UserMenuOpenerComponent;
  let fixture: ComponentFixture<UserMenuOpenerComponent>;
  let userManagerServiceSpy: jasmine.SpyObj<UserManagerService>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;

  const userManagerServiceMock = UserManagerServiceMock();
  const authServiceMock = AuthenticationServiceMock();

  beforeEach(async(() => {
    userManagerServiceSpy = userManagerServiceMock.service;
    authServiceSpy = authServiceMock.getService();

    TestBed.configureTestingModule({
      declarations: [
        UserMenuOpenerComponent,
        MockComponent(UserMenuComponent),
        MockComponent(LoaderComponent)
      ],
      providers: [
        { provide: UserManagerService, useValue: userManagerServiceSpy },
        { provide: AuthenticationService, useValue: authServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserMenuOpenerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
