import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// tslint:disable-next-line: max-line-length
import { MemberPaymentOverpayAndDebtComponent } from './member-payment-overpay-and-debt.component';

describe('MemberPaymentOverpayAndDebtComponent', () => {
  let component: MemberPaymentOverpayAndDebtComponent;
  let fixture: ComponentFixture<MemberPaymentOverpayAndDebtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MemberPaymentOverpayAndDebtComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPaymentOverpayAndDebtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
