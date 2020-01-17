import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatCheckboxModule
} from '@angular/material';
import { SignInFormComponent } from './sign-in-form/sign-in-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { LoginFormComponent } from './login-form/login-form.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { LogoutComponent } from './logout/logout.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { EmailVerificationRequestComponent } from './email-verification-request/email-verification-request.component';

@NgModule({
  declarations: [SignInFormComponent, LoginFormComponent, LogoutComponent, EmailVerificationComponent, EmailVerificationRequestComponent],
  imports: [
    CommonModule,

    FlexLayoutModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCheckboxModule,

    AuthRoutingModule,
    SharedModule
  ],
  exports: [SignInFormComponent]
})
export class AuthModule {}
