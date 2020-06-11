import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// tslint:disable-next-line: max-line-length
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: PageNotFoundComponent,
    data: {
      title: 'Page not found',
      description: 'Page not found'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule {}
