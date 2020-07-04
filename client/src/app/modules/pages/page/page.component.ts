import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Page } from '@src/app/types';

@Component({
  selector: 'page-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss']
})
export class PageComponent implements OnInit {
  constructor(protected route: ActivatedRoute) {}

  protected slug: Observable<string>;
  public page: Observable<Page>;

  ngOnInit() {
    this.page = this.route.data.pipe(
      map((data: { page: Page }) => {
        return data.page;
      })
    );
  }
}
