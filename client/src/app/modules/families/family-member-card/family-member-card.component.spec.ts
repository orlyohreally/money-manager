import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyMemberCardComponent } from './family-member-card.component';

describe('FamilyMemberCardComponent', () => {
  let component: FamilyMemberCardComponent;
  let fixture: ComponentFixture<FamilyMemberCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyMemberCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FamilyMemberCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
