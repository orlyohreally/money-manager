import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot
} from '@angular/router';
import { Observable } from 'rxjs';

import { BlogPost, BlogPostMeta } from '@src/app/types';
import { ButterCMSService } from '../butter-cms/butter-cms.service';

@Injectable({
  providedIn: 'root'
})
export class ButterCsmRouterResolverService implements Resolve<any> {
  constructor(private butterCMSService: ButterCMSService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<{ data: BlogPost; meta: BlogPostMeta }> {
    const slug = route.paramMap.get('slug');
    return this.butterCMSService.getPostDetails(slug);
  }
}
