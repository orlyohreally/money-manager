import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyActionsComponent } from './family-actions.component';

describe('FamilyActionsComponent', () => {
  let component: FamilyActionsComponent;
  let fixture: ComponentFixture<FamilyActionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyActionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
