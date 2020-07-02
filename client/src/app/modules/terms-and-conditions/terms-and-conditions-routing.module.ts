import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// tslint:disable-next-line: max-line-length
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';

const routes: Routes = [
  {
    path: '',
    component: TermsAndConditionsComponent,
    data: {
      title: 'Terms and conditions',
      description: 'Terms and conditions for Family Expenses'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TermsAndConditionsRoutingModule {}
