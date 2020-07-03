import * as moment from 'moment';
import {
  browser,
  by,
  element,
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
          paidAt: moment().format('MM/D/YYYY, h:mm A')
        },
        {
          amount: { value: '1500', display: '₪1.5K' },
          subject: 'pet',
          paidAt: moment()
            .add(1, 'hours')
            .format('MM/D/YYYY, h:mm A')
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
          ExpectedConditions.presenceOf(
            element(by.css('.cdk-overlay-container form'))
          )
        ),
        waitTimeout
      );
      let paymentsList = getFamilyPayments();
      expect(paymentsList.count()).toEqual(1);
      page.expectPaymentToBeDisplayedCorrectly(
        paymentsList.get(0),
        payments[0].amount.display,
        `${testedUser.firstName} ${testedUser.lastName}`,
        payments[0].subject,
        payments[0].paidAt
      );
      expectHeaderToDisplayCorrectly();
      page.createFamilyPayment(
        payments[1].amount.value,
        payments[1].subject,
        payments[1].paidAt
      );
      browser.wait(
        ExpectedConditions.not(
          ExpectedConditions.presenceOf(
            element(by.css('.cdk-overlay-container form'))
          )
        ),
        waitTimeout
      );
      paymentsList = getFamilyPayments();
      expect(paymentsList.count()).toEqual(2);
      page.expectPaymentToBeDisplayedCorrectly(
        paymentsList.get(1),
        payments[0].amount.display,
        `${testedUser.firstName} ${testedUser.lastName}`,
        payments[0].subject,
        payments[0].paidAt
      );
      page.expectPaymentToBeDisplayedCorrectly(
        paymentsList.get(0),
        payments[1].amount.display,
        `${testedUser.firstName} ${testedUser.lastName}`,
        payments[1].subject,
        payments[1].paidAt
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

  function expectHeaderToDisplayCorrectly() {
    const headers = element.all(by.css('payment-payment-list thead tr th'));
    expect(headers.get(0).getText()).toEqual('Subject');
    expect(headers.get(1).getText()).toEqual('Amount');
    expect(headers.get(2).getText()).toEqual('Member');
    expect(headers.get(3).getText()).toEqual('Payment Date');
  }
});
