import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyManagerComponent } from './family-manager.component';

describe('FamilyManagerComponent', () => {
  let component: FamilyManagerComponent;
  let fixture: ComponentFixture<FamilyManagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FamilyManagerComponent ]
    })
    .compileComponents();
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
