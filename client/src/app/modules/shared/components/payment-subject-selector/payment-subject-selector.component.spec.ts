import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// tslint:disable-next-line: max-line-length
import { PaymentSubjectSelectorComponent } from './payment-subject-selector.component';

describe('PaymentSubjectSelectorComponent', () => {
  let component: PaymentSubjectSelectorComponent;
  let fixture: ComponentFixture<PaymentSubjectSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentSubjectSelectorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSubjectSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
