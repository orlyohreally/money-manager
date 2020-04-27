import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListModule } from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent, MockDirective } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { AccordionComponent } from '@shared-client/components/accordion/accordion.component';
import { BadgeDirective } from '@shared-client/directives/badge.directive';
// tslint:disable-next-line: max-line-length
import { FamilyManagerComponent } from '../../families/family-manager/family-manager.component';
// tslint:disable-next-line: max-line-length
import { SideNavAuthenticatedUserComponent } from './side-nav-authenticated-user.component';

describe('SideNavAuthenticatedUserComponent', () => {
  let component: SideNavAuthenticatedUserComponent;
  let fixture: ComponentFixture<SideNavAuthenticatedUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SideNavAuthenticatedUserComponent,
        MockComponent(FamilyManagerComponent),
        MockComponent(AccordionComponent),
        MockDirective(BadgeDirective)
      ],
      imports: [MatListModule, RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavAuthenticatedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
