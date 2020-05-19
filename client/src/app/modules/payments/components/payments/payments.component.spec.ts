import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { MockComponent, MockDirective } from 'ng-mocks';
import { of } from 'rxjs';

// tslint:disable-next-line: max-line-length
import { FamiliesService } from '@core-client/services/families/families.service';
import { MembersService } from '@core-client/services/members/members.service';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectsService } from '@core-client/services/payment-subject/payment-subjects.service';
// tslint:disable-next-line: max-line-length
import { PaymentsCalculationsService } from '@core-client/services/payments/payments-calculations.service';
// tslint:disable-next-line: max-line-length
import { LoaderComponent } from '@shared-client/components/loader/loader.component';
import {
  FamiliesServiceMock,
  MembersServiceMock,
  PaymentsCalculationsServiceMock,
  PaymentSubjectsServiceMock
} from '@tests-utils/mocks';
// tslint:disable-next-line: max-line-length
import { NewPaymentDialogTriggerDirective } from '../../directives/new-payment-dialog-trigger.directive';
// tslint:disable-next-line: max-line-length
import { MemberPaymentOverpayAndDebtComponent } from '../member-payment-overpay-and-debt/member-payment-overpay-and-debt.component';
// tslint:disable-next-line: max-line-length
import { PaymentsCalculatedPerMemberComponent } from '../payments-calculated-per-member/payments-calculated-per-member.component';
// tslint:disable-next-line: max-line-length
import { PaymentsFiltersComponent } from '../payments-filters/payments-filters.component';
// tslint:disable-next-line: max-line-length
import { PaymentsListWrapperComponent } from '../payments-list-wrapper/payments-list-wrapper.component';
import { PaymentsComponent } from './payments.component';

describe('PaymentsComponent', () => {
  let component: PaymentsComponent;
  let fixture: ComponentFixture<PaymentsComponent>;
  // tslint:disable-next-line: max-line-length
  let paymentsCalculationsServiceSpy: jasmine.SpyObj<PaymentsCalculationsService>;
  let familiesServiceSpy: jasmine.SpyObj<FamiliesService>;
  let membersServiceSpy: jasmine.SpyObj<MembersService>;
  let paymentSubjectsServiceSpy: jasmine.SpyObj<PaymentSubjectsService>;

  const paymentsCalculationsServiceMock = PaymentsCalculationsServiceMock();
  const familiesServiceMock = FamiliesServiceMock();
  const membersServiceMock = MembersServiceMock();
  const paymentSubjectsServiceMock = PaymentSubjectsServiceMock();

  beforeEach(async(() => {
    paymentsCalculationsServiceSpy = paymentsCalculationsServiceMock.service;
    familiesServiceSpy = familiesServiceMock.service;
    membersServiceSpy = membersServiceMock.getService();
    paymentSubjectsServiceSpy = paymentSubjectsServiceMock.service;

    TestBed.configureTestingModule({
      declarations: [
        PaymentsComponent,
        MockComponent(PaymentsFiltersComponent),
        MockComponent(PaymentsListWrapperComponent),
        MockComponent(PaymentsCalculatedPerMemberComponent),
        MockComponent(MemberPaymentOverpayAndDebtComponent),
        MockComponent(LoaderComponent),
        MockDirective(NewPaymentDialogTriggerDirective)
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            parent: {
              paramMap: of(convertToParamMap({}))
            }
          }
        },
        {
          provide: PaymentsCalculationsService,
          useValue: paymentsCalculationsServiceSpy
        },
        {
          provide: PaymentsCalculationsService,
          useValue: paymentsCalculationsServiceSpy
        },
        { provide: FamiliesService, useValue: familiesServiceSpy },
        { provide: MembersService, useValue: membersServiceSpy },
        { provide: PaymentSubjectsService, useValue: paymentSubjectsServiceSpy }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
