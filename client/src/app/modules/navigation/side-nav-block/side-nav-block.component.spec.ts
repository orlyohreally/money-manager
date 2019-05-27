import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideNavBlockComponent } from './side-nav-block.component';

describe('SideNavBlockComponent', () => {
  let component: SideNavBlockComponent;
  let fixture: ComponentFixture<SideNavBlockComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SideNavBlockComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SideNavBlockComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
