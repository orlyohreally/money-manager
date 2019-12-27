import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '@shared/types';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';

@Component({
  selector: 'auth-sign-in-form',
  templateUrl: './sign-in-form.component.html',
  styleUrls: ['./sign-in-form.component.scss']
})
export class SignInFormComponent implements OnInit {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  signInForm: FormGroup;
  serverError: string;
  showPassword = false;

  ngOnInit() {
    this.authService.logout();
    this.initForm();
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
      this.authService
        .register({
          email: this.email.value,
          password: this.password.value,
          firstName: this.firstName.value,
          lastName: this.lastName.value
        } as User)
        .subscribe(
          () => {
            const returnUrl = this.route.snapshot.queryParamMap.get(
              'returnUrl'
            );
            this.router.navigate([returnUrl || '/']);
          },
          (error: HttpErrorResponse) => {
            this.serverError = error.error;
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
        control => this.validatePasswords(control, 'password')
      ]),
      passwordVerification: new FormControl('', [
        Validators.required,
        control => this.validatePasswords(control, 'passwordVerification')
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

  private validatePasswords(control: AbstractControl, name: string) {
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
}
