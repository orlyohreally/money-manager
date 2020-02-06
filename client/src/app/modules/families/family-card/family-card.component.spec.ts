import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyCardComponent } from './family-card.component';

describe('FamilyCardComponent', () => {
  let component: FamilyCardComponent;
  let fixture: ComponentFixture<FamilyCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FamilyCardComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
