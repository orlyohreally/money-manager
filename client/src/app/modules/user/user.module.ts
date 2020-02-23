import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// tslint:disable-next-line: max-line-length
import { FamilyModule } from '../families/family.module';
import { PaymentModule } from '../payments/payment.module';
// tslint:disable-next-line: max-line-length
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserRoutingModule } from './user-routing.module';
import { UserComponent } from './user/user.component';

@NgModule({
  declarations: [UserComponent, UserDashboardComponent],
  imports: [CommonModule, UserRoutingModule, PaymentModule, FamilyModule]
})
export class UserModule {}
