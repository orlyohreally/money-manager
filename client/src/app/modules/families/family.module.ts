import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule
} from '@angular/material';
import { MembersModule } from '../members/members.module';
import { PaymentModule } from '../payments/payment.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FamiliesComponent } from './families.component';
import { FamilyEditorComponent } from './family-editor/family-editor.component';
import { FamilyFormComponent } from './family-form/family-form.component';
// tslint:disable-next-line: max-line-length
import { FamilyManagerComponent } from './family-manager/family-manager.component';
// tslint:disable-next-line: max-line-length
import { FamilyMemberCardComponent } from './family-member-card/family-member-card.component';
// tslint:disable-next-line: max-line-length
import { FamilyMembersComponent } from './family-members/family-members.component';
import { FamilyRoutingModule } from './family-routing.module';
import { FamilyComponent } from './family/family.component';

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
    SharedModule,
    MembersModule
  ],
  providers: [],
  exports: [
    FamilyFormComponent,
    FamilyEditorComponent,
    FamilyManagerComponent,
    FamilyMemberCardComponent
  ],
  entryComponents: [FamilyFormComponent]
})
export class FamilyModule {}
