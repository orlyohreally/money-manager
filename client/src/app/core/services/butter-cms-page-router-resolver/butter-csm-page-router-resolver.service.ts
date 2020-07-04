import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot
} from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Page } from '@src/app/types';
import { ButterCMSService } from '../butter-cms/butter-cms.service';

@Injectable({
  providedIn: 'root'
})
export class ButterCsmPageRouterResolverService implements Resolve<Page> {
  constructor(
    private butterCMSService: ButterCMSService,
    private router: Router
  ) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<Page> {
    const defaultLocale = 'en';
    const slug = route.paramMap.get('slug');
    const type = route.paramMap.get('type');
    const locale = route.paramMap.get('locale') || defaultLocale;
    return this.butterCMSService.getPageDetails(type, slug, locale).pipe(
      catchError(() => {
        this.router.navigate(['/']);
        return EMPTY;
      })
    );
  }
}
