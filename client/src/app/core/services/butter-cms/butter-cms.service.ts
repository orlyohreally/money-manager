import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import Butter from 'buttercms';
import { from, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { BlogPost, BlogPostMeta } from '@src/app/types';

@Injectable({
  providedIn: 'root'
})
export class ButterCMSService {
  private butter = Butter('0b9c4b4952f6c442e769a817a593810f6059ea9b');

  constructor(private route: Router) {}

  getPosts(
    page: number,
    pageSize: number
  ): Observable<{ data: BlogPost[]; meta: { count: number } }> {
    return from(
      this.butter.post.list({
        page,
        page_size: pageSize
      })
    ).pipe(
      map(response => {
        return response.data;
      })
    );
  }

  getPostDetails(
    slug: string
  ): Observable<{ data: BlogPost; meta: BlogPostMeta }> {
    return from(this.butter.post.retrieve(slug)).pipe(
      map(response => {
        return response.data;
      }),
      catchError(error => {
        return this.route.navigate(['/not-found']);
      })
    );
  }
}
