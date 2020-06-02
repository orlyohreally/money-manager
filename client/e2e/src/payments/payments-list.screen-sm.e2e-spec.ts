import * as moment from 'moment';
import { browser, by, element, ExpectedConditions } from 'protractor';

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

      expect(page.getFamilyPayments().count()).toEqual(0);
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
      let paymentsList = page.getFamilyPayments();
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
      paymentsList = page.getFamilyPayments();
      expect(paymentsList.count()).toEqual(1);
      page.expectPaymentToBeDisplayedCorrectly(
        paymentsList.get(0),
        updatedPayment.amount.display,
        `${testedUser.firstName} ${testedUser.lastName}`,
        updatedPayment.subject,
        updatedPayment.paidAt
      );
    });

    runTestsForDeletePayment();
  });

  // describe('User is only family member', () => {
  //   //

  // should not have select for user
  // should have update button
  // });

  // TODO: tests for filters

  function runTestsForDeletePayment() {
    // tslint:disable-next-line: max-line-length
    it('should delete user payment by clicking delete button in table row and update payments list', () => {
      expect(page.getFamilyPayments().count()).toEqual(0);
      const payments = [
        {
          amount: { value: '75', display: '₪75' },
          subject: 'apartment',
          paidAt: moment()
            .subtract(3, 'days')
            .format('MM/DD/YYYY, h:mm:ss')
        },
        {
          amount: { value: '350', display: '₪350' },
          subject: 'apartment',
          paidAt: moment().format('MM/DD/YYYY, h:mm:ss')
        }
      ];

      page.createFamilyPayment(
        payments[0].amount.value,
        payments[0].subject,
        payments[0].paidAt
      );
      page.createFamilyPayment(
        payments[1].amount.value,
        payments[1].subject,
        payments[1].paidAt
      );
      let paymentsList = page.getFamilyPayments();
      expect(paymentsList.count()).toEqual(2);
      paymentsList
        .get(0)
        .element(by.partialButtonText('delete'))
        .click();

      element(by.className('mat-dialog-actions'))
        .element(by.buttonText('Delete'))
        .click();
      browser.wait(
        ExpectedConditions.not(
          ExpectedConditions.presenceOf(
            element(by.className('mat-dialog-actions'))
          )
        ),
        constants.waitTimeout
      );
      browser.sleep(1000);
      paymentsList = page.getFamilyPayments();
      expect(paymentsList.count()).toEqual(1);
      page.expectPaymentToBeDisplayedCorrectly(
        paymentsList.get(0),
        payments[0].amount.display,
        `${testedUser.firstName} ${testedUser.lastName}`,
        payments[0].subject,
        payments[0].paidAt
      );
    });

    // tslint:disable-next-line: max-line-length
    it('should delete user payment by clicking delete button in edit payment form and update payments list', () => {
      expect(page.getFamilyPayments().count()).toEqual(0);
      const payments = [
        {
          amount: { value: '75', display: '₪75' },
          subject: 'apartment',
          paidAt: moment()
            .subtract(3, 'days')
            .format('MM/DD/YYYY, h:mm:ss')
        },
        {
          amount: { value: '350', display: '₪350' },
          subject: 'apartment',
          paidAt: moment().format('MM/DD/YYYY, h:mm:ss')
        }
      ];

      page.createFamilyPayment(
        payments[0].amount.value,
        payments[0].subject,
        payments[0].paidAt
      );
      page.createFamilyPayment(
        payments[1].amount.value,
        payments[1].subject,
        payments[1].paidAt
      );
      let paymentsList = page.getFamilyPayments();
      expect(paymentsList.count()).toEqual(2);
      paymentsList
        .get(0)
        .element(by.partialButtonText('edit'))
        .click();

      element(by.tagName('form'))
        .element(by.partialButtonText('Delete'))
        .click();
      browser.wait(
        ExpectedConditions.presenceOf(
          element(by.className('mat-dialog-actions'))
        ),
        constants.waitTimeout
      );
      element(by.className('mat-dialog-actions'))
        .element(by.buttonText('Delete'))
        .click();
      browser.wait(
        ExpectedConditions.not(
          ExpectedConditions.presenceOf(
            element(by.className('mat-dialog-actions'))
          )
        ),
        constants.waitTimeout
      );
      browser.sleep(1000);
      paymentsList = page.getFamilyPayments();
      expect(paymentsList.count()).toEqual(1);
      page.expectPaymentToBeDisplayedCorrectly(
        paymentsList.get(0),
        payments[0].amount.display,
        `${testedUser.firstName} ${testedUser.lastName}`,
        payments[0].subject,
        payments[0].paidAt
      );
    });
  }
});
