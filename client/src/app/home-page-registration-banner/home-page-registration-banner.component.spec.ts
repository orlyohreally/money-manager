import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageRegistrationBannerComponent } from './home-page-registration-banner.component';

describe('HomePageRegistrationBannerComponent', () => {
  let component: HomePageRegistrationBannerComponent;
  let fixture: ComponentFixture<HomePageRegistrationBannerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageRegistrationBannerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageRegistrationBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
