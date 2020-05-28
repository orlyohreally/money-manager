import * as moment from 'moment';
import { by, element } from 'protractor';

import {
  constants,
  registerUser,
  setDatetimeInput,
  submitForm,
  testedUser,
  typeInInput,
  waitForForm,
  waitForFormToClose
} from '@src-e2e/shared';
import { resetTestedUser } from '@src-e2e/shared/';
import { FamilyPaymentsPage } from './payments-list.po';

// tslint:disable-next-line: max-line-length
describe(`Family payments Page (screen is equal or less than ${constants.menuScreenThreshold})`, () => {
  let page: FamilyPaymentsPage;

  moment().format('l'); // 5/18/2020

  beforeAll(() => {
    registerUser();
    page = new FamilyPaymentsPage();
  });

  beforeEach(() => {
    resetTestedUser();
    page.login();
  });

  // describe('User is family admin', () => {
  //   //
  // should have select for user
  // should have update button
  // });

  describe('User is family owner', () => {
    beforeEach(() => {
      page.goToFamiliesPage();
      page.createFamily('Peterson');
      page.goToPage('Peterson');
    });

    // tslint:disable-next-line: max-line-length
    it('should update payments by clicking edit button in table row and update payments list', () => {
      expect(element(by.css('payment-payment-list')).getText()).toBe(
        'No payments yet...'
      );

      expect(getFamilyPayments().count()).toEqual(0);
      const payment = {
        amount: { value: '75', display: '₪75' },
        subject: 'apartment',
        paidAt: moment().format('MM/D/YYYY, h:mm:ss')
      };
      const updatedPayment = {
        amount: { value: '350', display: '₪350' },
        subject: 'apartment',
        paidAt: moment()
          .subtract(3, 'days')
          .format('MM/D/YYYY, h:mm:ss')
      };

      page.createFamilyPayment(
        payment.amount.value,
        payment.subject,
        payment.paidAt
      );
      let paymentsList = getFamilyPayments();
      expect(paymentsList.count()).toEqual(1);

      paymentsList
        .get(0)
        .element(by.partialButtonText('edit'))
        .click();

      waitForForm();

      typeInInput('payment-amount', updatedPayment.amount.value);
      setDatetimeInput('form', updatedPayment.paidAt);
      submitForm();

      waitForFormToClose();
      paymentsList = getFamilyPayments();
      expect(paymentsList.count()).toEqual(1);
      page.expectPaymentToBeDisplayedCorrectly(
        paymentsList.get(0),
        updatedPayment.amount.display,
        `${testedUser.firstName} ${testedUser.lastName}`,
        updatedPayment.subject,
        updatedPayment.paidAt
      );
    });
  });

  // describe('User is only family member', () => {
  //   //

  // should not have select for user
  // should have update button
  // });

  // TODO: tests for filters

  function getFamilyPayments() {
    return element.all(by.css('payment-payment-list tbody tr'));
  }
});
