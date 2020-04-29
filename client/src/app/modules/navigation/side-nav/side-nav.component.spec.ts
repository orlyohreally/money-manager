import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
import { AuthenticationServiceMock } from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { SideNavAuthenticatedUserComponent } from '../side-nav-authenticated-user/side-nav-authenticated-user.component';
// tslint:disable-next-line: max-line-length
import { SideNavUnauthenticatedUserComponent } from '../side-nav-unauthenticated-user/side-nav-unauthenticated-user.component';
import { SideNavComponent } from './side-nav.component';

describe('SideNavComponent', () => {
  let component: SideNavComponent;
  let fixture: ComponentFixture<SideNavComponent>;
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;

  const authenticationServiceMock = AuthenticationServiceMock();

  beforeEach(async(() => {
    authenticationServiceSpy = authenticationServiceMock.getService();

    TestBed.configureTestingModule({
      declarations: [
        SideNavComponent,
        MockComponent(SideNavAuthenticatedUserComponent),
        MockComponent(SideNavUnauthenticatedUserComponent)
      ],
      providers: [
        { provide: AuthenticationService, useValue: authenticationServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
