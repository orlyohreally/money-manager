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
import { NewFamilyComponent } from "./new-family/new-family.component";

@NgModule({
  declarations: [FamilyFormComponent, NewFamilyComponent],
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
  exports: [FamilyFormComponent, NewFamilyComponent],
  entryComponents: [FamilyFormComponent]
})
export class FamilyModule {}
