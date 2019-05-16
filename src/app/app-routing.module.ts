import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PaymentsTimelineComponent } from './payments-timeline/payments-timeline.component';

const routes: Routes = [{ path: '', component: PaymentsTimelineComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
