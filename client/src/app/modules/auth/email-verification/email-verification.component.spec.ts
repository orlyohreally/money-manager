import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpErrorResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { expectTextContentToBe } from '@tests-utils/functions';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { MockHelper } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
// tslint:disable-next-line: max-line-length
import { NotificationBlockDirective } from '@shared-client/directives/notification-block.directive';
import { SharedModule } from '@shared-client/shared.module';
import { EmailVerificationComponent } from './email-verification.component';

describe('EmailVerificationComponent', () => {
  let component: EmailVerificationComponent;
  let fixture: ComponentFixture<EmailVerificationComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async(() => {
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', [
      'verifyEmail'
    ]);
    authServiceSpy.verifyEmail.and.returnValue(cold('---a', { a: undefined }));
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [EmailVerificationComponent],
      imports: [SharedModule],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({
                email: 'email@gmail.com',
                token: 'token'
              })
            }
          }
        }
      ]
    });
  }));

  describe('email or token is not provided', () => {
    it('should redirect to / page if token is not provided in URL', () => {
      TestBed.overrideProvider(ActivatedRoute, {
        useValue: {
          snapshot: {
            queryParamMap: convertToParamMap({
              email: 'email@gmail.com'
            })
          }
        }
      });

      TestBed.compileComponents();
      createComponent();
      expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });

    it('should redirect to / page if email is not provided in URL', () => {
      TestBed.overrideProvider(ActivatedRoute, {
        useValue: {
          snapshot: {
            queryParamMap: convertToParamMap({
              token: 'token'
            })
          }
        }
      });
      TestBed.compileComponents();
      createComponent();
      expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('All query params are provided', () => {
    beforeEach(async () => {
      TestBed.compileComponents();
    });

    describe('Verification returns error', () => {
      beforeEach(() => {
        fixture = TestBed.createComponent(EmailVerificationComponent);
        component = fixture.componentInstance;
        authServiceSpy.verifyEmail.and.returnValue(
          cold('--#', null, new HttpErrorResponse({ error: 'Error message' }))
        );
        fixture.detectChanges();
      });

      it(
        'should display error message' +
          ' if authService.verifyEmail call returns error',
        () => {
          getTestScheduler().flush();
          fixture.detectChanges();
          const errorEl: HTMLElement = fixture.debugElement.query(
            By.directive(NotificationBlockDirective)
          ).nativeElement;
          expectTextContentToBe(errorEl, 'Error message');
          const messageDirective = MockHelper.getDirective(
            fixture.debugElement.query(
              By.directive(NotificationBlockDirective)
            ),
            NotificationBlockDirective
          );
          expect(messageDirective.type).toBe('error');
        }
      );
    });

    describe('Verification is successful', () => {
      beforeEach(() => {
        createComponent();
      });

      it('should create', () => {
        expect(component).toBeTruthy();
      });

      it(
        'should display "Verifying your email..."' + ' while verifying email',
        () => {
          expectTextContentToBe(
            fixture.nativeElement,
            'Verifying your email...'
          );
        }
      );

      it(
        'should redirect to / page' +
          ' if authService.verifyEmail call is successful',
        () => {
          getTestScheduler().flush();
          expect(routerSpy.navigate).toHaveBeenCalledTimes(1);
          expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
        }
      );
    });
  });

  function createComponent() {
    fixture = TestBed.createComponent(EmailVerificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }
});
