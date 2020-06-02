import * as moment from 'moment';
import { browser, by, element, ExpectedConditions } from 'protractor';

import {
  constants,
  iphone5,
  registerUser,
  setDatetimeInput,
  submitForm,
  testedUser,
  typeInInput,
  waitForForm,
  waitForFormToClose
} from '@src-e2e/shared';
import { resetTestedUser } from '@src-e2e/shared/';
import { UserPaymentsPage } from './payments.po';

// tslint:disable-next-line: max-line-length
describe(`User payments Page (screen is equal or less than ${constants.menuScreenThreshold})`, () => {
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
  it('should update payments by clicking edit button in table row and update payments list', () => {
    expect(getUserPayments().count()).toEqual(0);
    const payment = {
      amount: { value: '75', display: '$75' },
      subject: 'apartment',
      paidAt: '1/2/20, 13:40:00'
    };
    const updatedPayment = {
      amount: { value: '350', display: '$350' },
      subject: 'apartment',
      paidAt: '3/2/20, 13:40:00'
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
      .element(by.partialButtonText('edit'))
      .click();

    typeInInput('payment-amount', updatedPayment.amount.value);
    setDatetimeInput('form', updatedPayment.paidAt);
    submitForm();

    paymentsList = getUserPayments();
    expect(paymentsList.count()).toEqual(1);
    page.expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(0),
      updatedPayment.amount.display,
      updatedPayment.subject,
      updatedPayment.paidAt,
      ''
    );
  });

  // tslint:disable-next-line: max-line-length
  it('should update family payments by clicking edit button in table row and update payments list', () => {
    const userPayment = {
      amount: { value: '75', display: '$75' },
      subject: 'apartment',
      paidAt: '1/6/20, 13:40:00'
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
    let paymentsList = getUserPayments();
    const updatedPayment = {
      amount: { value: '350', display: '€350' },
      subject: 'apartment',
      paidAt: '3/2/20, 13:40:00'
    };

    paymentsList
      .get(1)
      .element(by.partialButtonText('edit'))
      .click();
    waitForForm();

    typeInInput('payment-amount', updatedPayment.amount.value);
    setDatetimeInput('form', updatedPayment.paidAt);
    submitForm();
    waitForFormToClose();

    paymentsList = getUserPayments();
    expect(paymentsList.count()).toEqual(2);
    page.expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(1),
      userPayment.amount.display,
      userPayment.subject,
      userPayment.paidAt,
      ''
    );
    page.expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(0),
      updatedPayment.amount.display,
      updatedPayment.subject,
      updatedPayment.paidAt,
      familyName
    );
  });

  // tslint:disable-next-line: max-line-length
  it('should delete user payment by clicking delete button in table row and update payments list', () => {
    expect(getUserPayments().count()).toEqual(0);
    const payments = [
      {
        amount: { value: '75', display: '$75' },
        subject: 'apartment',
        paidAt: '1/2/20, 13:40:00'
      },
      {
        amount: { value: '350', display: '$350' },
        subject: 'apartment',
        paidAt: '3/2/20, 13:40:00'
      }
    ];

    page.createUserPayment(
      payments[0].amount.value,
      payments[0].subject,
      payments[0].paidAt
    );
    page.createUserPayment(
      payments[1].amount.value,
      payments[1].subject,
      payments[1].paidAt
    );
    let paymentsList = getUserPayments();
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
    paymentsList = getUserPayments();
    expect(paymentsList.count()).toEqual(1);
    page.expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(0),
      payments[0].amount.display,
      payments[0].subject,
      payments[0].paidAt,
      ''
    );
  });

  // tslint:disable-next-line: max-line-length
  it('should delete user payment by clicking delete button in edit payment form and update payments list', () => {
    expect(getUserPayments().count()).toEqual(0);
    const payments = [
      {
        amount: { value: '75', display: '$75' },
        subject: 'apartment',
        paidAt: '1/2/20, 13:40:00'
      },
      {
        amount: { value: '350', display: '$350' },
        subject: 'apartment',
        paidAt: '3/2/20, 13:40:00'
      }
    ];

    page.createUserPayment(
      payments[0].amount.value,
      payments[0].subject,
      payments[0].paidAt
    );
    page.createUserPayment(
      payments[1].amount.value,
      payments[1].subject,
      payments[1].paidAt
    );
    let paymentsList = getUserPayments();
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
    paymentsList = getUserPayments();
    expect(paymentsList.count()).toEqual(1);
    page.expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(0),
      payments[0].amount.display,
      payments[0].subject,
      payments[0].paidAt,
      ''
    );
  });

  ///////////////

  // tslint:disable-next-line: max-line-length
  it('should delete family payment by clicking delete button in table row and update payments list', () => {
    expect(getUserPayments().count()).toEqual(0);
    const userPayment = {
      amount: { value: '75', display: '$75' },
      subject: 'apartment',
      paidAt: moment()
        .subtract(2, 'days')
        .format('MM/DD/YYYY, h:mm:ss')
    };

    const familyPayments = [
      {
        amount: { value: '350', display: '€350' },
        subject: 'apartment',
        paidAt: moment().format('MM/DD/YYYY, h:mm:ss')
      },
      {
        amount: { value: '190', display: '€190' },
        subject: 'apartment',
        paidAt: moment()
          .subtract(3, 'days')
          .format('MM/DD/YYYY, h:mm:ss')
      }
    ];

    const familyName = 'Peterson';
    page.createFamily(familyName, 'Euro');
    page.createFamilyPayment(
      familyName,
      familyPayments[0].amount.value,
      familyPayments[0].subject,
      familyPayments[0].paidAt
    );
    page.createFamilyPayment(
      familyName,
      familyPayments[1].amount.value,
      familyPayments[1].subject,
      familyPayments[1].paidAt,
      false
    );
    page.goToPage();
    waitForUserPaymentsList();

    page.createUserPayment(
      userPayment.amount.value,
      userPayment.subject,
      userPayment.paidAt
    );
    let paymentsList = getUserPayments();
    expect(paymentsList.count()).toEqual(3);
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
    paymentsList = getUserPayments();
    expect(paymentsList.count()).toEqual(2);
    page.expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(0),
      userPayment.amount.display,
      userPayment.subject,
      userPayment.paidAt,
      ''
    );
    page.expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(1),
      familyPayments[1].amount.display,
      familyPayments[1].subject,
      familyPayments[1].paidAt,
      familyName
    );
    paymentsList = page.getFamilyPayments(familyName);
    expect(paymentsList.count()).toEqual(1);
    page.expectFamilyPaymentToBeDisplayedCorrectly(
      paymentsList.get(0),
      familyPayments[1].amount.display,
      `${testedUser.firstName} ${testedUser.lastName}`,
      familyPayments[1].subject,
      familyPayments[1].paidAt
    );

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

    page.goToPage();
    waitForUserPaymentsList();

    paymentsList = getUserPayments();
    expect(paymentsList.count()).toEqual(1);
    page.expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(0),
      userPayment.amount.display,
      userPayment.subject,
      userPayment.paidAt,
      ''
    );
  });

  // tslint:disable-next-line: max-line-length
  it('should delete family payment by clicking delete button in edit payment form and update payments list', () => {
    expect(getUserPayments().count()).toEqual(0);
    const userPayment = {
      amount: { value: '75', display: '$75' },
      subject: 'apartment',
      paidAt: moment()
        .subtract(2, 'days')
        .format('MM/DD/YYYY, h:mm:ss')
    };

    const familyPayments = [
      {
        amount: { value: '350', display: '€350' },
        subject: 'apartment',
        paidAt: moment().format('MM/DD/YYYY, h:mm:ss')
      },
      {
        amount: { value: '190', display: '€190' },
        subject: 'apartment',
        paidAt: moment()
          .subtract(3, 'days')
          .format('MM/DD/YYYY, h:mm:ss')
      }
    ];

    const familyName = 'Peterson';
    page.createFamily(familyName, 'Euro');
    page.createFamilyPayment(
      familyName,
      familyPayments[0].amount.value,
      familyPayments[0].subject,
      familyPayments[0].paidAt
    );
    page.createFamilyPayment(
      familyName,
      familyPayments[1].amount.value,
      familyPayments[1].subject,
      familyPayments[1].paidAt,
      false
    );
    page.goToPage();
    waitForUserPaymentsList();

    page.createUserPayment(
      userPayment.amount.value,
      userPayment.subject,
      userPayment.paidAt
    );
    let paymentsList = getUserPayments();
    expect(paymentsList.count()).toEqual(3);

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

    paymentsList = getUserPayments();
    expect(paymentsList.count()).toEqual(2);
    page.expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(0),
      userPayment.amount.display,
      userPayment.subject,
      userPayment.paidAt,
      ''
    );
    page.expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(1),
      familyPayments[1].amount.display,
      familyPayments[1].subject,
      familyPayments[1].paidAt,
      familyName
    );
    paymentsList = page.getFamilyPayments(familyName);
    expect(paymentsList.count()).toEqual(1);
    page.expectFamilyPaymentToBeDisplayedCorrectly(
      paymentsList.get(0),
      familyPayments[1].amount.display,
      `${testedUser.firstName} ${testedUser.lastName}`,
      familyPayments[1].subject,
      familyPayments[1].paidAt
    );

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

    page.goToPage();
    waitForUserPaymentsList();
    paymentsList = getUserPayments();
    expect(paymentsList.count()).toEqual(1);
    page.expectPaymentToBeDisplayedCorrectly(
      paymentsList.get(0),
      userPayment.amount.display,
      userPayment.subject,
      userPayment.paidAt,
      ''
    );
  });

  function getUserPayments() {
    return element.all(by.css('payment-user-payment-list tbody tr'));
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
