import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  FormGroup,
  Validators,
  FormControl,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
import { AuthenticationService } from 'src/app/core/services/authentication/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'auth-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  serverError: string;
  showPassword = false;

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.authService.logout();
    this.initForm();
  }

  login(event: Event) {
    event.preventDefault();
    if (this.loginForm.valid) {
      this.authService
        .login({
          email: this.email.value,
          password: this.password.value
        })
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

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  private initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(
          '(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$)'
        )
      ]),
      password: new FormControl('', [Validators.required])
    });
  }
}
