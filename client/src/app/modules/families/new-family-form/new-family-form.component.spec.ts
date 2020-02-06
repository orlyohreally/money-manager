import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewFamilyFormComponent } from './new-family-form.component';

describe('NewFamilyFormComponent', () => {
  let component: NewFamilyFormComponent;
  let fixture: ComponentFixture<NewFamilyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewFamilyFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewFamilyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
