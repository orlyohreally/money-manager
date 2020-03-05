import { async, ComponentFixture, TestBed } from '@angular/core/testing';

// tslint:disable-next-line: max-line-length
import { MemberPaymentOverpayAndDebtListComponent } from './member-payment-overpay-and-debt-list.component';

describe('MemberPaymentOverpayAndDebtListComponent', () => {
  let component: MemberPaymentOverpayAndDebtListComponent;
  let fixture: ComponentFixture<MemberPaymentOverpayAndDebtListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MemberPaymentOverpayAndDebtListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberPaymentOverpayAndDebtListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
