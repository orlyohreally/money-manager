import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { PaymentsComponent } from '../payments/components/payments/payments.component';
// tslint:disable-next-line: max-line-length
import { DashboardComponent } from './dashboard/dashboard.component';
// tslint:disable-next-line: max-line-length
import { FamilyMembersComponent } from './family-members/family-members.component';
import { FamilyComponent } from './family/family.component';

const routes: Routes = [
  // {
  //   path: 'families',
  //   component: FamiliesComponent,
  //   data: { title: 'My families' }
  // },
  {
    path: 'families/:familyId',
    component: FamilyComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          seo: { title: 'Family dashboard', description: 'Family dashboard' }
        }
      },
      {
        path: 'members',
        component: FamilyMembersComponent,
        data: {
          seo: {
            title: 'Family members',
            description: 'Family members information'
          }
        }
      },
      {
        path: 'payments',
        component: PaymentsComponent,
        data: {
          seo: {
            title: 'Family payments',
            description:
              // tslint:disable-next-line: max-line-length
              'List of family payments and family members debts and overpay balances}'
          }
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
export class FamilyRoutingModule {}
