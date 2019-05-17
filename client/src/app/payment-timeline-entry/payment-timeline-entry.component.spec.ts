import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentTimelineEntryComponent } from './payment-timeline-entry.component';

describe('PaymentTimelineEntryComponent', () => {
  let component: PaymentTimelineEntryComponent;
  let fixture: ComponentFixture<PaymentTimelineEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentTimelineEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentTimelineEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
