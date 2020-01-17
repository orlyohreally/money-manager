import { Component, isDevMode, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '@core-client/services/authentication/authentication.service';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '@core-client/services/global-variables/global-variables.service';

@Component({
  selector: 'auth-email-verification-request',
  templateUrl: './email-verification-request.component.html',
  styleUrls: ['./email-verification-request.component.scss']
})
export class EmailVerificationRequestComponent implements OnInit {
  allowResendEmailVerificationEmail: boolean;
  email: string;
  errorMessage: string;
  showContactUsMessage: boolean;
  sendingEmail = false;
  supportEmail: string;
  attempts = 0;
  maxAttemptCount = 3;

  private verificationToken: string;
  private debounceTime = 2000;

  constructor(
    private authService: AuthenticationService,
    private route: ActivatedRoute,
    private router: Router,
    private globalVariablesService: GlobalVariablesService
  ) {}

  ngOnInit() {
    this.supportEmail = this.globalVariablesService.supportEmail;
    this.email = this.route.snapshot.queryParamMap.get('email');
    this.verificationToken = this.route.snapshot.queryParamMap.get(
      'verification-token'
    );
    if (!this.email || !this.verificationToken) {
      this.router.navigate(['/']);
    }
    setTimeout(() => {
      this.allowResendEmailVerificationEmail = true;
    }, this.debounceTime);
  }

  sendEmailAgain() {
    this.sendingEmail = true;
    this.errorMessage = null;
    if (!this.allowResendEmailVerificationEmail) {
      return;
    }
    this.allowResendEmailVerificationEmail = false;
    this.authService
      .sendEmailVerificationEmail(this.email, this.verificationToken)
      .subscribe(
        () => {
          this.attempts++;
          this.sendingEmail = false;
          if (this.attempts < this.maxAttemptCount) {
            setTimeout(() => {
              this.allowResendEmailVerificationEmail = true;
            }, this.attempts * this.debounceTime);
            return;
          }
          this.showContactUsMessage = true;
        },
        error => {
          this.attempts++;
          this.errorMessage = error.error;
          this.sendingEmail = false;

          if (this.attempts < this.maxAttemptCount) {
            this.allowResendEmailVerificationEmail = true;
            return;
          }
          this.showContactUsMessage = true;
          if (isDevMode()) {
            // tslint:disable-next-line: no-console
            console.log('error', error);
          }
        }
      );
  }
}
