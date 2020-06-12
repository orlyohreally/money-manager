import { HttpErrorResponse } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatCheckboxModule,
  MatError,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSuffix
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from '@src/app/app-routing.module';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { MockComponent, MockDirective, MockHelper } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
// tslint:disable-next-line: max-line-length
import { GoogleAnalyticsService } from '@core-client/services/google-analytics/google-analytics.service';
// tslint:disable-next-line: max-line-length
import { ContentWithLoaderComponent } from '@shared-client/components/content-with-loader/content-with-loader.component';
// tslint:disable-next-line: max-line-length
import { NotificationBlockDirective } from '@shared-client/directives/notification-block.directive';
// tslint:disable-next-line: max-line-length
import { GoogleAnalyticsServiceMock } from '@tests-utils/mocks/google-analytics.service.spec';
import { SignInFormComponent } from './sign-in-form.component';

describe('SignInFormComponent', () => {
  let component: SignInFormComponent;
  let fixture: ComponentFixture<SignInFormComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let googleAnalyticsServiceSpy: jasmine.SpyObj<GoogleAnalyticsService>;
  let router: Router;

  beforeEach(async(() => {
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', [
      'register',
      'logout'
    ]);
    authServiceSpy.register.and.returnValue(
      cold('---a', {
        a: { verificationToken: 'verification-token' }
      })
    );
    googleAnalyticsServiceSpy = GoogleAnalyticsServiceMock().getService();

    TestBed.configureTestingModule({
      declarations: [
        SignInFormComponent,
        MockDirective(NotificationBlockDirective),
        MockComponent(ContentWithLoaderComponent)
      ],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy },
        { provide: GoogleAnalyticsService, useValue: googleAnalyticsServiceSpy }
      ],
      imports: [
        AppRoutingModule,
        FlexLayoutModule,
        MatIconModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatInputModule,
        FormsModule,
        NoopAnimationsModule,
        RouterTestingModule
      ]
    });
  }));
  beforeEach(() => {
    TestBed.compileComponents();
    fixture = TestBed.createComponent(SignInFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
    spyOn(router, 'navigate');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call register when valid form is submitted', () => {
    spyOn(component, 'register');
    setField('email', 'email@gmail.com');
    setField('lastName', 'lastNameMock');
    setField('firstName', 'firstNameMock');
    setField('password', 'Ab123*(&');
    setField('passwordVerification', 'Ab123*(&');
    submitForm();
    expect(component.register).toHaveBeenCalledTimes(1);
  });

  it(
    'register should call authenticationService.register' + ' for valid form',
    () => {
      setField('email', 'validEmail@gmail.com');
      setField('lastName', 'lastNameMock');
      setField('firstName', 'firstNameMock');
      setField('password', 'Ab123*(&');
      setField('passwordVerification', 'Ab123*(&');
      submitForm();
      expect(authServiceSpy.register).toHaveBeenCalledTimes(1);
      expect(authServiceSpy.register).toHaveBeenCalledWith({
        email: 'validEmail@gmail.com',
        password: 'Ab123*(&',
        firstName: 'firstNameMock',
        lastName: 'lastNameMock'
      });
    }
  );

  it(
    'register should call authenticationService.register' + ' for valid form',
    () => {
      setEmail('valid-email@gmail.com');
      setField('firstName', 'firstNameMock');
      setField('lastName', 'lastNameMock');
      setField('password', 'dbv38rhu*(dbchsHFSJ');
      setField('passwordVerification', 'dbv38rhu*(dbchsHFSJ');
      submitForm();
      expect(authServiceSpy.register).toHaveBeenCalledTimes(1);
      expect(authServiceSpy.register).toHaveBeenCalledWith({
        email: 'valid-email@gmail.com',
        password: 'dbv38rhu*(dbchsHFSJ',
        firstName: 'firstNameMock',
        lastName: 'lastNameMock'
      });
    }
  );

  it(
    'register should not call authenticationService.register' +
      ' when email is invalid (email - invalidEmail.com)',
    () => {
      setField('email', 'invalidEmail.com');
      setField('firstName', 'firstNameMock');
      setField('lastName', 'lastNameMock');
      setField('password', 'ValidPassword1_');
      setField('passwordVerification', 'ValidPassword1_');
      submitForm();
      expect(authServiceSpy.register).not.toHaveBeenCalled();
    }
  );

  it(
    'register should not call authenticationService.register' +
      ' when email is invalid (email - invalid@Emailcom)',
    () => {
      setField('email', 'invalid@Emailcom');
      setField('firstName', 'firstNameMock');
      setField('lastName', 'lastNameMock');
      setField('passwordVerification', 'ValidPassword1_');
      setField('password', 'ValidPassword1_');
      submitForm();
      expect(authServiceSpy.register).not.toHaveBeenCalled();
    }
  );

  it(
    'register should not call authenticationService.register' +
      ' when email is invalid (email - invalidEmailcom)',
    () => {
      setEmail('invalidEmailcom');
      setField('firstName', 'firstNameMock');
      setField('lastName', 'lastNameMock');
      setField('password', 'ValidPassword1_');
      setField('passwordVerification', 'ValidPassword1_');
      submitForm();
      expect(authServiceSpy.register).not.toHaveBeenCalled();
    }
  );

  it(
    'register should not call authenticationService.register' +
      ' when password is invalid (password - abc12D*)',
    () => {
      setEmail('validEmail@gmail.com');
      setField('firstName', 'firstNameMock');
      setField('lastName', 'lastNameMock');
      setField('password', 'abc12D*');
      setField('passwordVerification', 'abc12D*');
      submitForm();
      expect(authServiceSpy.register).not.toHaveBeenCalled();
    }
  );

  it(
    'register should not call authenticationService.register' +
      ' when password is invalid (password - 12345678)',
    () => {
      setEmail('validEmail@gmail.com');
      setField('firstName', 'firstNameMock');
      setField('lastName', 'lastNameMock');
      setField('passwordVerification', '12345678');
      setField('password', '12345678');
      submitForm();
      expect(authServiceSpy.register).not.toHaveBeenCalled();
    }
  );

  it(
    'register should not call authenticationService.register' +
      ' when password is invalid (password - dca8fyh2%)',
    () => {
      setEmail('validEmail@gmail.com');
      setField('firstName', 'firstNameMock');
      setField('lastName', 'lastNameMock');
      setField('passwordVerification', 'dca8fyh2%');
      setField('password', 'dca8fyh2%');
      submitForm();
      expect(authServiceSpy.register).not.toHaveBeenCalled();
    }
  );

  it(
    'should display error' +
      ' when authenticationService.register returns error',
    () => {
      authServiceSpy.register.and.returnValue(
        cold('--#', null, new HttpErrorResponse({ error: 'error message' }))
      );
      setField('email', 'valid-email@gmail.com');
      setField('password', 'dbv38rhu*(dbchsHFSJ');
      setField('passwordVerification', 'dbv38rhu*(dbchsHFSJ');
      setField('firstName', 'firstNameMock');
      setField('lastName', 'lastNameMock');
      submitForm();
      getTestScheduler().flush();
      fixture.detectChanges();
      const errorEl: DebugElement = fixture.debugElement.query(
        By.directive(NotificationBlockDirective)
      );
      expect(errorEl.nativeElement.textContent.trim()).toBe('error message');
      const messageDirective = MockHelper.getDirective(
        fixture.debugElement.query(By.directive(NotificationBlockDirective)),
        NotificationBlockDirective
      );
      expect(messageDirective.type).toBe('error');
    }
  );

  it(
    'submit button should not be disabled after submitting' +
      ' when authenticationService.register returns error',
    () => {
      authServiceSpy.register.and.returnValue(
        cold('--#', null, new HttpErrorResponse({ error: 'error message' }))
      );
      setEmail('valid-email@gmail.com');
      setField('firstName', 'firstNameMock');
      setField('lastName', 'lastNameMock');
      setField('password', 'dbv38rhu*(dbchsHFSJ');
      setField('passwordVerification', 'dbv38rhu*(dbchsHFSJ');
      submitForm();
      getTestScheduler().flush();
      fixture.detectChanges();
      authServiceSpy.register.calls.reset();
      submitForm();
      getTestScheduler().flush();
      expect(authServiceSpy.register).toHaveBeenCalledTimes(1);
    }
  );

  it(
    'should display button with icon to show password' + ' when it is hidden',
    () => {
      const passwordEl = getPasswordInput();
      expect(passwordEl.type).toBe('password');
      const buttonEl: HTMLElement = fixture.debugElement.queryAll(
        By.directive(MatSuffix)
      )[0].nativeElement;
      buttonEl.click();
      fixture.detectChanges();
      expect(passwordEl.type).toBe('text');
      buttonEl.click();
      fixture.detectChanges();
      expect(passwordEl.type).toBe('password');
    }
  );

  it(
    'should display button with icon to show password verification' +
      ' when it is hidden',
    () => {
      const passwordEl = getPasswordVerificationInput();
      expect(passwordEl.type).toBe('password');
      const buttonEl: HTMLElement = fixture.debugElement.queryAll(
        By.directive(MatSuffix)
      )[1].nativeElement;
      buttonEl.click();
      fixture.detectChanges();
      expect(passwordEl.type).toBe('text');
      buttonEl.click();
      fixture.detectChanges();
      expect(passwordEl.type).toBe('password');
    }
  );

  it(
    'should highlight password requirements' +
      ' when password does not match it and shadow it when does',
    () => {
      let hints = fixture.nativeElement.querySelectorAll('.password-hint');
      expect(hints.length).toBe(5);
      let hintsShadowed = fixture.nativeElement.querySelectorAll(
        '.password-hint_shadowed'
      );
      expect(hintsShadowed.length).toBe(0);
      setField('password', 'dbv38rhu*(dbchsHFSJ');
      fixture.detectChanges();
      hints = fixture.nativeElement.querySelectorAll('.password-hint');
      expect(hints.length).toBe(5);
      hintsShadowed = fixture.nativeElement.querySelectorAll(
        '.password-hint_shadowed'
      );
      expect(hintsShadowed.length).toBe(5);
    }
  );

  it(
    'should highlight "One uppercase character"' +
      ' when password does not match it and shadow it when does',
    () => {
      setField('password', 'S');
      fixture.detectChanges();
      const hints = fixture.nativeElement.querySelectorAll('.password-hint');
      expect(hints.length).toBe(5);
      const hintsShadowed = fixture.nativeElement.querySelectorAll(
        '.password-hint_shadowed'
      );
      expect(hintsShadowed.length).toBe(1);
      expect(hintsShadowed[0].textContent.trim()).toBe(
        'One uppercase character'
      );
    }
  );

  it(
    'should highlight "One lowercase character"' +
      ' when password does not match it and shadow it when does',
    () => {
      setField('password', 'l');
      fixture.detectChanges();
      const hints = fixture.nativeElement.querySelectorAll('.password-hint');
      expect(hints.length).toBe(5);
      const hintsShadowed = fixture.nativeElement.querySelectorAll(
        '.password-hint_shadowed'
      );
      expect(hintsShadowed.length).toBe(1);
      expect(hintsShadowed[0].textContent.trim()).toBe(
        'One lowercase character'
      );
    }
  );

  it(
    'should highlight "One number"' +
      ' when password does not match it and shadow it when does',
    () => {
      setField('password', '2');
      fixture.detectChanges();
      const hints = fixture.nativeElement.querySelectorAll('.password-hint');
      expect(hints.length).toBe(5);
      const hintsShadowed = fixture.nativeElement.querySelectorAll(
        '.password-hint_shadowed'
      );
      expect(hintsShadowed.length).toBe(1);
      expect(hintsShadowed[0].textContent.trim()).toBe('One number');
    }
  );

  it(
    'should highlight "One special character"' +
      ' when password does not match it and shadow it when does',
    () => {
      setField('password', '_');
      fixture.detectChanges();
      const hints = fixture.nativeElement.querySelectorAll('.password-hint');
      expect(hints.length).toBe(5);
      const hintsShadowed = fixture.nativeElement.querySelectorAll(
        '.password-hint_shadowed'
      );
      expect(hintsShadowed.length).toBe(1);
      expect(hintsShadowed[0].textContent.trim()).toBe('One special character');
    }
  );

  it(
    'should highlight "8 characters minimum"' +
      ' when password does not match it and shadow it when does',
    () => {
      setField('password', 'abcdefgh');
      fixture.detectChanges();
      const hints = fixture.nativeElement.querySelectorAll('.password-hint');
      expect(hints.length).toBe(5);
      const hintsShadowed = fixture.nativeElement.querySelectorAll(
        '.password-hint_shadowed'
      );
      expect(hintsShadowed.length).toBe(2);
      expect(hintsShadowed[0].textContent.trim()).toBe(
        'One lowercase character'
      );
      expect(hintsShadowed[1].textContent.trim()).toBe('8 characters minimum');
    }
  );

  it(
    'should display error' +
      ' when password verification input value does not match password value',
    () => {
      setField('password', '123');
      setField('passwordVerification', '12');
      component.passwordVerification.markAsTouched();
      fixture.detectChanges();
      const errorEl: HTMLElement = fixture.debugElement.query(
        By.directive(MatError)
      ).nativeElement;
      expect(errorEl).toBeTruthy();
      expect(errorEl.textContent.trim()).toBe('Passwords do not match');
    }
  );

  it('should display error when email is not valid', () => {
    setField('email', 'invalid');
    component.email.markAsTouched();
    fixture.detectChanges();
    const errorEl: HTMLElement = fixture.debugElement.query(
      By.directive(MatError)
    ).nativeElement;
    expect(errorEl).toBeTruthy();
    expect(errorEl.textContent.trim()).toBe('Invalid email');
  });

  it('should call authenticationService.logout on create', () => {
    expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
  });

  it(
    'should redirect to /auth/email-verification-request' +
      ' when authenticationService.register returns response',
    () => {
      setField('email', 'valid-email@gmail.com');
      setField('password', 'dbv38rhu*(dbchsHFSJ');
      setField('firstName', 'firstNameMock');
      setField('lastName', 'lastNameMock');
      setField('passwordVerification', 'dbv38rhu*(dbchsHFSJ');
      submitForm();
      getTestScheduler().flush();
      fixture.detectChanges();
      expect(router.navigate).toHaveBeenCalledTimes(1);
      expect(router.navigate).toHaveBeenCalledWith(
        ['/auth/email-verification-request'],
        {
          queryParams: {
            email: 'valid-email@gmail.com',
            'verification-token': 'verification-token'
          }
        }
      );
    }
  );

  it('register should call googleAnalytics.event when submitting form', () => {
    setEmail('valid-email@gmail.com');
    setField('firstName', 'firstNameMock');
    setField('lastName', 'lastNameMock');
    setField('password', 'dbv38rhu*(dbchsHFSJ');
    setField('passwordVerification', 'dbv38rhu*(dbchsHFSJ');
    submitForm();
    expect(googleAnalyticsServiceSpy.event).toHaveBeenCalledTimes(1);
    expect(googleAnalyticsServiceSpy.event).toHaveBeenCalledWith('register', {
      email: 'valid-email@gmail.com',
      firstName: 'firstNameMock',
      lastName: 'lastNameMock'
    });
  });

  function getEmailInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector(
      'input[formControlName="email"]'
    );
  }

  function setEmail(email: string) {
    const emailField: HTMLInputElement = fixture.nativeElement.querySelector(
      'input[formControlName="email"]'
    );
    emailField.value = email;
    emailField.dispatchEvent(new Event('input'));
  }

  function setField(fieldName: string, value: string) {
    const emailField: HTMLInputElement = fixture.nativeElement.querySelector(
      `input[formControlName="${fieldName}"]`
    );
    emailField.value = value;
    emailField.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function getPasswordInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector(
      'input[formControlName="password"]'
    );
  }

  function getPasswordVerificationInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector(
      'input[formControlName="passwordVerification"]'
    );
  }

  function submitForm() {
    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    submitButton.click();
  }
});
