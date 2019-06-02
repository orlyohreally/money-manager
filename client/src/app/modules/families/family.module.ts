import { NgModule } from "@angular/core";

import {
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatIconModule,
  MatListModule
} from "@angular/material";
import { CommonModule } from "@angular/common";
import { FamilyFormComponent } from "./family-form/family-form.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NewFamilyComponent } from "./new-family/new-family.component";
import { FamilyManagerComponent } from "./family-manager/family-manager.component";
import { SharedModule } from "../shared/shared.module";
import { FamilyRoutingModule } from "./family-routing.module";
import { PaymentModule } from "../payments/payment.module";
import { FamilyComponent } from "./family/family.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { FamiliesComponent } from "./families.component";
import { FamilyMembersComponent } from './family-members/family-members.component';

@NgModule({
  declarations: [
    FamilyFormComponent,
    NewFamilyComponent,
    FamilyManagerComponent,
    FamilyComponent,
    DashboardComponent,
    FamiliesComponent,
    FamilyMembersComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FamilyRoutingModule,

    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,

    PaymentModule,
    SharedModule
  ],
  exports: [FamilyFormComponent, NewFamilyComponent, FamilyManagerComponent],
  entryComponents: [FamilyFormComponent]
})
export class FamilyModule {}
