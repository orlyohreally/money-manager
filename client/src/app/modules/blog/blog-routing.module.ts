import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// tslint:disable-next-line: max-line-length
import { ButterCsmRouterResolverService } from '@core-client/services/butter-cms-router-resolver/butter-csm-router-resolver.service';
// tslint:disable-next-line: max-line-length
import { ButterCsmTitleResolverService } from '@core-client/services/butter-cms-title-resolver/butter-csm-title-resolver.service';
import { PostComponent } from './post/post.component';
import { PostsListComponent } from './posts-list/posts-list.component';

const routes: Routes = [
  {
    path: 'blog',
    component: PostsListComponent,
    data: {
      title: 'Posts',
      description: 'Find everything you can do with Family Expenses'
    }
  },
  {
    path: 'blog/:slug',
    component: PostComponent,
    resolve: {
      post: ButterCsmRouterResolverService,
      title: ButterCsmTitleResolverService
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule {}
