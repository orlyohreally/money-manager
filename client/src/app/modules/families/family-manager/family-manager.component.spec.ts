import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockDirective } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
// tslint:disable-next-line: max-line-length
import { AccordionComponent } from '@shared-client/components/accordion/accordion.component';
// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
import { BadgeDirective } from '@shared-client/directives/badge.directive';
import { FamiliesServiceMock } from '@tests-utils/mocks/families.service.spec';
// tslint:disable-next-line: max-line-length
import { DynamicActiveRouterLinkDirective } from '../../shared/directives/dynamic-active-router-link/dynamic-active-router-link.directive';
import { FamilyManagerComponent } from './family-manager.component';

describe('FamilyManagerComponent', () => {
  let component: FamilyManagerComponent;
  let fixture: ComponentFixture<FamilyManagerComponent>;

  const familiesServiceMock = FamiliesServiceMock();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FamilyManagerComponent,
        MockComponent(AccordionComponent),
        MockDirective(BadgeDirective),
        MockComponent(LoaderComponent),
        MockDirective(DynamicActiveRouterLinkDirective)
      ],
      imports: [MatListModule, MatIconModule, RouterTestingModule],
      providers: [
        { provide: FamiliesService, useValue: familiesServiceMock.service }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
