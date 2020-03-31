import { cold, initTestScheduler } from 'jasmine-marbles';

// tslint:disable-next-line: max-line-length
import { PaymentsService } from '@core-client/services/payments/payments.service';
import { FamilyMember, MemberPaymentPercentage, Payment } from '@shared/types';
import { FamilyPaymentView } from '@src/app/types';
import { PaymentSubjectsServiceMock } from '.';

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

const familyPaymentsListMock: FamilyPaymentView[] = [
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
    paymentPercentages: paymentPercentageMock,
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
    paymentPercentages: paymentPercentageMock,
    createdAt: new Date('2020-10-02').toString(),
    updatedAt: new Date('2020-10-02').toString(),
    currency: 'USD'
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
  familyPayments: FamilyPaymentView[];
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
  familyPayments: familyPaymentsListMock,
  paymentPercentage: paymentPercentageMock
});
