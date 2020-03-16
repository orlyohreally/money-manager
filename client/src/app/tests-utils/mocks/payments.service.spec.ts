// tslint:disable-next-line: max-line-length
import { PaymentsService } from '@core-client/services/payments/payments.service';
import { MemberPaymentPercentage, Payment } from '@shared/types';
import { cold, initTestScheduler } from 'jasmine-marbles';

const paymentPercentageMock: MemberPaymentPercentage[] = [
  {
    userId: 'userId-1',
    paymentPercentage: 10
  },
  {
    userId: 'userId-2',
    paymentPercentage: 90
  }
];

const paymentMock: Payment = {
  _id: 'paymentId-1',
  amount: 10,
  receipt: 'receipt-1.png',
  subjectId: 'subjectId-1',
  paidAt: new Date('2020-01-02'),
  userId: 'userId-1',
  familyId: 'familyId-1',
  paymentPercentages: paymentPercentageMock,
  createdAt: new Date('2020-10-01'),
  updatedAt: new Date('2020-10-02')
};

const paymentsListMock: Payment[] = [
  {
    _id: 'paymentId-1',
    amount: 10,
    receipt: 'receipt-1.png',
    subjectId: 'subjectId-1',
    paidAt: new Date('2020-01-02'),
    userId: 'userId-1',
    familyId: 'familyId-1',
    paymentPercentages: paymentPercentageMock,
    createdAt: new Date('2020-10-01'),
    updatedAt: new Date('2020-10-02')
  },
  {
    _id: 'paymentId-2',
    amount: 20,
    receipt: 'receipt-2.png',
    subjectId: 'subjectId-2',
    paidAt: new Date('2020-01-04'),
    userId: 'userId-2',
    familyId: 'familyId-2',
    paymentPercentages: paymentPercentageMock,
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
    paymentPercentages: paymentPercentageMock,
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
    paymentPercentages: paymentPercentageMock,
    createdAt: new Date('2020-10-02'),
    updatedAt: new Date('2020-10-02')
  }
];
export interface IPaymentServiceMock {
  service: jasmine.SpyObj<PaymentsService>;
  payment: Payment;
  payments: Payment[];
  userPayments: Payment[];
  paymentPercentage: MemberPaymentPercentage[];
}

function getPaymentsServiceSpy() {
  initTestScheduler();

  // tslint:disable-next-line: max-line-length
  const paymentsServiceSpy: jasmine.SpyObj<PaymentsService> = jasmine.createSpyObj(
    'PaymentsService',
    ['getPayments', 'getUserPayments']
  );
  paymentsServiceSpy.getPayments.and.returnValue(
    cold('--a', { a: paymentsListMock })
  );
  paymentsServiceSpy.getUserPayments.and.returnValue(
    cold('--a', { a: userPaymentsListMock })
  );

  return paymentsServiceSpy;
}

export const PaymentServiceMock: () => IPaymentServiceMock = () => ({
  service: getPaymentsServiceSpy(),
  payments: paymentsListMock,
  payment: paymentMock,
  userPayments: userPaymentsListMock,
  paymentPercentage: paymentPercentageMock
});
