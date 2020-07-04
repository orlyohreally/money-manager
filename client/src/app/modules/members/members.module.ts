import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
// tslint:disable-next-line: max-line-length
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { SharedModule } from '../shared/shared.module';
// tslint:disable-next-line: max-line-length
import { MemberPaymentPercentageComponent } from './components/member-payment-percentage/member-payment-percentage.component';
// tslint:disable-next-line: max-line-length
import { MemberRolesComponent } from './components/member-roles/member-roles.component';
// tslint:disable-next-line: max-line-length
import { MembersPaymentPercentageComponent } from './components/members-payment-percentage/members-payment-percentage.component';
// tslint:disable-next-line: max-line-length
import { NewFamilyMemberFormComponent } from './components/new-member-form/new-member-form.component';
// tslint:disable-next-line: max-line-length
import { AddMemberDirective } from './directives/add-member/add-member.directive';

@NgModule({
  declarations: [
    NewFamilyMemberFormComponent,
    MemberRolesComponent,
    MemberPaymentPercentageComponent,
    MembersPaymentPercentageComponent,
    AddMemberDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule
  ],
  exports: [
    NewFamilyMemberFormComponent,
    MemberRolesComponent,
    MemberPaymentPercentageComponent,
    MembersPaymentPercentageComponent,
    AddMemberDirective
  ],
  entryComponents: [NewFamilyMemberFormComponent]
})
export class MembersModule {}
