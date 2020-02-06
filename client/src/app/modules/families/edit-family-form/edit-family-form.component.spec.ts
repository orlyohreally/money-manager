import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFamilyFormComponent } from './edit-family-form.component';

describe('EditFamilyFormComponent', () => {
  let component: EditFamilyFormComponent;
  let fixture: ComponentFixture<EditFamilyFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditFamilyFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditFamilyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
