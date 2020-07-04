import { Component, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Meta, Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterEvent
} from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';

// tslint:disable-next-line: max-line-length
import { ButterCMSService } from '@core-client/services/butter-cms/butter-cms.service';
// tslint:disable-next-line: max-line-length
import { GoogleAnalyticsService } from '@core-client/services/google-analytics/google-analytics.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  pageIsLoading = true;
  posts: any[];

  @ViewChild('sidenav', { static: true }) sideNavEl: MatSidenav;

  private appName = 'Family Expenses';
  private defaultKeywords =
    // tslint:disable-next-line: max-line-length
    'family expenses, household expenses list, household expenses, manage my finance';
  // tslint:disable-next-line: max-line-length
  private defaultDescription =
    'Family Expenses is a smart way to track your family expenses';

  constructor(
    public media: MediaObserver,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    private googleAnalyticsService: GoogleAnalyticsService,
    private butterCMSService: ButterCMSService
  ) {}

  ngOnInit() {
    this.getPageSettings();
    this.router.events.subscribe((routerEvent: RouterEvent) => {
      this.displayPageLoader(routerEvent);
    });
    this.setupGoogleAnalytics();
    // this.fetchPosts();
  }

  isOpened(): boolean {
    return !this.media.isActive('lt-sm');
  }

  // private fetchPosts() {
  //   this.butterCMSService.butter.post
  //     .list({
  //       page: 1,
  //       page_size: 10
  //     })
  //     .then(res => {
  //       console.log('Content from ButterCMS');
  //       console.log(res);
  //       this.posts = res.data;
  //     });
  // }

  getMode(): string {
    return this.media.isActive('lt-sm') ? 'over' : 'side';
  }

  private getPageSettings() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.route),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        mergeMap(route => route.data)
      )
      .subscribe(
        (data: {
          seo: { title: string; description: string; keywords: string };
          hideMenu: boolean;
        }) => {
          const title = data && data.seo ? data.seo.title : '';
          this.titleService.setTitle(`${title} | ${this.appName}`);

          if (this.sideNavEl.mode !== 'side') {
            this.sideNavEl.close();
          }

          this.metaService.addTags([
            {
              name: 'keywords',
              content: `${this.defaultKeywords}${
                data.seo && data.seo.keywords ? `, ${data.seo.keywords}` : ''
              }`
            },
            {
              name: 'description',
              content:
                data.seo && data.seo.description
                  ? data.seo.description
                  : this.defaultDescription
            },
            { name: 'robots', content: 'index, follow' }
          ]);
        }
      );
  }

  private displayPageLoader(routerEvent: RouterEvent): void {
    setTimeout(() => {
      if (routerEvent instanceof NavigationStart) {
        this.pageIsLoading = true;
        return;
      }

      if (
        routerEvent instanceof NavigationEnd ||
        routerEvent instanceof NavigationCancel ||
        routerEvent instanceof NavigationError
      ) {
        this.pageIsLoading = false;
      }
    });
  }

  private setupGoogleAnalytics() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.googleAnalyticsService.config({
          page_path: event.urlAfterRedirects
        });
      }
    });
  }
}
