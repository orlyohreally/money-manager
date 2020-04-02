import { Component, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSubject } from '@shared/types';
import { PaymentSubjectComponent } from './payment-subject.component';

@Component({
  template: `
    <shared-payment-subject
      [paymentSubject]="paymentSubject"
    ></shared-payment-subject>
  `
})
class ParentComponent {
  paymentSubject: PaymentSubject;

  @ViewChild(PaymentSubjectComponent)
  paymentSubjectComponent: PaymentSubjectComponent;
}

describe('PaymentSubjectComponent', () => {
  let component: PaymentSubjectComponent;
  let parentComponent: ParentComponent;
  let fixture: ComponentFixture<ParentComponent>;

  const mockedPaymentSubject: PaymentSubject = {
    _id: 'paymentSubjectId',
    name: 'subjectName',
    icon: 'subjectIcon.png',
    createdAt: new Date(),
    updatedAt: new Date()
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentSubjectComponent, ParentComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentComponent);
    parentComponent = fixture.componentInstance;
    parentComponent.paymentSubject = mockedPaymentSubject;
    component = parentComponent.paymentSubjectComponent;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
