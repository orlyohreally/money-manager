import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSubjectComponent } from './payment-subject.component';

describe('PaymentSubjectComponent', () => {
  let component: PaymentSubjectComponent;
  let fixture: ComponentFixture<PaymentSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentSubjectComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
