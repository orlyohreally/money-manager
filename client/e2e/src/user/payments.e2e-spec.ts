import {
  browser,
  by,
  element,
  ElementFinder,
  ExpectedConditions
} from 'protractor';

import { constants, registerUser } from '@src-e2e/shared';
import { getTextTitle, getTitleText, resetTestedUser } from '@src-e2e/shared/';
import { UserPaymentsPage } from './payments.po';

describe('User payments Page', () => {
  let page: UserPaymentsPage;

  beforeAll(() => {
    registerUser();
    page = new UserPaymentsPage();
  });

  beforeEach(() => {
    resetTestedUser();
    page.login();
    page.goToPage();
  });

  it('should have correct page title', () => {
    expect(getTitleText()).toEqual('My payments | Family Expenses');
  });

  it('should have correct text title', () => {
    expect(getTextTitle()).toEqual('My payments');
  });

  it('should have button to create new payment', () => {
    expect(page.getCreatePaymentButton()).toBeTruthy();
  });

  it('should create payments and update payments list', () => {
    expect(element(by.css('payment-user-payment-list')).getText()).toBe(
      'No payments yet...'
    );

    expect(getUserPayments().count()).toEqual(0);
    const payments = [
      {
        amount: { value: '75', display: '$75' },
        subject: 'apartment',
        paidAt: '1/2/20'
      },
      {
        amount: { value: '1500', display: '$1.5K' },
        subject: 'pet',
        paidAt: '5/2/20'
      }
    ];
    page.createUserPayment(
      payments[0].amount.value,
      payments[0].subject,
      payments[0].paidAt
    );
    let paymentsList = getUserPayments();
    expect(paymentsList.count()).toEqual(1);
    expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(0),
      payments[0].amount.display,
      payments[0].subject,
      payments[0].paidAt,
      ''
    );
    expectHeaderToDisplayCorrectly();
    page.createUserPayment(
      payments[1].amount.value,
      payments[1].subject,
      payments[1].paidAt
    );
    paymentsList = getUserPayments();
    expect(paymentsList.count()).toEqual(2);
    expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(1),
      payments[0].amount.display,
      payments[0].subject,
      payments[0].paidAt,
      ''
    );
    expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(0),
      payments[1].amount.display,
      payments[1].subject,
      payments[1].paidAt,
      ''
    );
  });

  it('user payments list should contain family payments', () => {
    const userPayment = {
      amount: { value: '75', display: '$75' },
      subject: 'apartment',
      paidAt: '1/6/20'
    };

    page.createUserPayment(
      userPayment.amount.value,
      userPayment.subject,
      userPayment.paidAt
    );
    let paymentsList = getUserPayments();
    expect(paymentsList.count()).toEqual(1);
    expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(0),
      userPayment.amount.display,
      userPayment.subject,
      userPayment.paidAt,
      ''
    );
    const familyName = 'Peterson';
    page.createFamily(familyName, 'euro');
    const familyPayment = {
      amount: { value: '278', display: '€278' },
      subject: 'pet',
      paidAt: '1/2/20'
    };
    page.createFamilyPayment(
      familyName,
      familyPayment.amount.value,
      familyPayment.subject,
      familyPayment.paidAt
    );
    page.goToPage();
    waitForUserPaymentsList();
    paymentsList = getUserPayments();
    expect(paymentsList.count()).toEqual(2);
    expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(0),
      userPayment.amount.display,
      userPayment.subject,
      userPayment.paidAt,
      ''
    );
    expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(1),
      familyPayment.amount.display,
      familyPayment.subject,
      familyPayment.paidAt,
      familyName
    );
    paymentsList
      .get(1)
      .element(by.linkText(familyName))
      .click();
    expect(getTextTitle()).toEqual('Payments');
  });

  function getUserPayments() {
    return element.all(by.css('payment-user-payment-list tbody tr'));
  }

  function expectPaymentToBeDisplayedCorrectly(
    paymentEl: ElementFinder,
    amount: string,
    subject: string,
    paidAt: string,
    familyName: string
  ) {
    const columns = paymentEl.all(by.tagName('td'));
    const subjectImage = columns.get(0).element(by.tagName('img'));
    expect(subjectImage.getAttribute('src')).toContain(subject);
    expect(columns.get(1).getText()).toEqual(amount);
    expect(columns.get(2).getText()).toEqual(familyName);
    expect(columns.get(3).getText()).toEqual(paidAt);
  }

  function expectHeaderToDisplayCorrectly() {
    const headers = element.all(
      by.css('payment-user-payment-list thead tr th')
    );
    expect(headers.get(0).getText()).toEqual('Subject');
    expect(headers.get(1).getText()).toEqual('Amount');
    expect(headers.get(2).getText()).toEqual('Family');
    expect(headers.get(3).getText()).toEqual('Payment Date');
  }

  function waitForUserPaymentsList() {
    browser.wait(
      ExpectedConditions.presenceOf(
        element(by.css('payment-user-payment-list'))
      ),
      constants.waitTimeout
    );
  }
});
