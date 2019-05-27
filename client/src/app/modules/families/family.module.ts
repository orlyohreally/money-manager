import { NgModule } from "@angular/core";

import {
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatIconModule
} from "@angular/material";
import { CommonModule } from "@angular/common";
import { FamilyFormComponent } from "./family-form/family-form.component";
import { ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [FamilyFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule
  ],
  exports: [FamilyFormComponent]
})
export class FamilyModule {}
