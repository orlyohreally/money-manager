import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalPaymentEntryComponent } from './total-payment-entry.component';

describe('TotalPaymentEntryComponent', () => {
  let component: TotalPaymentEntryComponent;
  let fixture: ComponentFixture<TotalPaymentEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalPaymentEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalPaymentEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
