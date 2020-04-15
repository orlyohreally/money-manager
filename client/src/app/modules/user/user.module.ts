import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatInputModule } from '@angular/material';

// tslint:disable-next-line: max-line-length
import { FamilyModule } from '../families/family.module';
import { PaymentModule } from '../payments/payment.module';
import { SharedModule } from '../shared/shared.module';
import { ManagerComponent } from './manager/manager.component';
// tslint:disable-next-line: max-line-length
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserFormComponent } from './user-form/user-form.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [
    UserComponent,
    UserDashboardComponent,
    ManagerComponent,
    UserFormComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    PaymentModule,
    FamilyModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    FlexLayoutModule,
    SharedModule
  ]
})
export class UserModule {}
