import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FamilyIdService } from '@core-client/resolvers/family-id.service';
import { ReportsComponent } from './reports.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    resolve: { familyId: FamilyIdService }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}
