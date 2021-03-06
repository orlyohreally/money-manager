import { CurrencyPipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';

import {
  MemberFamily,
  OverpaidDebtPayment,
  PaymentExpense
} from '@shared-client/types';
import { FamilyMember } from '@shared/types';
import { FamilyPaymentView, UserPaymentView } from '@src/app/types';
import {
  AuthenticationServiceMock,
  IAuthenticationServiceMock,
  IPaymentsServiceMock,
  IPaymentSubjectsServiceMock,
  PaymentsServiceMock,
  PaymentSubjectsServiceMock
} from '@tests-utils/mocks';
import {
  FamiliesServiceMock,
  IFamiliesServiceMock
} from '@tests-utils/mocks/families.service.spec';
// tslint:disable-next-line: max-line-length
import {
  IMembersServiceMock,
  MembersServiceMock
} from '@tests-utils/mocks/members.service.spec';

// tslint:disable-next-line: max-line-length
import { AuthenticationService } from '../authentication/authentication.service';
import { FamiliesService } from '../families/families.service';
import { MembersService } from '../members/members.service';
// tslint:disable-next-line: max-line-length
import { PaymentSubjectsService } from '../payment-subject/payment-subjects.service';
import { PaymentsCalculationsService } from './payments-calculations.service';
import { PaymentsService } from './payments.service';

describe('PaymentsCalculationsService', () => {
  let service: PaymentsCalculationsService;
  let paymentSubjectsServiceSpy: jasmine.SpyObj<PaymentSubjectsService>;
  let membersServiceSpy: jasmine.SpyObj<MembersService>;
  let familiesServiceSpy: jasmine.SpyObj<FamiliesService>;
  let authenticationServiceSpy: jasmine.SpyObj<AuthenticationService>;
  let familiesServiceMock: IFamiliesServiceMock;
  let membersServiceMock: IMembersServiceMock;
  let paymentsServiceMock: IPaymentsServiceMock;
  let paymentSubjectsServiceMock: IPaymentSubjectsServiceMock;
  let paymentsServiceSpy: jasmine.SpyObj<PaymentsService>;
  let authenticationServiceMock: IAuthenticationServiceMock;
  let currencyPipeSpy: jasmine.SpyObj<CurrencyPipe>;

  beforeEach(() => {
    paymentSubjectsServiceMock = PaymentSubjectsServiceMock();
    paymentSubjectsServiceSpy = paymentSubjectsServiceMock.service;
    familiesServiceMock = FamiliesServiceMock();
    familiesServiceSpy = familiesServiceMock.service;
    membersServiceMock = MembersServiceMock();
    membersServiceSpy = membersServiceMock.getService();
    paymentsServiceMock = PaymentsServiceMock();
    paymentsServiceSpy = paymentsServiceMock.service;
    authenticationServiceMock = AuthenticationServiceMock();
    authenticationServiceSpy = authenticationServiceMock.getService();
    currencyPipeSpy = jasmine.createSpyObj('CurrencyPipe', ['transform']);
    currencyPipeSpy.transform.and.callFake(
      (value: number, currency: string) => `${value} - ${currency}`
    );

    TestBed.configureTestingModule({
      providers: [
        {
          provide: PaymentSubjectsService,
          useValue: paymentSubjectsServiceSpy
        },
        {
          provide: FamiliesService,
          useValue: familiesServiceSpy
        },
        { provide: MembersService, useValue: membersServiceSpy },
        { provide: PaymentsService, useValue: paymentsServiceSpy },
        { provide: AuthenticationService, useValue: authenticationServiceSpy },
        { provide: CurrencyPipe, useValue: currencyPipeSpy }
      ]
    });
    service = TestBed.inject(PaymentsCalculationsService);
  });

  afterEach(() => {});

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(
    'getAggregatedUserPayments should aggregate subjects and family' +
      ' for every user payment',
    () => {
      const expectedPayments: UserPaymentView[] = [
        {
          _id: 'paymentId-1',
          amount: 10,
          receipt: 'receipt-1.png',
          subject: paymentSubjectsServiceMock.paymentSubjectsList[0],
          paidAt: new Date('2020-01-02').toString(),
          family: familiesServiceMock.familyList[0] as MemberFamily,
          createdAt: new Date('2020-10-01').toString(),
          updatedAt: new Date('2020-10-02').toString(),
          currency: familiesServiceMock.familyList[0].currency,
          paymentPercentages: paymentsServiceMock.paymentPercentage,
          member: authenticationServiceMock.user
        },
        {
          _id: 'paymentId-2',
          amount: 20,
          receipt: 'receipt-2.png',
          subject: paymentSubjectsServiceMock.paymentSubjectsList[1],
          paidAt: new Date('2020-01-04').toString(),
          family: familiesServiceMock.familyList[1] as MemberFamily,
          createdAt: new Date('2020-10-02').toString(),
          updatedAt: new Date('2020-10-02').toString(),
          currency: familiesServiceMock.familyList[1].currency,
          paymentPercentages: paymentsServiceMock.paymentPercentage,
          member: authenticationServiceMock.user
        }
      ];
      familiesServiceSpy.getFamilyById.and.callFake((familyId: string) => {
        if (familyId === 'familyId-1') {
          return of(familiesServiceMock.familyList[0]);
        } else if (familyId === 'familyId-2') {
          return of(familiesServiceMock.familyList[1]);
        }
        return of(undefined);
      });
      paymentSubjectsServiceSpy.getSubjectById.and.callFake(
        (subjectId: string) => {
          if (subjectId === 'subjectId-1') {
            return of(paymentSubjectsServiceMock.paymentSubjectsList[0]);
          } else if (subjectId === 'subjectId-2') {
            return of(paymentSubjectsServiceMock.paymentSubjectsList[1]);
          }
          return of(undefined);
        }
      );
      service
        .getAggregatedUserPayments()
        .subscribe((payments: UserPaymentView[]) => {
          expect(paymentsServiceSpy.getUserPayments).toHaveBeenCalledTimes(1);
          expect(paymentsServiceSpy.getUserPayments).toHaveBeenCalledWith();
          expect(payments).toEqual(expectedPayments);
        });
    }
  );

  it(
    'getAggregatedPayments should aggregate subjects and member' +
      ' for every family payment',
    () => {
      familiesServiceSpy.getFamilyById.and.callFake((userId: string) => {
        if (userId === 'userId-1') {
          return of(membersServiceMock.membersList[0]);
        } else if (userId === 'userId-2') {
          return of(membersServiceMock.membersList[1]);
        }
        return of(undefined);
      });
      paymentSubjectsServiceSpy.getSubjectById.and.callFake(
        (subjectId: string) => {
          if (subjectId === 'subjectId-1') {
            return of(paymentSubjectsServiceMock.paymentSubjectsList[0]);
          } else if (subjectId === 'subjectId-2') {
            return of(paymentSubjectsServiceMock.paymentSubjectsList[1]);
          }
          return of(undefined);
        }
      );
      service
        .getAggregatedPayments()
        .subscribe((payments: FamilyPaymentView[]) => {
          expect(paymentsServiceSpy.getPayments).toHaveBeenCalledTimes(1);
          expect(paymentsServiceSpy.getPayments).toHaveBeenCalledWith();
          expect(payments).toEqual([
            ,
            {
              _id: 'paymentId-2',
              amount: 20,
              paidAt: new Date('2020-01-04').toString(),
              member: membersServiceMock.membersList[1],
              subject: paymentSubjectsServiceMock.paymentSubjectsList[1],
              createdAt: new Date('2020-10-02').toString(),
              updatedAt: new Date('2020-10-02').toString(),
              currency: 'USD',
              paymentPercentages: paymentsServiceMock.paymentPercentage
            },
            {
              _id: 'paymentId-1',
              amount: 10,
              member: membersServiceMock.membersList[0],
              paidAt: new Date('2020-01-02').toString(),
              subject: paymentSubjectsServiceMock.paymentSubjectsList[0],
              createdAt: new Date('2020-10-01').toString(),
              updatedAt: new Date('2020-10-02').toString(),
              currency: 'USD',
              paymentPercentages: paymentsServiceMock.paymentPercentage
            }
          ]);
        });
    }
  );

  it('getPaymentTransactions should return payment calculations', () => {
    const mockedFamilyId = 'familyId-1';
    const mockedPaymentsList: FamilyPaymentView[] =
      paymentsServiceMock.familyPayments;
    const expectedResponse: OverpaidDebtPayment[] = [
      {
        debt: 0,
        overpaid: 2,
        user: membersServiceMock.membersList[1],
        currency: 'USD',
        paidAt: new Date('2020-01-04').toString(),
        createdAt: new Date('2020-10-02').toString(),
        updatedAt: new Date('2020-10-02').toString()
      },
      {
        debt: 2,
        overpaid: 0,
        user: membersServiceMock.membersList[0],
        toUser: membersServiceMock.membersList[1],
        currency: 'USD',
        paidAt: new Date('2020-01-04').toString(),
        createdAt: new Date('2020-10-02').toString(),
        updatedAt: new Date('2020-10-02').toString()
      },
      {
        debt: 0,
        overpaid: 9,
        user: membersServiceMock.membersList[0],
        currency: 'USD',
        paidAt: new Date('2020-01-02').toString(),
        createdAt: new Date('2020-10-01').toString(),
        updatedAt: new Date('2020-10-02').toString()
      },
      {
        debt: 9,
        overpaid: 0,
        user: membersServiceMock.membersList[1],
        toUser: membersServiceMock.membersList[0],
        currency: 'USD',
        paidAt: new Date('2020-01-02').toString(),
        createdAt: new Date('2020-10-01').toString(),
        updatedAt: new Date('2020-10-02').toString()
      }
    ];
    service
      .getPaymentTransactions(mockedFamilyId, mockedPaymentsList)
      .pipe(first())
      .subscribe((payments: OverpaidDebtPayment[]) => {
        expect(payments).toEqual(expectedResponse);
      });
  });

  it('getOverpayAndDebtsList should return debts and overpaid values', () => {
    const mockedFamilyId = 'familyId-1';
    const mockedPaymentsList: FamilyPaymentView[] =
      paymentsServiceMock.familyPayments;
    const expectedResponse: PaymentExpense[] = [
      {
        amount: 7,
        member: membersServiceMock.membersList[0],
        currency: 'USD'
      },
      {
        amount: -7,
        member: membersServiceMock.membersList[1],
        currency: 'USD'
      }
    ];

    service
      .getOverpayAndDebtsList(mockedFamilyId, mockedPaymentsList)
      .pipe(first())
      .subscribe(result => {
        expect(result).toEqual(expectedResponse);
      });
  });

  it(
    'getTotalExpensesPerMember should calculate' +
      ' how much each member spent',
    () => {
      const mockedPaymentsList: FamilyPaymentView[] = [
        {
          _id: 'paymentId-1',
          amount: 10,
          receipt: 'receipt-1.png',
          subject: PaymentSubjectsServiceMock().paymentSubjectsList[0],
          paidAt: new Date('2020-01-02').toString(),
          member: {
            _id: 'userId-1',
            firstName: 'firstName-1',
            lastName: 'lastName-1'
          } as FamilyMember,
          currency: 'USD',
          paymentPercentages: paymentsServiceMock.paymentPercentage,
          createdAt: new Date('2020-10-01').toString(),
          updatedAt: new Date('2020-10-02').toString()
        },
        {
          _id: 'paymentId-2',
          amount: 20,
          receipt: 'receipt-2.png',
          subject: PaymentSubjectsServiceMock().paymentSubjectsList[1],
          paidAt: new Date('2020-01-04').toString(),
          member: {
            _id: 'userId-2',
            firstName: 'firstName-1',
            lastName: 'lastName-2'
          } as FamilyMember,
          paymentPercentages: paymentsServiceMock.paymentPercentage,
          createdAt: new Date('2020-10-02').toString(),
          updatedAt: new Date('2020-10-02').toString(),
          currency: 'USD'
        },
        {
          _id: 'paymentId-3',
          amount: 25,
          receipt: 'receipt-2.png',
          subject: PaymentSubjectsServiceMock().paymentSubjectsList[1],
          paidAt: new Date('2020-01-03').toString(),
          member: {
            _id: 'userId-2',
            firstName: 'firstName-1',
            lastName: 'lastName-2'
          } as FamilyMember,
          paymentPercentages: paymentsServiceMock.paymentPercentage,
          createdAt: new Date('2020-10-03').toString(),
          updatedAt: new Date('2020-10-03').toString(),
          currency: 'USD'
        },
        {
          _id: 'paymentId-4',
          amount: 100,
          receipt: 'receipt-1.png',
          subject: PaymentSubjectsServiceMock().paymentSubjectsList[0],
          paidAt: new Date('2020-01-05').toString(),
          member: {
            _id: 'userId-1',
            firstName: 'firstName-1',
            lastName: 'lastName-1'
          } as FamilyMember,
          currency: 'USD',
          paymentPercentages: paymentsServiceMock.paymentPercentage,
          createdAt: new Date('2020-10-05').toString(),
          updatedAt: new Date('2020-10-05').toString()
        }
      ];
      const expectedResponse: PaymentExpense[] = [
        {
          amount: 110,
          currency: 'USD',
          member: {
            _id: 'userId-1',
            firstName: 'firstName-1',
            lastName: 'lastName-1'
          } as FamilyMember
        },
        {
          amount: 45,
          currency: 'USD',
          member: {
            _id: 'userId-2',
            firstName: 'firstName-1',
            lastName: 'lastName-2'
          } as FamilyMember
        }
      ];

      expect(service.getTotalExpensesPerMember(mockedPaymentsList)).toEqual(
        expectedResponse
      );
    }
  );

  it(
    'aggregateExpensesPerSubject should calculate expenses' +
      ' on payment subjects per year',
    () => {
      const payments: FamilyPaymentView[] = [
        {
          amount: 100,
          subject: { name: 'Pets', _id: '1', icon: '' },
          currency: 'USD',
          paidAt: '01-02-2020'
        } as FamilyPaymentView,
        {
          amount: 170,
          subject: { name: 'Apartment', _id: '2', icon: '' },
          currency: 'USD',
          paidAt: '02-02-2020'
        } as FamilyPaymentView,
        {
          amount: 120,
          subject: { name: 'Apartment', _id: '2', icon: '' },
          currency: 'USD',
          paidAt: '07-08-2020'
        } as FamilyPaymentView,
        {
          amount: 1200,
          subject: { name: 'School', _id: '3', icon: '' },
          currency: 'USD',
          paidAt: '01-06-2020'
        } as FamilyPaymentView,
        {
          amount: 5200,
          subject: { name: 'School', _id: '3', icon: '' },
          currency: 'USD',
          paidAt: '01-06-2020'
        } as FamilyPaymentView
      ];

      expect(service.aggregateExpensesPerSubject(payments, 2020)).toEqual([
        [
          'Pets',
          {
            v: 100,
            f: '100 - USD',
            subject: { name: 'Pets', _id: '1', icon: '' }
          }
        ],
        [
          'Apartment',
          {
            v: 290,
            f: '290 - USD',
            subject: { name: 'Apartment', _id: '2', icon: '' }
          }
        ],
        [
          'School',
          {
            v: 6400,
            f: '6400 - USD',
            subject: { name: 'School', _id: '3', icon: '' }
          }
        ]
      ]);
    }
  );

  it(
    'aggregateExpensesPerSubject should calculate expenses' +
      ' on payment subjects per month',
    () => {
      const payments: FamilyPaymentView[] = [
        {
          amount: 100,
          subject: { name: 'Pets', _id: '1', icon: '' },
          currency: 'USD',
          paidAt: '01-02-2020'
        } as FamilyPaymentView,
        {
          amount: 170,
          subject: { name: 'Apartment', _id: '2', icon: '' },
          currency: 'USD',
          paidAt: '02-02-2020'
        } as FamilyPaymentView,
        {
          amount: 120,
          subject: { name: 'Apartment', _id: '2', icon: '' },
          currency: 'USD',
          paidAt: '07-08-2020'
        } as FamilyPaymentView,
        {
          amount: 1200,
          subject: { name: 'School', _id: '3', icon: '' },
          currency: 'USD',
          paidAt: '01-06-2020'
        } as FamilyPaymentView,
        {
          amount: 5200,
          subject: { name: 'School', _id: '3', icon: '' },
          currency: 'USD',
          paidAt: '01-06-2020'
        } as FamilyPaymentView
      ];

      expect(service.aggregateExpensesPerSubject(payments, 2020, 0)).toEqual([
        [
          'Pets',
          {
            v: 100,
            f: '100 - USD',
            subject: { name: 'Pets', _id: '1', icon: '' }
          }
        ],
        [
          'School',
          {
            v: 6400,
            f: '6400 - USD',
            subject: { name: 'School', _id: '3', icon: '' }
          }
        ]
      ]);
    }
  );

  it(
    'getUserMonthlyExpenses should return calculated user ' +
      'monthly expenses for chart',
    () => {
      const userPayments: UserPaymentView[] = [
        {
          amount: 100,
          subject: { name: 'Pets', _id: '1', icon: '' },
          currency: 'USD',
          paidAt: '01-02-2020'
        } as UserPaymentView,
        {
          amount: 170,
          subject: { name: 'Apartment', _id: '2', icon: '' },
          currency: 'USD',
          paidAt: '02-02-2020'
        } as UserPaymentView,
        {
          amount: 120,
          subject: { name: 'Apartment', _id: '3', icon: '' },
          currency: 'USD',
          paidAt: '07-08-2020'
        } as UserPaymentView,
        {
          amount: 1200,
          subject: { name: 'School', _id: '4', icon: '' },
          currency: 'USD',
          paidAt: '01-06-2020'
        } as UserPaymentView,
        {
          amount: 5200,
          subject: { name: 'School', _id: '5', icon: '' },
          currency: 'USD',
          paidAt: '01-06-2020'
        } as UserPaymentView,
        {
          amount: 20,
          subject: { name: 'Apartment', _id: '6', icon: '' },
          currency: 'USD',
          paidAt: '07-10-2020'
        } as UserPaymentView
      ];
      const expectedResponse: {
        data: [string, ...(number | string)[]][];
        columns: (
          | string
          | { type: string; role: string; p: { html: boolean } }
        )[];
      } = {
        data: [
          [
            'Jan.',
            6500,
            // tslint:disable-next-line: max-line-length
            '<div style="padding:5px"><b>January</b><br />Total: <b>6500 - USD</b></div>'
          ],
          [
            'Feb.',
            170,
            // tslint:disable-next-line: max-line-length
            '<div style="padding:5px"><b>February</b><br />Total: <b>170 - USD</b></div>'
          ],
          [
            'Mar.',
            0,
            // tslint:disable-next-line: max-line-length
            '<div style="padding:5px"><b>March</b><br />Total: <b>0 - USD</b></div>'
          ],
          [
            'Apr.',
            0,
            // tslint:disable-next-line: max-line-length
            '<div style="padding:5px"><b>April</b><br />Total: <b>0 - USD</b></div>'
          ],
          [
            'May',
            0,
            // tslint:disable-next-line: max-line-length
            '<div style="padding:5px"><b>May</b><br />Total: <b>0 - USD</b></div>'
          ],
          [
            'Jun.',
            0,
            // tslint:disable-next-line: max-line-length
            '<div style="padding:5px"><b>June</b><br />Total: <b>0 - USD</b></div>'
          ],
          [
            'Jul.',
            140,
            // tslint:disable-next-line: max-line-length
            '<div style="padding:5px"><b>July</b><br />Total: <b>140 - USD</b></div>'
          ],
          [
            'Aug.',
            0,
            // tslint:disable-next-line: max-line-length
            '<div style="padding:5px"><b>August</b><br />Total: <b>0 - USD</b></div>'
          ],
          [
            'Sep.',
            0,
            // tslint:disable-next-line: max-line-length
            '<div style="padding:5px"><b>September</b><br />Total: <b>0 - USD</b></div>'
          ],
          [
            'Oct.',
            0,
            // tslint:disable-next-line: max-line-length
            '<div style="padding:5px"><b>October</b><br />Total: <b>0 - USD</b></div>'
          ],
          [
            'Nov.',
            0,
            // tslint:disable-next-line: max-line-length
            '<div style="padding:5px"><b>November</b><br />Total: <b>0 - USD</b></div>'
          ],
          [
            'Dec.',
            0,
            // tslint:disable-next-line: max-line-length
            '<div style="padding:5px"><b>December</b><br />Total: <b>0 - USD</b></div>'
          ]
        ],
        columns: [
          'Month',
          'Total',
          { type: 'string', role: 'tooltip', p: { html: true } }
        ]
      };
      expect(service.getUserMonthlyExpenses(userPayments, 2020)).toEqual(
        expectedResponse
      );
    }
  );
});
