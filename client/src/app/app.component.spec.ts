import { async, TestBed } from '@angular/core/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Meta, Title } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { GoogleAnalyticsService } from '@core-client/services/google-analytics/google-analytics.service';
import { AppComponent } from './app.component';
import { FooterComponent } from './modules/navigation/footer/footer.component';
// tslint:disable-next-line: max-line-length
import { MainToolbarComponent } from './modules/navigation/main-toolbar/main-toolbar.component';
// tslint:disable-next-line: max-line-length
import { SideNavToolbarComponent } from './modules/navigation/side-nav-toolbar/side-nav-toolbar.component';
// tslint:disable-next-line: max-line-length
import { SideNavComponent } from './modules/navigation/side-nav/side-nav.component';
// tslint:disable-next-line: max-line-length
import { GoogleAnalyticsServiceMock } from './tests-utils/mocks/google-analytics.service.spec';

describe('AppComponent', () => {
  let titleServiceSpy: jasmine.SpyObj<Title>;
  let metaServiceSpy: jasmine.SpyObj<Meta>;

  beforeEach(async(() => {
    titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']);
    metaServiceSpy = jasmine.createSpyObj('Meta', ['addTags']);

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatSidenavModule,
        MatProgressBarModule,
        NoopAnimationsModule
      ],
      declarations: [
        AppComponent,
        MockComponent(SideNavToolbarComponent),
        MockComponent(SideNavComponent),
        MockComponent(MainToolbarComponent),
        MockComponent(FooterComponent)
      ],
      providers: [
        { provide: Router, useValue: { events: () => null } },
        {
          provide: ActivatedRoute,
          useValue: { firstChild: { snapshot: { data: {} } } as ActivatedRoute }
        },
        { provide: Title, useValue: titleServiceSpy },
        { provide: Meta, useValue: metaServiceSpy },
        {
          provide: GoogleAnalyticsService,
          useValue: GoogleAnalyticsServiceMock().getService()
        }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
