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
  MatMenuModule,
  MatTooltipModule
} from '@angular/material';
import { MembersModule } from '../members/members.module';
import { PaymentModule } from '../payments/payment.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
// tslint:disable-next-line: max-line-length
import { AddMemberDirective } from './directives/add-member/add-member.directive';
// tslint:disable-next-line: max-line-length
import { DeleteFamilyDirective } from './directives/delete-family/delete-family.directive';
// tslint:disable-next-line: max-line-length
import { EditFamilyDirective } from './directives/edit-family/edit-family.directive';
// tslint:disable-next-line: max-line-length
import { NewFamilyDirective } from './directives/new-family/new-family.directive';
import { FamiliesComponent } from './families.component';
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
    FamilyManagerComponent,
    FamilyComponent,
    DashboardComponent,
    FamiliesComponent,
    FamilyMembersComponent,
    FamilyMemberCardComponent,
    NewFamilyDirective,
    EditFamilyDirective,
    DeleteFamilyDirective,
    AddMemberDirective
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
    MatTooltipModule,
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
    FamilyManagerComponent,
    FamilyMemberCardComponent,
    NewFamilyDirective,
    EditFamilyDirective,
    DeleteFamilyDirective,
    AddMemberDirective
  ],
  entryComponents: [FamilyFormComponent]
})
export class FamilyModule {}
