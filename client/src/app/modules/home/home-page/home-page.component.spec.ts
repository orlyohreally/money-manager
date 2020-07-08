import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
// tslint:disable-next-line: max-line-length
import { AuthenticationServiceMock } from '@src/app/tests-utils/mocks';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;

  const authServiceMock = AuthenticationServiceMock();

  beforeEach(async(() => {
    authServiceSpy = authServiceMock.getService();

    TestBed.configureTestingModule({
      declarations: [HomePageComponent],
      providers: [
        {
          provide: AuthenticationService,
          useValue: authServiceSpy
        }
      ],
      imports: [RouterTestingModule, MatIconModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
