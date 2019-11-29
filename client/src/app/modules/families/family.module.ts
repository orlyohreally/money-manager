import { NgModule } from '@angular/core';

import {
  MatButtonModule,
  MatDialogModule,
  MatInputModule,
  MatFormFieldModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatMenuModule
} from '@angular/material';
import { CommonModule } from '@angular/common';
import { FamilyFormComponent } from './family-form/family-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { FamilyEditorComponent } from './new-family/family-editor.component';
import { FamilyManagerComponent } from './family-manager/family-manager.component';
import { SharedModule } from '../shared/shared.module';
import { FamilyRoutingModule } from './family-routing.module';
import { PaymentModule } from '../payments/payment.module';
import { FamilyComponent } from './family/family.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FamiliesComponent } from './families.component';
import { FamilyMembersComponent } from './family-members/family-members.component';
import { FamiliesService } from './services/families/families.service';
import { MembersService } from './services/members/members.service';
import { FamilyMemberCardComponent } from './family-member-card/family-member-card.component';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  declarations: [
    FamilyFormComponent,
    FamilyEditorComponent,
    FamilyManagerComponent,
    FamilyComponent,
    DashboardComponent,
    FamiliesComponent,
    FamilyMembersComponent,
    FamilyMemberCardComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    FamilyRoutingModule,

    FlexLayoutModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatDialogModule,
    MatListModule,
    MatCardModule,

    PaymentModule,
    SharedModule
  ],
  providers: [FamiliesService, MembersService],
  exports: [
    FamilyFormComponent,
    FamilyEditorComponent,
    FamilyManagerComponent,
    FamilyMemberCardComponent
  ],
  entryComponents: [FamilyFormComponent]
})
export class FamilyModule {}
