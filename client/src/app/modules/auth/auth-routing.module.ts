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
    data: { title: 'Sign in' }
  },
  {
    path: 'login',
    component: LoginFormComponent,
    data: { title: 'Login' }
  },
  {
    path: 'logout',
    component: LogoutComponent,
    data: { title: 'Logout' }
  },
  {
    path: 'email-verification',
    component: EmailVerificationComponent,
    data: { title: 'Email verification' }
  },
  {
    path: 'email-verification-request',
    component: EmailVerificationRequestComponent,
    data: { title: 'Verify email' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
