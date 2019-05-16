import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsTimelineComponent } from './payments-timeline.component';

describe('PaymentsTimelineComponent', () => {
  let component: PaymentsTimelineComponent;
  let fixture: ComponentFixture<PaymentsTimelineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentsTimelineComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
