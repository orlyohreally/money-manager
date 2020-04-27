import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { PaymentsCalculationsService } from '@core-client/services/payments/payments-calculations.service';
// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
import { PaymentsCalculationsServiceMock } from '@src/app/tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { MemberPaymentDebtListComponent } from '../member-payment-debt-list/member-payment-debt-list.component';
// tslint:disable-next-line: max-line-length
import { MemberPaymentOverpayAndDebtListComponent } from '../member-payment-overpay-and-debt-list/member-payment-overpay-and-debt-list.component';
// tslint:disable-next-line: max-line-length
import { MemberPaymentOverpayAndDebtComponent } from './member-payment-overpay-and-debt.component';

describe('MemberPaymentOverpayAndDebtComponent', () => {
  let component: MemberPaymentOverpayAndDebtComponent;
  let fixture: ComponentFixture<MemberPaymentOverpayAndDebtComponent>;
  // tslint:disable-next-line: max-line-length
  let paymentsCalculationsServiceSpy: jasmine.SpyObj<PaymentsCalculationsService>;

  const paymentsCalculationsServiceMock = PaymentsCalculationsServiceMock();

  beforeEach(async(() => {
    paymentsCalculationsServiceSpy = paymentsCalculationsServiceMock.service;

    TestBed.configureTestingModule({
      declarations: [
        MemberPaymentOverpayAndDebtComponent,
        MockComponent(MemberPaymentDebtListComponent),
        MockComponent(MemberPaymentOverpayAndDebtListComponent),
        MockComponent(LoaderComponent)
      ],
      providers: [
        {
          provide: PaymentsCalculationsService,
          useValue: paymentsCalculationsServiceSpy
        }
      ]
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
