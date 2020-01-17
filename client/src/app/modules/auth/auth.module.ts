import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';
// tslint:disable-next-line: max-line-length
import { EmailVerificationRequestComponent } from './email-verification-request/email-verification-request.component';
// tslint:disable-next-line: max-line-length
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { LogoutComponent } from './logout/logout.component';
import { SignInFormComponent } from './sign-in-form/sign-in-form.component';

@NgModule({
  declarations: [
    SignInFormComponent,
    LoginFormComponent,
    LogoutComponent,
    EmailVerificationComponent,
    EmailVerificationRequestComponent
  ],
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
