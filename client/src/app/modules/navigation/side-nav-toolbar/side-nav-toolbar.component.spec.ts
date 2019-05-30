import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavToolbarComponent } from './side-nav-toolbar.component';

describe('SideNavToolbarComponent', () => {
  let component: SideNavToolbarComponent;
  let fixture: ComponentFixture<SideNavToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideNavToolbarComponent ]
    })
    .compileComponents();
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
