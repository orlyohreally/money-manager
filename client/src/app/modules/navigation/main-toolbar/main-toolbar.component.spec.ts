import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatIconModule,
  MatMenuModule,
  MatToolbarModule
} from '@angular/material';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
// tslint:disable-next-line: max-line-length
import { UserManagerService } from '@core-client/services/user-manager/user-manager.service';
// tslint:disable-next-line: max-line-length
import {
  AuthenticationServiceMock,
  UserManagerServiceMock
} from '@tests-utils/mocks';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { MainToolbarComponent } from './main-toolbar.component';

describe('MainToolbarComponent', () => {
  let component: MainToolbarComponent;
  let fixture: ComponentFixture<MainToolbarComponent>;
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let userManagerServiceSpy: jasmine.SpyObj<UserManagerService>;

  const authenticationServiceMock = AuthenticationServiceMock();
  const userManagerServiceMock = UserManagerServiceMock();

  beforeEach(async(() => {
    authenticationServiceSpy = authenticationServiceMock.service;
    userManagerServiceSpy = userManagerServiceMock.service;

    TestBed.configureTestingModule({
      declarations: [MainToolbarComponent, MockComponent(UserMenuComponent)],
      imports: [MatIconModule, MatToolbarModule, MatMenuModule],
      providers: [
        { provide: AuthenticationService, useValue: authenticationServiceSpy },
        { provide: UserManagerService, useValue: userManagerServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
