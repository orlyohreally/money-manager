import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatToolbarModule } from '@angular/material';
import { MockComponent } from 'ng-mocks';

import { MainNavLogoComponent } from '../main-nav-logo/main-nav-logo.component';
import { SideNavToolbarComponent } from './side-nav-toolbar.component';

describe('SideNavToolbarComponent', () => {
  let component: SideNavToolbarComponent;
  let fixture: ComponentFixture<SideNavToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SideNavToolbarComponent,
        MockComponent(MainNavLogoComponent)
      ],
      imports: [MatToolbarModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
