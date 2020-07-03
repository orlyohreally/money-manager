import * as moment from 'moment';
import {
  browser,
  by,
  element,
  ElementFinder,
  ExpectedConditions
} from 'protractor';

import { LoginPage } from '@src-e2e/auth/login.po';
import { FamilyPaymentsPage } from '@src-e2e/payments/payments-list.po';
import {
  clearLocalStorage,
  constants,
  getPageUrl,
  setDatetimeInput,
  submitForm,
  typeInInput
} from '@src-e2e/shared';
import { FamiliesPage } from './families.po';

export class UserPaymentsPage {
  pageUrl = getPageUrl('user-payments');

  private loginPage = new LoginPage();
  private familiesPage = new FamiliesPage();
  private familyPaymentsPage = new FamilyPaymentsPage();

  login() {
    clearLocalStorage();
    this.loginPage.loginAsTestedUser();
  }

  async goToPage(): Promise<void> {
    const sizes = await browser
      .manage()
      .window()
      .getSize();
    if (sizes.width < constants.menuScreenThreshold) {
      element(by.partialButtonText('menu')).click();
    }
    const getLink = () => element(by.partialLinkText('My payments'));
    browser.wait(
      ExpectedConditions.presenceOf(getLink()),
      constants.waitTimeout
    );
    getLink().click();
  }

  getCreatePaymentButton() {
    return element(by.partialButtonText('New payment'));
  }

  async createUserPayment(amount: string, subject: string, paidAt: string) {
    this.getCreatePaymentButton().click();
    const waitTimeout = 30000;
    const getForm = () => element(by.css('.cdk-overlay-container form'));
    browser.wait(ExpectedConditions.presenceOf(getForm()), waitTimeout);
    this.fillAndSubmitPaymentForm(amount, subject, paidAt);
  }

  selectSubject(subject: string) {
    const select = element(
      by.css('.cdk-overlay-container form mat-select[name="payment-subject"]')
    );
    select.click();
    const options = element.all(by.cssContainingText('mat-option', subject));
    options.get(0).click();
  }

  fillAndSubmitPaymentForm(amount: string, subject: string, paidAt: string) {
    setDatetimeInput('.cdk-overlay-container form', paidAt);
    typeInInput('payment-amount', amount);
    this.selectSubject(subject);

    submitForm('.cdk-overlay-container');
  }

  createFamily(familyName: string, currency: string) {
    this.familiesPage.goToPage();
    browser.wait(
      ExpectedConditions.presenceOf(this.familiesPage.getCreateFamilyButton()),
      constants.waitTimeout
    );
    this.familiesPage.createFamily(familyName, currency, []);
  }

  goToFamilyPage(familyName: string) {
    this.familyPaymentsPage.goToPage(familyName);
  }

  createFamilyPayment(
    familyName: string,
    amount: string,
    subject: string,
    paidAt: string,
    goToFamilyPaymentsPage = true
  ) {
    if (goToFamilyPaymentsPage) {
      this.familyPaymentsPage.goToPage(familyName);
      browser.wait(
        ExpectedConditions.presenceOf(
          this.familyPaymentsPage.getCreatePaymentButton()
        ),
        constants.waitTimeout
      );
    }
    this.familyPaymentsPage.createFamilyPayment(amount, subject, paidAt);
  }

  expectPaymentToBeDisplayedCorrectly(
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
    expect(columns.get(3).getText()).toEqual(
      moment(paidAt).format('M/D/YY, h:mm A')
    );
  }

  getFamilyPayments(familyName: string) {
    this.goToFamilyPage(familyName);
    this.familyPaymentsPage.waitForFamilyPaymentsList();
    return this.familyPaymentsPage.getFamilyPayments();
  }

  expectFamilyPaymentToBeDisplayedCorrectly(
    paymentEl: ElementFinder,
    amount: string,
    userFullName: string,
    subject: string,
    paidAt: string
  ) {
    this.familyPaymentsPage.expectPaymentToBeDisplayedCorrectly(
      paymentEl,
      amount,
      userFullName,
      subject,
      paidAt
    );
  }
}
