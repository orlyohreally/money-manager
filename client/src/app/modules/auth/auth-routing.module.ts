import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInFormComponent } from './sign-in-form/sign-in-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { LogoutComponent } from './logout/logout.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { EmailVerificationRequestComponent } from './email-verification-request/email-verification-request.component';

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
