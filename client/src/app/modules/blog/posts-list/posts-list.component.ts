import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

// tslint:disable-next-line: max-line-length
import { ButterCMSService } from '@core-client/services/butter-cms/butter-cms.service';
import { BlogPost } from '@src/app/types';

@Component({
  selector: 'blog-posts-list',
  templateUrl: './posts-list.component.html',
  styleUrls: ['./posts-list.component.scss']
})
export class PostsListComponent implements OnInit {
  posts: Observable<{ data: BlogPost[]; meta: { count: number } }>;

  constructor(private butterCMSService: ButterCMSService) {}

  ngOnInit() {
    this.posts = this.butterCMSService.getPosts(1, 10);
  }
}
