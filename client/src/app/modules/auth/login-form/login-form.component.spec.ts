import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpErrorResponse } from '@angular/common/http';
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
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
// tslint:disable-next-line: max-line-length
import { ErrorMessageComponent } from '@shared-client/components/error-message/error-message.component';
import { User } from '@shared/types';
import { AppRoutingModule } from '@src/app/app-routing.module';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { MockComponent } from 'ng-mocks';
import { LoginFormComponent } from './login-form.component';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: ComponentFixture<LoginFormComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let router: Router;

  beforeEach(async(() => {
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', [
      'login',
      'logout'
    ]);
    authServiceSpy.login.and.returnValue(
      cold('---a', { a: { firstName: 'firstName' } as User })
    );

    TestBed.configureTestingModule({
      declarations: [LoginFormComponent, MockComponent(ErrorMessageComponent)],
      providers: [
        { provide: AuthenticationService, useValue: authServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: convertToParamMap({}) }
          }
        }
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

  describe('returnUrl is not set', () => {
    beforeEach(() => {
      createComponent();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should display title', () => {
      const titleEl = fixture.nativeElement.querySelector('.mat-h1');
      expect(titleEl).toBeTruthy();
    });

    it('should display link to registration page', () => {
      const linkEl: HTMLAnchorElement = fixture.nativeElement.querySelector(
        'a[href="/auth/register"]'
      );
      expect(linkEl).toBeTruthy();
      expect(linkEl.textContent.trim()).toBe('Create an account');
    });

    it('should display input field for email', () => {
      expect(getEmailInput()).toBeTruthy();
    });

    it('should display input field for password', () => {
      expect(getPasswordInput()).toBeTruthy();
    });

    it('should call login when form is submitted', () => {
      spyOn(component, 'login');
      setEmail('email@gmail.com');
      setPassword('Ab123*(&');
      submitForm();
      expect(component.login).toHaveBeenCalledTimes(1);
    });

    it('login should call authenticationService.login for valid form', () => {
      setEmail('validEmail@gmail.com');
      setPassword('Ab123*(&');
      submitForm();
      expect(authServiceSpy.login).toHaveBeenCalledTimes(1);
      expect(authServiceSpy.login).toHaveBeenCalledWith({
        email: 'validEmail@gmail.com',
        password: 'Ab123*(&'
      });
    });

    it('login should call authenticationService.login for valid form', () => {
      setEmail('valid-email@gmail.com');
      setPassword('dbv38rhu*(dbchsHFSJ');
      submitForm();
      expect(authServiceSpy.login).toHaveBeenCalledTimes(1);
      expect(authServiceSpy.login).toHaveBeenCalledWith({
        email: 'valid-email@gmail.com',
        password: 'dbv38rhu*(dbchsHFSJ'
      });
    });

    it(
      'login should not call authenticationService.login' +
        ' when email is invalid (email - invalidEmail.com)',
      () => {
        setEmail('invalidEmail.com');
        setPassword('ValidPassword1_');
        submitForm();
        expect(authServiceSpy.login).not.toHaveBeenCalled();
      }
    );

    it(
      'login should not call authenticationService.login' +
        ' when email is invalid (email - invalid@Emailcom)',
      () => {
        setEmail('invalid@Emailcom');
        setPassword('ValidPassword1_');
        submitForm();
        expect(authServiceSpy.login).not.toHaveBeenCalled();
      }
    );

    it(
      'login should not call authenticationService.login' +
        ' when email is invalid (email - invalidEmailcom)',
      () => {
        setEmail('invalidEmailcom');
        setPassword('ValidPassword1_');
        submitForm();
        expect(authServiceSpy.login).not.toHaveBeenCalled();
      }
    );

    it(
      'login should not call authenticationService.login' +
        ' when password is not set',
      () => {
        setEmail('validEmail@gmail.com');
        submitForm();
        expect(authServiceSpy.login).not.toHaveBeenCalled();
      }
    );

    it(
      'should display error' +
        ' when authenticationService.login returns error',
      () => {
        authServiceSpy.login.and.returnValue(
          cold('--#', null, new HttpErrorResponse({ error: 'error message' }))
        );
        setEmail('valid-email@gmail.com');
        setPassword('dbv38rhu*(dbchsHFSJ');
        submitForm();
        getTestScheduler().flush();
        fixture.detectChanges();
        const errorEl: ErrorMessageComponent = fixture.debugElement.query(
          By.directive(ErrorMessageComponent)
        ).componentInstance;
        expect(errorEl.errorMessage).toBe('error message');
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

    it('should display error when email is not valid', () => {
      setEmail('invalid');
      component.email.markAsTouched();
      fixture.detectChanges();
      const errorEl: HTMLElement = fixture.debugElement.query(
        By.directive(MatError)
      ).nativeElement;
      expect(errorEl).toBeTruthy();
      expect(errorEl.textContent.trim()).toBe('Invalid email');
    });

    it('should display error when email is not set', () => {
      component.email.markAsTouched();
      fixture.detectChanges();
      const errorEl: HTMLElement = fixture.debugElement.query(
        By.directive(MatError)
      ).nativeElement;
      expect(errorEl).toBeTruthy();
      expect(errorEl.textContent.trim()).toBe('Email is required');
    });

    it('should display error when password is not set', () => {
      component.password.markAsTouched();
      fixture.detectChanges();
      const errorEl: HTMLElement = fixture.debugElement.query(
        By.directive(MatError)
      ).nativeElement;
      expect(errorEl).toBeTruthy();
      expect(errorEl.textContent.trim()).toBe('Password is required');
    });

    it('should call authenticationService.logout on create', () => {
      expect(authServiceSpy.logout).toHaveBeenCalledTimes(1);
    });

    it(
      'should redirect to /' +
        ' when authenticationService.login returns response',
      () => {
        setEmail('valid-email@gmail.com');
        setPassword('dbv38rhu*(dbchsHFSJ');
        submitForm();
        getTestScheduler().flush();
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['/']);
      }
    );
  });

  describe('returnUrl is set', () => {
    beforeEach(() => {
      TestBed.overrideProvider(ActivatedRoute, {
        useValue: {
          snapshot: {
            queryParamMap: convertToParamMap({ returnUrl: 'returnUrlMock' })
          }
        }
      });
      createComponent();
    });

    it(
      'should redirect to url from url query params' +
        ' when authenticationService.login returns response',
      () => {
        setEmail('valid-email@gmail.com');
        setPassword('dbv38rhu*(dbchsHFSJ');
        submitForm();
        getTestScheduler().flush();
        fixture.detectChanges();
        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith(['returnUrlMock']);
      }
    );
  });

  function createComponent() {
    TestBed.compileComponents();
    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.get(Router);
    spyOn(router, 'navigate');
  }

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
    fixture.detectChanges();
  }

  function getPasswordInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector(
      'input[formControlName="password"]'
    );
  }

  function setPassword(password: string) {
    const passwordField: HTMLInputElement = getPasswordInput();
    passwordField.value = password;
    passwordField.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function submitForm() {
    const submitButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[type="submit"]'
    );
    submitButton.click();
  }
});
