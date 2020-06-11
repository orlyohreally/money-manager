import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FamiliesComponent } from '../families/families.component';
// tslint:disable-next-line: max-line-length
import { UserPaymentsComponent } from '../payments/components/user-payments/user-payments.component';
// tslint:disable-next-line: max-line-length
import { UserDashboardComponent } from '../user/user-dashboard/user-dashboard.component';
import { ManagerComponent } from './manager/manager.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  {
    path: 'user',
    component: UserComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: UserDashboardComponent,
        data: {
          title: 'User Dashboard',
          description: 'User dashboard'
        }
      },
      {
        path: 'families',
        component: FamiliesComponent,
        data: {
          title: 'My families',
          description: 'List of your families registered in Families Expenses'
        }
      },
      {
        path: 'payments',
        component: UserPaymentsComponent,
        data: {
          title: 'My payments',
          description: 'List of your payments registered in Families Expenses'
        }
      },
      {
        path: 'manage-account',
        component: ManagerComponent,
        data: {
          title: 'Manage account',
          description:
            'Set up your account to meet your personal needs the best'
        }
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
