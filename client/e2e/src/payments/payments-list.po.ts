import * as moment from 'moment';
import {
  browser,
  by,
  element,
  ElementFinder,
  ExpectedConditions
} from 'protractor';

import { LoginPage } from '@src-e2e/auth/login.po';
import {
  clearLocalStorage,
  constants,
  getPageUrl,
  setDatetimeInput,
  submitForm,
  typeInInput
} from '@src-e2e/shared';
import { FamiliesPage } from '@src-e2e/user/families.po';

export class FamilyPaymentsPage {
  pageUrl = getPageUrl('payments');

  private loginPage = new LoginPage();
  private familiesPage = new FamiliesPage();

  login() {
    clearLocalStorage();
    this.loginPage.loginAsTestedUser();
  }

  goToFamiliesPage() {
    this.familiesPage.goToPage();
  }

  createFamily(familyName: string) {
    this.familiesPage.createFamily(familyName, 'Israel', []);
  }

  async goToPage(familyName: string): Promise<void> {
    const sizes = await browser
      .manage()
      .window()
      .getSize();
    if (sizes.width < constants.menuScreenThreshold) {
      element(by.partialButtonText('menu')).click();
    }
    const getLink = () =>
      element(by.partialButtonText(familyName))
        .element(by.xpath('../..'))
        .element(by.partialLinkText('Family payments'));
    browser.wait(
      ExpectedConditions.presenceOf(getLink()),
      constants.waitTimeout
    );
    getLink().click();
  }

  getCreatePaymentButton() {
    return element(by.partialButtonText('New payment'));
  }

  async createFamilyPayment(amount: string, subject: string, paidAt: string) {
    this.getCreatePaymentButton().click();
    const waitTimeout = 30000;
    const getForm = () => element(by.tagName('form'));
    browser.wait(ExpectedConditions.presenceOf(getForm()), waitTimeout);
    this.fillAndSubmitPaymentForm(amount, subject, paidAt);
  }

  selectSubject(subject: string) {
    const select = element(by.css('form mat-select[name="payment-subject"]'));
    select.click();
    const options = element.all(by.cssContainingText('mat-option', subject));
    options.get(0).click();
  }

  fillAndSubmitPaymentForm(amount: string, subject: string, paidAt: string) {
    setDatetimeInput('form', paidAt);
    typeInInput('payment-amount', amount);
    this.selectSubject(subject);

    submitForm();
  }

  expectPaymentToBeDisplayedCorrectly(
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
    expect(columns.get(3).getText()).toEqual(
      moment(paidAt).format('M/D/YY, h:mm A')
    );
  }

  getFamilyPayments() {
    return element.all(by.css('payment-payment-list tbody tr'));
  }

  waitForFamilyPaymentsList() {
    browser.wait(
      ExpectedConditions.presenceOf(element(by.css('payment-payment-list'))),
      constants.waitTimeout
    );
  }
}
