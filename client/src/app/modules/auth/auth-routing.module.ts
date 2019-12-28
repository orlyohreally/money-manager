import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
