import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// tslint:disable-next-line: max-line-length
import { ButterCsmPageRouterResolverService } from '@core-client/services/butter-cms-page-router-resolver/butter-csm-page-router-resolver.service';
// tslint:disable-next-line: max-line-length
import { ButterCsmPageSeoResolverService } from '@src/app/core/services/butter-cms-page-title-resolver/butter-csm-page-title-resolver.service';
import { PageComponent } from './page/page.component';

const routes: Routes = [
  {
    path: 'page/:type/:slug',
    component: PageComponent,
    resolve: {
      page: ButterCsmPageRouterResolverService,
      seo: ButterCsmPageSeoResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule {}
