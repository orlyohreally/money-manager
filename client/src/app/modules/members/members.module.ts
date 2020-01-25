import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
// tslint:disable-next-line: max-line-length
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule
} from '@angular/material';
import { SharedModule } from '../shared/shared.module';
// tslint:disable-next-line: max-line-length
import { NewFamilyMemberFormComponent } from './components/member-form/new-family-member-form.component';

@NgModule({
  declarations: [NewFamilyMemberFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    FlexLayoutModule
  ],
  exports: [NewFamilyMemberFormComponent],
  entryComponents: [NewFamilyMemberFormComponent]
})
export class MembersModule {}
