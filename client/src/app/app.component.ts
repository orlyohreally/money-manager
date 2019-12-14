import { Component, OnInit } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import {
  ActivatedRoute,
  Data,
  Router,
  NavigationEnd,
  RouterEvent,
  NavigationStart,
  NavigationError,
  NavigationCancel
} from '@angular/router';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  pageIsLoading: boolean;

  private appName = 'Money Manager';

  constructor(
    public media: MediaObserver,
    private router: Router,
    private route: ActivatedRoute,
    private titleService: Title
  ) {}

  ngOnInit() {
    this.getPageSettings();
    this.router.events.subscribe((routerEvent: RouterEvent) => {
      this.displayPageLoader(routerEvent);
    });
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
        console.log(data);
        const title = data['title'];
        this.titleService.setTitle(`${title} | ${this.appName}`);
      });
  }

  private displayPageLoader(routerEvent: RouterEvent): void {
    console.log('display', routerEvent);
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
  }
}
