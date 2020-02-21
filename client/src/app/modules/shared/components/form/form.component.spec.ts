import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Component } from '@angular/core';
import { FormComponent } from './form.component';

@Component({
  template: `
    <div></div>
  `
})
class GenericComponent {}

describe('FormComponent', () => {
  let component: FormComponent<GenericComponent>;
  let fixture: ComponentFixture<FormComponent<GenericComponent>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
