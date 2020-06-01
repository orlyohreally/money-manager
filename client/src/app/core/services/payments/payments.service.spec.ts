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
import { first, map, switchMap } from 'rxjs/operators';
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
    authenticationServiceMock = AuthenticationServiceMock();
    authenticationServiceSpy = authenticationServiceMock.getService();
    paymentSubjectsServiceMock = PaymentSubjectsServiceMock();
    paymentSubjectsServiceSpy = paymentSubjectsServiceMock.service;
    familiesServiceMock = FamiliesServiceMock();
    familiesServiceSpy = familiesServiceMock.service;
    membersServiceMock = MembersServiceMock();
    membersServiceSpy = membersServiceMock.getService();
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
        .pipe(first())
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
      .pipe(first())
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
      .pipe(first())
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
          service.getPayments(familyIdMock).pipe(first());
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
        first(),
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

  it(
    'updatePayment should make http PUT request' +
      ' to /payments/:familyId/:paymentId and update family payments list',
    () => {
      const mockedFamilyId = 'familyId-1';
      const updatedPayment = paymentsServiceMock.payments[1];
      const response: Payment = {
        ...updatedPayment,
        updatedAt: new Date()
      };
      service
        .getPayments(mockedFamilyId)
        .pipe(
          first(),
          switchMap(() => {
            // service.updatePayment(updatedPayment, mockedFamilyId);
            return service.updatePayment(updatedPayment, mockedFamilyId);
          })
        )
        .subscribe(() => {
          scheduler.run(({ expectObservable }) => {
            expectObservable(service.getPayments(mockedFamilyId)).toBe('a', {
              a: [paymentsServiceMock.payments[0], response]
            });
          });
        });

      const reqPayments = httpTestingController.expectOne({
        url: `apiURL/payments/${mockedFamilyId}`,
        method: 'GET'
      });
      reqPayments.flush(paymentsServiceMock.payments.slice(0, 2));

      const req = httpTestingController.expectOne({
        url: `apiURL/payments/${mockedFamilyId}/${updatedPayment._id}`,
        method: 'PUT'
      });

      expect(req.request.body).toEqual({
        payment: updatedPayment
      });

      req.flush(response);
    }
  );

  it(
    'deletePayment should make http DELETE request' +
      ' to /payments/:familyId/:paymentId and update family payments list' +
      ' when familyId is set',
    done => {
      const paymentsListMock: Payment[] = [
        {
          _id: 'paymentId-3',
          amount: 10,
          receipt: 'receipt-1.png',
          subjectId: 'subjectId-1',
          paidAt: new Date('2020-01-02'),
          userId: 'userId-2',
          familyId: 'familyId-1',
          paymentPercentages: paymentsServiceMock.paymentPercentage,
          createdAt: new Date('2020-10-01'),
          updatedAt: new Date('2020-10-02')
        },
        {
          _id: 'paymentId-2',
          amount: 20,
          receipt: 'receipt-2.png',
          subjectId: 'subjectId-2',
          paidAt: new Date('2020-01-04'),
          userId: 'userId-1',
          familyId: 'familyId-2',
          paymentPercentages: paymentsServiceMock.paymentPercentage,
          createdAt: new Date('2020-10-02'),
          updatedAt: new Date('2020-10-02')
        }
      ];

      const userPaymentsListMock: Payment[] = [
        {
          _id: 'paymentId-1',
          amount: 10,
          receipt: 'receipt-1.png',
          subjectId: 'subjectId-1',
          paidAt: new Date('2020-01-02'),
          userId: 'userId-1',
          familyId: 'familyId-1',
          paymentPercentages: paymentsServiceMock.paymentPercentage,
          createdAt: new Date('2020-10-01'),
          updatedAt: new Date('2020-10-02')
        },
        {
          _id: 'paymentId-2',
          amount: 20,
          receipt: 'receipt-2.png',
          subjectId: 'subjectId-2',
          paidAt: new Date('2020-01-04'),
          userId: 'userId-1',
          familyId: 'familyId-2',
          paymentPercentages: paymentsServiceMock.paymentPercentage,
          createdAt: new Date('2020-10-02'),
          updatedAt: new Date('2020-10-02')
        }
      ];

      const mockedFamilyId = 'familyId-1';
      const deletedPaymentId = paymentsListMock[1]._id;
      const response = {
        message: 'Successfully deleted'
      };
      service
        .getPayments(mockedFamilyId)
        .pipe(
          first(),
          switchMap(() => {
            return service.getUserPayments().pipe(first());
          }),
          switchMap(() => {
            return service.deletePayment(deletedPaymentId, mockedFamilyId);
          })
        )
        .subscribe(() => {
          scheduler.run(({ expectObservable }) => {
            expectObservable(service.getPayments(mockedFamilyId)).toBe('a', {
              a: [paymentsListMock[0]]
            });
            expectObservable(service.getUserPayments()).toBe('a', {
              a: [userPaymentsListMock[0]]
            });
            done();
          });
        });

      const reqPayments = httpTestingController.expectOne({
        url: `apiURL/payments/${mockedFamilyId}`,
        method: 'GET'
      });
      reqPayments.flush(paymentsListMock);

      const reqUserPayments = httpTestingController.expectOne({
        url: 'apiURL/payments/',
        method: 'GET'
      });
      reqUserPayments.flush(userPaymentsListMock);

      const req = httpTestingController.expectOne({
        url: `apiURL/payments/${mockedFamilyId}/${deletedPaymentId}`,
        method: 'DELETE'
      });
      req.flush(response);
    }
  );

  it(
    'deletePayment should make http DELETE request' +
      ' to /payments/:paymentId and update family payments list' +
      ' when familyId is not set',
    done => {
      const paymentsListMock: Payment[] = [
        {
          _id: 'paymentId-3',
          amount: 10,
          receipt: 'receipt-1.png',
          subjectId: 'subjectId-1',
          paidAt: new Date('2020-01-02'),
          userId: 'userId-2',
          familyId: 'familyId-1',
          paymentPercentages: paymentsServiceMock.paymentPercentage,
          createdAt: new Date('2020-10-01'),
          updatedAt: new Date('2020-10-02')
        },
        {
          _id: 'paymentId-2',
          amount: 20,
          receipt: 'receipt-2.png',
          subjectId: 'subjectId-2',
          paidAt: new Date('2020-01-04'),
          userId: 'userId-1',
          familyId: 'familyId-2',
          paymentPercentages: paymentsServiceMock.paymentPercentage,
          createdAt: new Date('2020-10-02'),
          updatedAt: new Date('2020-10-02')
        }
      ];

      const userPaymentsListMock: Payment[] = [
        {
          _id: 'paymentId-1',
          amount: 10,
          receipt: 'receipt-1.png',
          subjectId: 'subjectId-1',
          paidAt: new Date('2020-01-02'),
          userId: 'userId-1',
          familyId: 'familyId-1',
          paymentPercentages: paymentsServiceMock.paymentPercentage,
          createdAt: new Date('2020-10-01'),
          updatedAt: new Date('2020-10-02')
        },
        {
          _id: 'paymentId-2',
          amount: 20,
          receipt: 'receipt-2.png',
          subjectId: 'subjectId-2',
          paidAt: new Date('2020-01-04'),
          userId: 'userId-1',
          familyId: 'familyId-2',
          paymentPercentages: paymentsServiceMock.paymentPercentage,
          createdAt: new Date('2020-10-02'),
          updatedAt: new Date('2020-10-02')
        }
      ];

      const mockedFamilyId = 'familyId-1';
      const deletedPaymentId = userPaymentsListMock[0]._id;
      const response = {
        message: 'Successfully deleted'
      };
      service
        .getPayments(mockedFamilyId)
        .pipe(
          first(),
          switchMap(() => {
            return service.getUserPayments().pipe(first());
          }),
          switchMap(() => {
            return service.deletePayment(deletedPaymentId);
          })
        )
        .subscribe(() => {
          scheduler.run(({ expectObservable }) => {
            expectObservable(service.getPayments(mockedFamilyId)).toBe('a', {
              a: paymentsListMock
            });
            expectObservable(service.getUserPayments()).toBe('a', {
              a: [userPaymentsListMock[1]]
            });
            done();
          });
        });

      const reqPayments = httpTestingController.expectOne({
        url: `apiURL/payments/${mockedFamilyId}`,
        method: 'GET'
      });
      reqPayments.flush(paymentsListMock);

      const reqUserPayments = httpTestingController.expectOne({
        url: 'apiURL/payments/',
        method: 'GET'
      });
      reqUserPayments.flush(userPaymentsListMock);

      const req = httpTestingController.expectOne({
        url: `apiURL/payments/${deletedPaymentId}`,
        method: 'DELETE'
      });
      req.flush(response);
    }
  );
});
