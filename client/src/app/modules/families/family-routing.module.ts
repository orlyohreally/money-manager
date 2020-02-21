import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { PaymentsComponent } from '../payments/components/payments/payments.component';
// tslint:disable-next-line: max-line-length
import { DashboardComponent } from './dashboard/dashboard.component';
import { FamiliesComponent } from './families.component';
// tslint:disable-next-line: max-line-length
import { FamilyMembersComponent } from './family-members/family-members.component';
import { FamilyComponent } from './family/family.component';

const routes: Routes = [
  {
    path: 'families',
    component: FamiliesComponent,
    data: { title: 'My families' }
  },
  {
    path: 'families/:familyId',
    component: FamilyComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'members',
        component: FamilyMembersComponent,
        data: { title: 'Family members' }
      },
      {
        path: 'payments',
        component: PaymentsComponent,
        data: { title: 'Family payments' }
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
