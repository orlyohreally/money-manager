import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPaymentTimelineComponent } from './member-payment-timeline.component';

describe('MemberPaymentTimelineComponent', () => {
  let component: MemberPaymentTimelineComponent;
  let fixture: ComponentFixture<MemberPaymentTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberPaymentTimelineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPaymentTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
