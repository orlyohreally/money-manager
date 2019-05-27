import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSubjectFormComponent } from './payment-subject-form.component';

describe('PaymentSubjectFormComponent', () => {
  let component: PaymentSubjectFormComponent;
  let fixture: ComponentFixture<PaymentSubjectFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSubjectFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSubjectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
