import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { MockHelper } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
// tslint:disable-next-line: max-line-length
import { NotificationBlockDirective } from '@shared-client/directives/notification-block.directive';
// tslint:disable-next-line: max-line-length
import { SharedModule } from '@shared-client/shared.module';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '@src/app/core/services/global-variables/global-variables.service';
import { expectTextContentToBe } from '@tests-utils/functions';
import { cold, getTestScheduler } from 'jasmine-marbles';
// tslint:disable-next-line: max-line-length
import { EmailVerificationRequestComponent } from './email-verification-request.component';

describe('EmailVerificationRequestComponent', () => {
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const debounceTime = 2000;

  beforeEach(async(() => {
    authenticationServiceSpy = jasmine.createSpyObj('AuthenticationService', [
      'sendEmailVerificationEmail'
    ]);
    authenticationServiceSpy.sendEmailVerificationEmail.and.returnValue(
      cold('--a', { a: undefined })
    );
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [EmailVerificationRequestComponent],
      imports: [SharedModule, MatIconModule],
      providers: [
        { provide: AuthenticationService, useValue: authenticationServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({
                email: 'email@gmail.com',
                'verification-token': 'token'
              })
            }
          }
        },
        {
          provide: GlobalVariablesService,
          useValue: { supportEmail: 'support-email@gmail.com' }
        }
      ]
    });
  }));

  describe('No email in url', () => {
    let component: EmailVerificationRequestComponent;
    let fixture: ComponentFixture<EmailVerificationRequestComponent>;

    beforeEach(async(() => {
      TestBed.overrideProvider(ActivatedRoute, {
        useValue: {
          snapshot: {
            queryParamMap: convertToParamMap({
              'verification-token': 'token'
            })
          }
        }
      }).compileComponents();
    }));

    beforeEach(() => {
      ({ fixture, component } = createComponent(fixture, component));
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should redirect to / page', () => {
      expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('No verification token in url', () => {
    let component: EmailVerificationRequestComponent;
    let fixture: ComponentFixture<EmailVerificationRequestComponent>;

    beforeEach(async(() => {
      TestBed.overrideProvider(ActivatedRoute, {
        useValue: {
          snapshot: {
            queryParamMap: convertToParamMap({
              email: 'email@gmail.com'
            })
          }
        }
      }).compileComponents();
    }));

    beforeEach(() => {
      ({ fixture, component } = createComponent(fixture, component));
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should redirect to / page', () => {
      expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('email and verification token provided in url', () => {
    let component: EmailVerificationRequestComponent;
    let fixture: ComponentFixture<EmailVerificationRequestComponent>;

    beforeEach(async () => {
      TestBed.compileComponents();
    });

    beforeEach(fakeAsync(() => {
      ({ fixture, component } = createComponent(fixture, component));
      tick(debounceTime);
      fixture.detectChanges();
    }));

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display title', () => {
      const titleEl: HTMLElement = fixture.nativeElement.querySelector('h1');
      expect(titleEl).toBeTruthy();
      expectTextContentToBe(titleEl, 'Activate your account');
    });

    it('should display loader when verification is being requested', () => {
      const getLoader = () =>
        fixture.debugElement.query(By.directive(LoaderComponent));
      expect(getLoader()).toBeFalsy();
      const verificationButton: HTMLButtonElement = getVerificationButton();
      verificationButton.click();
      fixture.detectChanges();
      expect(getLoader()).toBeTruthy();
      getTestScheduler().flush();
      fixture.detectChanges();
      expect(getLoader()).toBeFalsy();
    });

    it(
      'should display success message' +
        ' before button to request email verification has been pressed',
      () => {
        getTestScheduler().flush();
        fixture.detectChanges();
        const messageEl: DebugElement = fixture.debugElement.query(
          By.directive(NotificationBlockDirective)
        );
        expectTextContentToBe(
          messageEl.nativeElement,
          'Activate your account by verifying your email using link' +
            ' that has been sent to email email@gmail.com. ' +
            'If you do not receive the confirmation message' +
            ' within a few minutes of signing up, please check ' +
            'your Spam or Bulk E-Mail folder just in case' +
            ' the confirmation email got delivered there instead of your inbox.'
        );
        const messageDirective = MockHelper.getDirective(
          fixture.debugElement.query(By.directive(NotificationBlockDirective)),
          NotificationBlockDirective
        );
        expect(messageDirective.type).toBe('success');
      }
    );

    it(
      'should display success message' +
        ' when attempts of sending verification is less then max value',
      () => {
        getVerificationButton().click();
        getTestScheduler().flush();
        fixture.detectChanges();
        const messageEl: DebugElement = fixture.debugElement.query(
          By.directive(NotificationBlockDirective)
        );
        expectTextContentToBe(
          messageEl.nativeElement,
          'Email with link to verify your email has been sent' +
            ' to email email@gmail.com. ' +
            'If you do not receive the confirmation message' +
            ' within a few minutes of signing up, ' +
            'please check your Spam or Bulk E-Mail folder' +
            ' just in case the confirmation ' +
            'email got delivered there instead of your inbox.'
        );
        const messageDirective = MockHelper.getDirective(
          fixture.debugElement.query(By.directive(NotificationBlockDirective)),
          NotificationBlockDirective
        );
        expect(messageDirective.type).toBe('success');
      }
    );

    it(
      `should display button to send verification email again` +
        ` after ${debounceTime}ms before manual attempt`,
      () => {
        expect(getVerificationButton()).toBeTruthy();
      }
    );

    it(
      `should display button to send verification email again` +
        ` after ${debounceTime}ms after first manual attempt`,
      fakeAsync(() => {
        getVerificationButton().click();
        fixture.detectChanges();
        getTestScheduler().flush();
        fixture.detectChanges();
        expect(getVerificationButton()).toBeFalsy();
        tick(debounceTime);
        fixture.detectChanges();
        expect(getVerificationButton()).toBeTruthy();
      })
    );

    it(`should display button to send verification email again after ${2 *
      debounceTime}ms after second manual attempt`, fakeAsync(() => {
      clickRequestVerificationEmailButton(debounceTime);
      clickRequestVerificationEmailButton(2 * debounceTime);
      expect(getVerificationButton()).toBeTruthy();
    }));

    it(
      'should not display button to send verification email again' +
        ' after third (last) manual attempt',
      fakeAsync(() => {
        clickRequestVerificationEmailButton(debounceTime);
        clickRequestVerificationEmailButton(2 * debounceTime);
        clickRequestVerificationEmailButton(3 * debounceTime);
        fixture.detectChanges();
        expect(getVerificationButton()).toBeFalsy();
      })
    );

    it(
      'should display error message' +
        ' when attempts of sending verification is equal to max value',
      fakeAsync(() => {
        clickRequestVerificationEmailButton(debounceTime);
        clickRequestVerificationEmailButton(2 * debounceTime);
        clickRequestVerificationEmailButton(3 * debounceTime);
        const messageEl: DebugElement = fixture.debugElement.queryAll(
          By.directive(NotificationBlockDirective)
        )[1];
        expectTextContentToBe(
          messageEl.nativeElement,
          'If you still have not received email,' +
            ' contact us at support-email@gmail.com'
        );
        const messageDirective = MockHelper.getDirective(
          fixture.debugElement.queryAll(
            By.directive(NotificationBlockDirective)
          )[1],
          NotificationBlockDirective
        );
        expect(messageDirective.type).toBe('error');
      })
    );

    function getVerificationButton(): HTMLButtonElement {
      return fixture.nativeElement.querySelector('button');
    }

    function clickRequestVerificationEmailButton(expectedDebounceTime: number) {
      getVerificationButton().click();
      getTestScheduler().flush();
      tick(expectedDebounceTime);
      fixture.detectChanges();
    }
  });
});

function createComponent(
  fixture: ComponentFixture<EmailVerificationRequestComponent>,
  component: EmailVerificationRequestComponent
) {
  fixture = TestBed.createComponent(EmailVerificationRequestComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
  return { fixture, component };
}
