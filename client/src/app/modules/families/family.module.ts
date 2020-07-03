import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MembersModule } from '../members/members.module';
import { PaymentModule } from '../payments/payment.module';
import { SharedModule } from '../shared/shared.module';
import { DashboardComponent } from './dashboard/dashboard.component';
// tslint:disable-next-line: max-line-length
import { DeleteFamilyDirective } from './directives/delete-family/delete-family.directive';
// tslint:disable-next-line: max-line-length
import { EditFamilyDialogTriggerDirective } from './directives/edit-family-dialog-trigger/edit-family-dialog-trigger.directive';
// tslint:disable-next-line: max-line-length
import { NewFamilyDialogTriggerDirective } from './directives/new-family-dialog-trigger/new-family-dialog-trigger.directive';
// tslint:disable-next-line: max-line-length
import { EditFamilyFormComponent } from './edit-family-form/edit-family-form.component';
import { FamiliesComponent } from './families.component';
// tslint:disable-next-line: max-line-length
import { FamilyActionsComponent } from './family-actions/family-actions.component';
import { FamilyCardComponent } from './family-card/family-card.component';
import { FamilyFormComponent } from './family-form/family-form.component';
// tslint:disable-next-line: max-line-length
import { FamilyManagerComponent } from './family-manager/family-manager.component';
// tslint:disable-next-line: max-line-length
import { FamilyMemberCardComponent } from './family-member-card/family-member-card.component';
// tslint:disable-next-line: max-line-length
import { FamilyMembersComponent } from './family-members/family-members.component';
import { FamilyRoutingModule } from './family-routing.module';
import { FamilyComponent } from './family/family.component';
// tslint:disable-next-line: max-line-length
import { NewFamilyFormComponent } from './new-family-form/new-family-form.component';

@NgModule({
  declarations: [
    FamilyFormComponent,
    FamilyManagerComponent,
    FamilyComponent,
    DashboardComponent,
    FamiliesComponent,
    FamilyMembersComponent,
    FamilyMemberCardComponent,
    NewFamilyDialogTriggerDirective,
    EditFamilyDialogTriggerDirective,
    DeleteFamilyDirective,
    FamilyCardComponent,
    NewFamilyFormComponent,
    EditFamilyFormComponent,
    FamilyActionsComponent
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
    MatCheckboxModule,
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
    NewFamilyDialogTriggerDirective,
    EditFamilyDialogTriggerDirective,
    DeleteFamilyDirective,
    FamilyCardComponent,
    NewFamilyFormComponent,
    EditFamilyFormComponent
  ],
  entryComponents: [
    FamilyFormComponent,
    EditFamilyFormComponent,
    NewFamilyFormComponent
  ]
})
export class FamilyModule {}
