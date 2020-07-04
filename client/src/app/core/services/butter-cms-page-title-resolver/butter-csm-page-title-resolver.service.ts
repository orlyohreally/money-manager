import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Page } from '@src/app/types';
// tslint:disable-next-line: max-line-length
import { ButterCsmPageRouterResolverService } from '../butter-cms-page-router-resolver/butter-csm-page-router-resolver.service';

@Injectable({
  providedIn: 'root'
})
export class ButterCsmPageSeoResolverService
  implements Resolve<{ title: string }> {
  constructor(
    // tslint:disable-next-line: max-line-length
    private butterCsmPageRouterResolverService: ButterCsmPageRouterResolverService
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{ title: string }> {
    return this.butterCsmPageRouterResolverService.resolve(route, state).pipe(
      map((page: Page) => {
        return { title: page.fields.title };
      })
    );
  }
}
