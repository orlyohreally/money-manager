import { TestBed } from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { Payment } from '@shared/types';
import {
  AuthenticationServiceMock,
  getGlobalVariablesServiceSpy,
  IAuthenticationServiceMock,
  IPaymentsServiceMock,
  IPaymentSubjectsServiceMock,
  PaymentsServiceMock,
  PaymentSubjectsServiceMock
} from '@src/app/tests-utils/mocks';
import {
  FamiliesServiceMock,
  IFamiliesServiceMock
} from '@src/app/tests-utils/mocks/families.service.spec';
// tslint:disable-next-line: max-line-length
import {
  IMembersServiceMock,
  MembersServiceMock
} from '@src/app/tests-utils/mocks/members.service.spec';
import { map, switchMap, take } from 'rxjs/operators';
import { TestScheduler } from 'rxjs/testing';
// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '../authentication/authentication.service';
import { FamiliesService } from '../families/families.service';
// tslint:disable-next-line: max-line-length
import { GlobalVariablesService } from '../global-variables/global-variables.service';
import { MembersService } from '../members/members.service';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectsService } from '../payment-subject/payment-subjects.service';
import { PaymentsService } from './payments.service';

describe('PaymentsService', () => {
  let service: PaymentsService;
  let paymentSubjectsServiceSpy: jasmine.SpyObj<PaymentSubjectsService>;
  let membersServiceSpy: jasmine.SpyObj<MembersService>;
  let familiesServiceSpy: jasmine.SpyObj<FamiliesService>;
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let httpTestingController: HttpTestingController;
  let familiesServiceMock: IFamiliesServiceMock;
  let membersServiceMock: IMembersServiceMock;
  let paymentsServiceMock: IPaymentsServiceMock;
  let paymentSubjectsServiceMock: IPaymentSubjectsServiceMock;
  let authenticationServiceMock: IAuthenticationServiceMock;

  const scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
  });

  beforeEach(() => {
    paymentSubjectsServiceMock = PaymentSubjectsServiceMock();
    paymentSubjectsServiceSpy = paymentSubjectsServiceMock.service;
    familiesServiceMock = FamiliesServiceMock();
    familiesServiceSpy = familiesServiceMock.service;
    membersServiceMock = MembersServiceMock();
    membersServiceSpy = membersServiceMock.getService();
    authenticationServiceMock = AuthenticationServiceMock();
    authenticationServiceSpy = authenticationServiceMock.getService();
    paymentsServiceMock = PaymentsServiceMock();

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: GlobalVariablesService,
          useValue: getGlobalVariablesServiceSpy()
        },
        {
          provide: PaymentSubjectsService,
          useValue: paymentSubjectsServiceSpy
        },
        {
          provide: FamiliesService,
          useValue: familiesServiceSpy
        },
        { provide: MembersService, useValue: membersServiceSpy },
        { provide: AuthenticationService, useValue: authenticationServiceSpy }
      ]
    });
    service = TestBed.get(PaymentsService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(
    'getPayment for familyId should make GET http request' +
      ' to api/payments/:familyId',
    () => {
      const familyIdMock = 'familyId-1';
      service
        .getPayments(familyIdMock)
        .pipe(take(1))
        .subscribe(payments => {
          expect(payments).toEqual(paymentsServiceMock.payments);
        });

      const req = httpTestingController.expectOne({
        url: 'apiURL/payments/familyId-1',
        method: 'GET'
      });

      req.flush(paymentsServiceMock.payments);
    }
  );

  it('getPayment should cache payments received from API', () => {
    const familyIdMock = 'familyId-1';
    service
      .getPayments(familyIdMock)
      .pipe(take(1))
      .subscribe(() => {
        scheduler.run(({ expectObservable }) => {
          expectObservable(service.getPayments(familyIdMock)).toBe('a', {
            a: paymentsServiceMock.payments
          });
        });
      });

    const req = httpTestingController.expectOne({
      url: 'apiURL/payments/familyId-1',
      method: 'GET'
    });

    req.flush(paymentsServiceMock.payments);
  });

  it('getUserPayment should make GET http request to api/payments/', () => {
    service
      .getUserPayments()
      .pipe(take(1))
      .subscribe(payments => {
        expect(payments).toEqual(paymentsServiceMock.userPayments);
      });

    const req = httpTestingController.expectOne({
      url: 'apiURL/payments/',
      method: 'GET'
    });

    req.flush(paymentsServiceMock.userPayments);
  });

  it('getUserPayment should cache payments received from API', () => {
    service.getUserPayments().subscribe(() => {
      scheduler.run(({ expectObservable }) => {
        expectObservable(service.getUserPayments()).toBe('a', {
          a: paymentsServiceMock.userPayments
        });
      });
    });

    const reqPayments = httpTestingController.expectOne({
      url: 'apiURL/payments/',
      method: 'GET'
    });
    reqPayments.flush(paymentsServiceMock.userPayments);
  });

  it(
    'createPayment for familyId should make POST http request' +
      ' to api/payments/:familyId',
    () => {
      const familyIdMock = 'familyId-1';
      service
        .createPayment(paymentsServiceMock.payment, familyIdMock)
        .subscribe(payments => {
          expect(payments).toEqual(paymentsServiceMock.payment);
        });

      const req = httpTestingController.expectOne({
        url: 'apiURL/payments/familyId-1',
        method: 'POST'
      });

      expect(req.request.body).toEqual({
        payment: paymentsServiceMock.payment
      });
      req.flush(paymentsServiceMock.payment);
    }
  );

  it('createPayment with familyId should update cache of payments', () => {
    const familyIdMock = 'familyId-1';
    service
      .createPayment(familiesServiceMock.family, familyIdMock)
      .pipe(
        map(() => {
          service.getPayments(familyIdMock).pipe(take(1));
        })
      )
      .subscribe(() => {
        scheduler.run(({ expectObservable }) => {
          expectObservable(service.getPayments(familyIdMock)).toBe('a', {
            a: [paymentsServiceMock.payment]
          });
        });
      });

    const req = httpTestingController.expectOne({
      url: 'apiURL/payments/familyId-1',
      method: 'POST'
    });

    req.flush(paymentsServiceMock.payment);
  });

  it(
    'createPayment without familyId should make POST http request' +
      ' to api/payments',
    () => {
      service.createPayment(paymentsServiceMock.payment).subscribe(payments => {
        expect(payments).toEqual(paymentsServiceMock.payment);
      });

      const req = httpTestingController.expectOne({
        url: 'apiURL/payments/',
        method: 'POST'
      });
      expect(req.request.body).toEqual({
        payment: paymentsServiceMock.payment
      });

      req.flush(paymentsServiceMock.payment);
    }
  );

  it('createPayment without familyId should update cache of payments', () => {
    const mockedUserPayments: Payment[] = [
      {
        _id: 'paymentId-3',
        amount: 20,
        receipt: 'receipt-2.png',
        subjectId: 'subjectId-2',
        paidAt: new Date('2020-01-04'),
        userId: 'userId-2',
        familyId: 'familyId-2',
        paymentPercentages: paymentsServiceMock.paymentPercentage,
        createdAt: new Date('2020-10-02'),
        updatedAt: new Date('2020-10-02')
      }
    ];
    service
      .getUserPayments()
      .pipe(
        take(1),
        switchMap(() => {
          return service.createPayment(familiesServiceMock.family);
        })
      )
      .subscribe(() => {
        scheduler.run(({ expectObservable }) => {
          expectObservable(service.getUserPayments()).toBe('a', {
            a: [paymentsServiceMock.payment, ...mockedUserPayments]
          });
        });
      });
    const reqUserPayments = httpTestingController.expectOne({
      url: 'apiURL/payments/',
      method: 'GET'
    });

    reqUserPayments.flush(mockedUserPayments);

    const req = httpTestingController.expectOne({
      url: 'apiURL/payments/',
      method: 'POST'
    });

    req.flush(paymentsServiceMock.payment);
  });
});
