import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInFormComponent } from './sign-in-form/sign-in-form.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { LogoutComponent } from './logout/logout.component';

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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
