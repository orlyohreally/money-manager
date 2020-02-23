import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FamiliesComponent } from '../families/families.component';
// tslint:disable-next-line: max-line-length
import { UserPaymentsComponent } from '../payments/components/user-payments/user-payments.component';
// tslint:disable-next-line: max-line-length
import { UserDashboardComponent } from '../user/user-dashboard/user-dashboard.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: UserDashboardComponent
      },
      {
        path: 'families',
        component: FamiliesComponent
      },

      {
        path: 'payments',
        component: UserPaymentsComponent,
        data: { title: 'My payments' }
      },
      {
        path: '**',
        redirectTo: 'dashboard'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
