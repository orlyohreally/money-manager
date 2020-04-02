import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockDirective } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { NewFamilyDialogTriggerDirective } from '../../families/directives/new-family-dialog-trigger/new-family-dialog-trigger.directive';
// tslint:disable-next-line: max-line-length
import { RegistrationBannerComponent } from '../registration-banner/registration-banner.component';
import { HomePageComponent } from './home-page.component';

describe('HomePageComponent', () => {
  let component: HomePageComponent;
  let fixture: ComponentFixture<HomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomePageComponent,
        MockComponent(RegistrationBannerComponent),
        MockDirective(NewFamilyDialogTriggerDirective)
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
