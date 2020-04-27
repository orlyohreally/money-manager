import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';

@Component({
  selector: 'auth-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  loginForm: FormGroup;
  serverError: string;
  showPassword = false;
  submittingForm = false;

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
      this.submittingForm = true;
      this.authService
        .login({
          email: this.email.value,
          password: this.password.value
        })
        .subscribe(
          () => {
            this.submittingForm = false;
            const returnUrl = this.route.snapshot.queryParamMap.get(
              'returnUrl'
            );
            this.router.navigate([returnUrl || '/']);
          },
          (error: HttpErrorResponse) => {
            this.submittingForm = false;
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
