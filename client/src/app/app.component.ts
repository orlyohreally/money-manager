import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { MatSidenav } from '@angular/material';
import { Title } from '@angular/platform-browser';
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
import { GlobalVariablesService } from './core/services/global-variables/global-variables.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  pageIsLoading = true;

  @ViewChild('sidenav') sideNavEl: MatSidenav;

  private appName = 'Family Expenses';

  constructor(
    public media: MediaObserver,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title,
    @Inject('windowObj')
    private window: Window & {
      gtag: (
        config: string,
        ga_measurement_id: string,
        setup: { page_path?: string }
      ) => void;
    },
    private globalVariablesService: GlobalVariablesService
  ) {}

  ngOnInit() {
    this.getPageSettings();
    this.router.events.subscribe((routerEvent: RouterEvent) => {
      this.displayPageLoader(routerEvent);
    });
    this.setupGoogleAnalytics();
  }

  isOpened(): boolean {
    return !this.media.isActive('lt-sm');
  }

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
      .subscribe((data: { title: string; hideMenu: boolean }) => {
        const title = data ? data.title : '';
        this.titleService.setTitle(`${title} | ${this.appName}`);
        if (this.sideNavEl.mode !== 'side') {
          this.sideNavEl.close();
        }
      });
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
        this.window.gtag(
          'config',
          this.globalVariablesService.gaMeasurementId,
          {
            page_path: event.urlAfterRedirects
          }
        );
      }
    });
  }
}
