import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavAuthenticatedUserComponent } from './side-nav-authenticated-user.component';

describe('SideNavAuthenticatedUserComponent', () => {
  let component: SideNavAuthenticatedUserComponent;
  let fixture: ComponentFixture<SideNavAuthenticatedUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideNavAuthenticatedUserComponent ]
    })
    .compileComponents();
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
