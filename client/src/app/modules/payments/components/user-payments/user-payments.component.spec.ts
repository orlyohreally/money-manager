import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

// tslint:disable-next-line: max-line-length
import { PaymentsCalculationsService } from '@core-client/services/payments/payments-calculations.service';
import { PaymentsCalculationsServiceMock } from '@src/app/tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { UserPaymentsCalculatedPerMemberComponent } from '../user-payments-calculated-per-member/user-payments-calculated-per-member.component';
// tslint:disable-next-line: max-line-length
import { UserPaymentsListWrapperComponent } from '../user-payments-list-wrapper/user-payments-list-wrapper.component';
import { UserPaymentsComponent } from './user-payments.component';

describe('UserPaymentsComponent', () => {
  let component: UserPaymentsComponent;
  let fixture: ComponentFixture<UserPaymentsComponent>;
  // tslint:disable-next-line: max-line-length
  let paymentsCalculationsServiceSpy: jasmine.SpyObj<PaymentsCalculationsService>;

  const paymentsCalculationsServiceMock = PaymentsCalculationsServiceMock();

  beforeEach(async(() => {
    paymentsCalculationsServiceSpy = paymentsCalculationsServiceMock.service;

    TestBed.configureTestingModule({
      declarations: [
        UserPaymentsComponent,
        MockComponent(UserPaymentsListWrapperComponent),
        MockComponent(UserPaymentsCalculatedPerMemberComponent)
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
    fixture = TestBed.createComponent(UserPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
