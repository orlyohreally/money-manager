// tslint:disable-next-line: max-line-length
import { PaymentSubjectsService } from '@core-client/services/payment-subject/payment-subjects.service';
import { PaymentSubject } from '@shared/types';
import { cold, initTestScheduler } from 'jasmine-marbles';

const mockedSubject: PaymentSubject = {
  _id: 'subjectId-1',
  name: 'subjectName-1',
  icon: 'subject-icon-1.png',
  createdAt: new Date('2019-01-02'),
  updatedAt: new Date('2019-01-05')
};

const mockedSubjectList: PaymentSubject[] = [
  {
    _id: 'subjectId-1',
    name: 'subjectName-1',
    icon: 'subject-icon-1.png',
    createdAt: new Date('2019-01-02'),
    updatedAt: new Date('2019-01-05')
  },
  {
    _id: 'subjectId-2',
    name: 'subjectName-2',
    icon: 'subject-icon-2.png',
    createdAt: new Date('2019-01-03'),
    updatedAt: new Date('2019-01-05')
  }
];

function getPaymentSubjectsServiceSpy() {
  initTestScheduler();

  // tslint:disable-next-line: max-line-length
  const paymentSubjectsServiceSpy: jasmine.SpyObj<PaymentSubjectsService> = jasmine.createSpyObj(
    'PaymentSubjectsService',
    ['getSubjects', 'getSubjectById']
  );
  paymentSubjectsServiceSpy.getSubjectById.and.returnValue(
    cold('--a', { a: mockedSubject })
  );

  paymentSubjectsServiceSpy.getSubjectById.and.returnValue(
    cold('--a', { a: mockedSubjectList })
  );
  return paymentSubjectsServiceSpy;
}

export interface IPaymentSubjectsServiceMock {
  service: jasmine.SpyObj<PaymentSubjectsService>;
  paymentSubject: PaymentSubject;
  paymentSubjectsList: PaymentSubject[];
}

export const PaymentSubjectsServiceMock = () => ({
  service: getPaymentSubjectsServiceSpy(),
  paymentSubject: mockedSubject,
  paymentSubjectsList: mockedSubjectList
});
