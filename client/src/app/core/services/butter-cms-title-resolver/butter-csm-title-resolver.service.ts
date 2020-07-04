import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BlogPost, BlogPostMeta } from '@src/app/types';
// tslint:disable-next-line: max-line-length
import { ButterCsmRouterResolverService } from '../butter-cms-router-resolver/butter-csm-router-resolver.service';

@Injectable({
  providedIn: 'root'
})
export class ButterCsmTitleResolverService implements Resolve<string> {
  constructor(
    private butterCsmRouterResolverService: ButterCsmRouterResolverService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<string> {
    return this.butterCsmRouterResolverService.resolve(route, state).pipe(
      map((post: { data: BlogPost; meta: BlogPostMeta }) => {
        return post.data.title;
      })
    );
  }
}
