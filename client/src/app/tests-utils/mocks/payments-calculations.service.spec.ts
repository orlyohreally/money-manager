import { cold, initTestScheduler } from 'jasmine-marbles';

// tslint:disable-next-line: max-line-length
import { PaymentsCalculationsService } from '@core-client/services/payments/payments-calculations.service';
import { FamilyMember } from '@shared/types';
import {
  OverpaidDebtPayment,
  PaymentExpense
} from '@src/app/modules/shared/types';
import { PaymentsServiceMock } from './payments.service.spec';

const transactionsList: OverpaidDebtPayment[] = [
  {
    user: {
      _id: 'userId-1',
      firstName: 'firstName-1',
      lastName: 'lastName-1'
    } as FamilyMember,
    toUser: {
      _id: 'userId-2',
      firstName: 'firstName-2',
      lastName: 'lastName-2'
    } as FamilyMember,
    debt: 100,
    overpaid: 160,
    currency: 'USD',
    paidAt: new Date('2020-01-02').toString(),
    createdAt: new Date('2020-10-01').toString(),
    updatedAt: new Date('2020-10-02').toString()
  },
  {
    paidAt: new Date('2020-01-04').toString(),
    user: {
      _id: 'userId-2',
      firstName: 'firstName-2',
      lastName: 'lastName-2'
    } as FamilyMember,
    toUser: {
      _id: 'userId-1',
      firstName: 'firstName-1',
      lastName: 'lastName-1'
    } as FamilyMember,
    createdAt: new Date('2020-10-02').toString(),
    updatedAt: new Date('2020-10-02').toString(),
    debt: 150,
    overpaid: 260,
    currency: 'USD'
  }
];

const expenses: PaymentExpense[] = [
  {
    member: {
      _id: 'userId-1',
      firstName: 'firstName-1',
      lastName: 'lastName-1'
    } as FamilyMember,
    amount: -10,
    currency: 'USD'
  },
  {
    member: {
      _id: 'userId-2',
      firstName: 'firstName-2',
      lastName: 'lastName-2'
    } as FamilyMember,
    amount: 150,
    currency: 'USD'
  }
];

export interface IPaymentsCalculationsServiceMock {
  service: jasmine.SpyObj<PaymentsCalculationsService>;
  expenses: PaymentExpense[];
  transactionsList: OverpaidDebtPayment[];
}

function getPaymentsCalculationsServiceSpy() {
  initTestScheduler();

  // tslint:disable-next-line: max-line-length
  const paymentsCalculationsServiceSpy: jasmine.SpyObj<PaymentsCalculationsService> = jasmine.createSpyObj(
    'PaymentsCalculationsService',
    [
      'getOverpayAndDebtsList',
      'getPaymentTransactions',
      'getAggregatedPayments',
      'getAggregatedUserPayments',
      'getTotalExpensesPerMonthPerMember',
      'convertToColumnChart',
      'aggregateFamilyExpensesPerPaymentSubject'
    ]
  );

  paymentsCalculationsServiceSpy.getOverpayAndDebtsList.and.returnValue(
    cold('--a', { a: expenses })
  );
  paymentsCalculationsServiceSpy.getPaymentTransactions.and.returnValue(
    cold('--a', { a: transactionsList })
  );
  paymentsCalculationsServiceSpy.getAggregatedPayments.and.returnValue(
    cold('----a', { a: PaymentsServiceMock().familyPayments })
  );
  paymentsCalculationsServiceSpy.getAggregatedUserPayments.and.returnValue(
    cold('----a', { a: PaymentsServiceMock().userAggregatedPayments })
  );
  // tslint:disable-next-line: max-line-length
  paymentsCalculationsServiceSpy.getTotalExpensesPerMonthPerMember.and.returnValue(
    cold('----a', {
      a: {
        4: {
          'memberId-1': {
            member: {
              _id: 'userId-1',
              firstName: 'firstName-1',
              lastName: 'lastName-1'
            } as FamilyMember,
            amount: 100,
            currency: 'USD'
          }
        },
        6: {
          'memberId-1': {
            member: {
              _id: 'userId-2',
              firstName: 'firstName-2',
              lastName: 'lastName-2'
            } as FamilyMember,
            amount: 560,
            currency: 'USD'
          }
        }
      }
    })
  );
  paymentsCalculationsServiceSpy.convertToColumnChart.and.returnValue(
    cold('----a', {
      a: [
        ['May', 100, 0],
        ['July', 0, 560]
      ]
    })
  );

  // tslint:disable-next-line: max-line-length
  paymentsCalculationsServiceSpy.aggregateFamilyExpensesPerPaymentSubject.and.returnValue(
    cold('----a', {
      a: [
        ['Apartment', 100],
        ['Pets', 560]
      ]
    })
  );

  return paymentsCalculationsServiceSpy;
}

// tslint:disable-next-line: max-line-length
export const PaymentsCalculationsServiceMock: () => IPaymentsCalculationsServiceMock = () => ({
  service: getPaymentsCalculationsServiceSpy(),
  expenses,
  transactionsList
});
