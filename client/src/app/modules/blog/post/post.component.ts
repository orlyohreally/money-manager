import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BlogPost, BlogPostMeta } from '@src/app/types';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
  constructor(protected route: ActivatedRoute) {}

  protected slug: Observable<string>;
  public postData$: Observable<{ data: BlogPost; meta: BlogPostMeta }>;

  ngOnInit() {
    this.postData$ = this.route.data.pipe(
      map((data: { post: { data: BlogPost; meta: BlogPostMeta } }) => {
        return data.post;
      })
    );
  }
}
