import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';
import { ManagerComponent } from './manager.component';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
// tslint:disable-next-line: max-line-length
import { NotificationsService } from '@core-client/services/notifications/notifications.service';
// tslint:disable-next-line: max-line-length
import { UserManagerService } from '@core-client/services/user-manager/user-manager.service';
// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
import {
  AuthenticationServiceMock,
  getNotificationsSpy,
  UserManagerServiceMock
} from '@src/app/tests-utils/mocks';
import { UserFormComponent } from '../user-form/user-form.component';

describe('ManagerComponent', () => {
  let component: ManagerComponent;
  let fixture: ComponentFixture<ManagerComponent>;

  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let userManagerServiceSpy: jasmine.SpyObj<UserManagerService>;
  let notificationsServiceSpy: jasmine.SpyObj<NotificationsService>;

  const authServiceMock = AuthenticationServiceMock();
  const userManagerServiceMock = UserManagerServiceMock();

  beforeEach(async(() => {
    authServiceSpy = authServiceMock.service;
    userManagerServiceSpy = userManagerServiceMock.service;
    notificationsServiceSpy = getNotificationsSpy();

    TestBed.configureTestingModule({
      declarations: [
        ManagerComponent,
        MockComponent(LoaderComponent),
        MockComponent(UserFormComponent)
      ],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: UserManagerService, useValue: userManagerServiceSpy },
        { provide: NotificationsService, useValue: notificationsServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
