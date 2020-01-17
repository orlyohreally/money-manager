import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@src/app/core/services/authentication/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { switchMap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';

@Component({
  selector: 'auth-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailVerificationComponent implements OnInit {
  errorMessage: Observable<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService
  ) {}

  ngOnInit() {
    const email = this.route.snapshot.queryParamMap.get('email');
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!email || !token) {
      this.router.navigate(['/']);
    }

    this.errorMessage = this.authService.verifyEmail(email, token).pipe(
      switchMap(() => {
        this.router.navigate(['/']);
        return of(null);
      }),
      catchError((error: HttpErrorResponse) => {
        return of(error.error);
      })
    );
  }
}
