import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
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
// tslint:disable-next-line: max-line-length
import { UserMenuOpenerComponent } from '../user-menu-opener/user-menu-opener.component';
import { MainToolbarComponent } from './main-toolbar.component';

describe('MainToolbarComponent', () => {
  let component: MainToolbarComponent;
  let fixture: ComponentFixture<MainToolbarComponent>;
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let userManagerServiceSpy: jasmine.SpyObj<UserManagerService>;

  const authenticationServiceMock = AuthenticationServiceMock();
  const userManagerServiceMock = UserManagerServiceMock();

  beforeEach(async(() => {
    authenticationServiceSpy = authenticationServiceMock.getService();
    userManagerServiceSpy = userManagerServiceMock.service;

    TestBed.configureTestingModule({
      declarations: [
        MainToolbarComponent,
        MockComponent(UserMenuOpenerComponent)
      ],
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
