import { HttpErrorResponse } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
import { User } from '@shared/types';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'auth-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.scss']
})
export class SignInFormComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}
  @ViewChildren('errorMessageBlock')
  errorMessageBlocks: QueryList<ElementRef>;

  signInForm: FormGroup;
  serverError: string;
  showPassword = false;
  submittingForm = false;

  private errorMessageBlock: ElementRef;
  private destroyed = new Subject<void>();

  ngOnInit() {
    this.authService.logout();
    this.initForm();
  }

  public ngAfterViewInit(): void {
    this.errorMessageBlocks.changes
      .pipe(takeUntil(this.destroyed))
      .subscribe((components: QueryList<ElementRef>) => {
        this.errorMessageBlock = components.first;
      });
  }

  get lastName() {
    return this.signInForm.get('lastName');
  }

  get firstName() {
    return this.signInForm.get('firstName');
  }

  get email() {
    return this.signInForm.get('email');
  }

  get password() {
    return this.signInForm.get('password');
  }

  get passwordVerification() {
    return this.signInForm.get('passwordVerification');
  }

  register() {
    this.serverError = null;
    if (this.signInForm.valid) {
      this.submittingForm = true;
      this.authService
        .register({
          email: this.email.value,
          password: this.password.value,
          firstName: this.firstName.value,
          lastName: this.lastName.value
        } as User)
        .subscribe(
          response => {
            this.submittingForm = false;
            this.router.navigate(['/auth/email-verification-request'], {
              queryParams: {
                email: response.email,
                'verification-token': response.verificationToken
              }
            });
          },
          (error: HttpErrorResponse) => {
            this.submittingForm = false;
            this.serverError = error.error;
            setTimeout(() => {
              this.errorMessageBlock.nativeElement.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
              });
            });
          }
        );
    }
  }

  private initForm() {
    this.signInForm = new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$)'
        )
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        this.createPatterValidation('no-capital-letter', '(?=.*?[A-Z])'),
        this.createPatterValidation('no-lower-letter', '(?=.*?[a-z])'),
        this.createPatterValidation('no-digit-character', '(?=.*?[0-9])'),
        this.createPatterValidation(
          'no-special-character',
          '(?=.*?[#?!@$%^_&*-])'
        ),
        () => this.validatePasswords('password')
      ]),
      passwordVerification: new FormControl('', [
        Validators.required,
        () => this.validatePasswords('passwordVerification')
      ])
    });
  }

  private createPatterValidation(
    validatorName: string,
    pattern: string
  ): (control: AbstractControl) => { [key: string]: boolean } {
    return control => {
      if (!control.value || !control.value.match(pattern)) {
        return { [validatorName]: true };
      }
      return null;
    };
  }

  private validatePasswords(name: string) {
    if (
      this.signInForm === undefined ||
      this.password.value === '' ||
      this.passwordVerification.value === ''
    ) {
      return null;
    }
    if (this.password.value === this.passwordVerification.value) {
      if (
        name === 'password' &&
        this.passwordVerification.hasError('verification-error')
      ) {
        this.password.setErrors(null);
        this.passwordVerification.updateValueAndValidity();
      } else if (
        name === 'passwordVerification' &&
        this.password.hasError('verification-error')
      ) {
        this.passwordVerification.setErrors(null);
        this.password.updateValueAndValidity();
      }
      return;
    }
    return { 'verification-error': true };
  }

  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
