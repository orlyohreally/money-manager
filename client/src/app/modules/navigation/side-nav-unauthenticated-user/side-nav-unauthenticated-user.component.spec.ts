import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavUnauthenticatedUserComponent } from './side-nav-unauthenticated-user.component';

describe('SideNavUnauthenticatedUserComponent', () => {
  let component: SideNavUnauthenticatedUserComponent;
  let fixture: ComponentFixture<SideNavUnauthenticatedUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideNavUnauthenticatedUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavUnauthenticatedUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
