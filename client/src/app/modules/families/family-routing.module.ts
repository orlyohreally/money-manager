import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// tslint:disable-next-line: max-line-length
import { PaymentListComponent } from '../payments/payment-list/payment-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FamiliesComponent } from './families.component';
// tslint:disable-next-line: max-line-length
import { FamilyMembersComponent } from './family-members/family-members.component';
import { FamilyComponent } from './family/family.component';

const routes: Routes = [
  { path: 'families', component: FamiliesComponent },
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
        component: FamilyMembersComponent
      },
      {
        path: 'payments',
        component: PaymentListComponent
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
