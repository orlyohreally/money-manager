import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { EmailVerificationRequestComponent } from './email-verification-request/email-verification-request.component';
// tslint:disable-next-line: max-line-length
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { LogoutComponent } from './logout/logout.component';
import { SignInFormComponent } from './sign-in-form/sign-in-form.component';

const routes: Routes = [
  {
    path: 'register',
    component: SignInFormComponent,
    data: {
      seo: {
        title: 'Sign in',
        description:
          // tslint:disable-next-line: max-line-length
          'Register to Family Expenses to track how much you and your family spend every month'
      }
    }
  },
  {
    path: 'login',
    component: LoginFormComponent,
    data: {
      seo: {
        title: 'Login',
        description:
          // tslint:disable-next-line: max-line-length
          'Login to Family Expenses to check how much you and your family has spent today'
      }
    }
  },
  {
    path: 'logout',
    component: LogoutComponent,
    data: { seo: { title: 'Logout' } }
  },
  {
    path: 'email-verification',
    component: EmailVerificationComponent,
    data: { seo: { title: 'Email verification' } }
  },
  {
    path: 'email-verification-request',
    component: EmailVerificationRequestComponent,
    data: { seo: { title: 'Verify email' } }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
