import { NgModule } from "@angular/core";

import {
  MatButtonModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule
} from "@angular/material";
import { SignInFormComponent } from "./sign-in-form/sign-in-form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [SignInFormComponent],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,

    SharedModule
  ],
  exports: [SignInFormComponent]
})
export class AuthModule {}
