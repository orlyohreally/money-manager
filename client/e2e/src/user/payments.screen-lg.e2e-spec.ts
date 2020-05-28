import {
  browser,
  by,
  element,
  ElementFinder,
  ExpectedConditions
} from 'protractor';

import {
  constants,
  registerUser,
  submitForm,
  typeInInput,
  waitForForm
} from '@src-e2e/shared';
import { resetTestedUser } from '@src-e2e/shared/';
import { UserPaymentsPage } from './payments.po';

// tslint:disable-next-line: max-line-length
describe(`User payments Page (screen is more than ${constants.menuScreenThreshold})`, () => {
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

  // tslint:disable-next-line: max-line-length
  it('should update payments by clicking table row and update payments list', () => {
    const payment = {
      amount: { value: '75', display: '$75' },
      subject: 'apartment',
      paidAt: '1/2/20'
    };
    const updatedPayment = {
      amount: { value: '350', display: '$350' },
      subject: 'apartment',
      paidAt: '3/2/20'
    };

    page.createUserPayment(
      payment.amount.value,
      payment.subject,
      payment.paidAt
    );
    let paymentsList = getUserPayments();
    expect(paymentsList.count()).toEqual(1);
    paymentsList
      .get(0)
      .all(by.tagName('td'))
      .get(1)
      .click();

    typeInInput('payment-amount', updatedPayment.amount.value);
    page.typeInPaidDate(updatedPayment.paidAt);
    submitForm();

    paymentsList = getUserPayments();
    expect(paymentsList.count()).toEqual(1);
    expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(0),
      updatedPayment.amount.display,
      updatedPayment.subject,
      updatedPayment.paidAt,
      ''
    );
  });
  // tslint:disable-next-line: max-line-length
  it('should update family payments by clicking table row and update payments list', () => {
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

    const familyName = 'Peterson';
    page.createFamily(familyName, 'Euro');
    page.createFamilyPayment(familyName, '90', 'apartment', '1/1/20');

    page.goToPage();
    waitForUserPaymentsList();

    getUserPayments()
      .get(1)
      .all(by.tagName('div'))
      .get(1)
      .click();
    waitForForm();
    const updatedPayment = {
      amount: { value: '350', display: '€350' },
      subject: 'apartment',
      paidAt: '3/2/20'
    };

    typeInInput('payment-amount', updatedPayment.amount.value);
    page.typeInPaidDate(updatedPayment.paidAt);
    submitForm();

    const paymentsList = getUserPayments();
    expect(paymentsList.count()).toEqual(2);
    expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(1),
      userPayment.amount.display,
      userPayment.subject,
      userPayment.paidAt,
      ''
    );
    expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(0),
      updatedPayment.amount.display,
      updatedPayment.subject,
      updatedPayment.paidAt,
      familyName
    );
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

  function waitForUserPaymentsList() {
    browser.wait(
      ExpectedConditions.presenceOf(
        element(by.css('payment-user-payment-list'))
      ),
      constants.waitTimeout
    );
  }
});
