import * as moment from 'moment';
import {
  browser,
  by,
  element,
  ElementFinder,
  ExpectedConditions
} from 'protractor';

import { registerUser, testedUser } from '@src-e2e/shared';
import { getTextTitle, getTitleText, resetTestedUser } from '@src-e2e/shared/';
import { FamilyPaymentsPage } from './payments-list.po';

describe('Family payments Page', () => {
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

    it('should have correct page title', () => {
      expect(getTitleText()).toEqual('Family payments | Family Expenses');
    });

    it('should have correct text title', () => {
      expect(getTextTitle()).toEqual('Payments');
    });

    it('should have button to create new payment', () => {
      expect(page.getCreatePaymentButton()).toBeTruthy();
    });

    // should not have select for user
    // should have update button

    it('should create payments and update payments list', () => {
      expect(element(by.css('payment-payment-list')).getText()).toBe(
        'No payments yet...'
      );

      expect(getFamilyPayments().count()).toEqual(0);
      const payments = [
        {
          amount: { value: '75', display: '₪75' },
          subject: 'apartment',
          paidAt: moment().format('L')
        },
        {
          amount: { value: '1500', display: '₪1.5K' },
          subject: 'pet',
          paidAt: moment().format('L')
        }
      ];
      page.createFamilyPayment(
        payments[0].amount.value,
        payments[0].subject,
        payments[0].paidAt
      );
      const waitTimeout = 30000;
      browser.wait(
        ExpectedConditions.not(
          ExpectedConditions.presenceOf(element(by.tagName('form')))
        ),
        waitTimeout
      );
      let paymentsList = getFamilyPayments();
      expect(paymentsList.count()).toEqual(1);
      expectPaymentToBeDisplayedCorrectly(
        paymentsList.get(0),
        payments[0].amount.display,
        `${testedUser.firstName} ${testedUser.lastName}`,
        payments[0].subject,
        moment(payments[0].paidAt)
          .format('l')
          .slice(0, -2)
      );
      expectHeaderToDisplayCorrectly();
      page.createFamilyPayment(
        payments[1].amount.value,
        payments[1].subject,
        payments[1].paidAt
      );
      browser.wait(
        ExpectedConditions.not(
          ExpectedConditions.presenceOf(element(by.tagName('form')))
        ),
        waitTimeout
      );
      paymentsList = getFamilyPayments();
      expect(paymentsList.count()).toEqual(2);
      expectPaymentToBeDisplayedCorrectly(
        paymentsList.get(0),
        payments[0].amount.display,
        `${testedUser.firstName} ${testedUser.lastName}`,
        payments[0].subject,
        moment(payments[0].paidAt)
          .format('l')
          .slice(0, -2)
      );
      expectPaymentToBeDisplayedCorrectly(
        paymentsList.get(1),
        payments[1].amount.display,
        `${testedUser.firstName} ${testedUser.lastName}`,
        payments[1].subject,
        moment(payments[1].paidAt)
          .format('l')
          .slice(0, -2)
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

  function expectPaymentToBeDisplayedCorrectly(
    paymentEl: ElementFinder,
    amount: string,
    userFullName: string,
    subject: string,
    paidAt: string
  ) {
    const columns = paymentEl.all(by.tagName('td'));
    const subjectImage = columns.get(0).element(by.tagName('img'));
    expect(subjectImage.getAttribute('src')).toContain(subject);
    expect(columns.get(1).getText()).toEqual(amount);
    expect(columns.get(2).getText()).toEqual(userFullName);
    expect(columns.get(3).getText()).toEqual(paidAt);
  }

  function expectHeaderToDisplayCorrectly() {
    const headers = element.all(by.css('payment-payment-list thead tr th'));
    expect(headers.get(0).getText()).toEqual('Subject');
    expect(headers.get(1).getText()).toEqual('Amount');
    expect(headers.get(2).getText()).toEqual('Member');
    expect(headers.get(3).getText()).toEqual('Payment Date');
  }
});
