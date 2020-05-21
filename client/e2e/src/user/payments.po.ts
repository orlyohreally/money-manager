import { browser, by, element, ExpectedConditions, Key } from 'protractor';

import { LoginPage } from '@src-e2e/auth/login.po';
import { FamilyPaymentsPage } from '@src-e2e/payments/payments-list.po';
import {
  clearLocalStorage,
  constants,
  getPageUrl,
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
    const getForm = () => element(by.tagName('form'));
    browser.wait(ExpectedConditions.presenceOf(getForm()), waitTimeout);
    this.fillAndSubmitPaymentForm(amount, subject, paidAt);
  }

  selectSubject(subject: string) {
    const select = element(by.css('mat-select[name="payment-subject"]'));
    select.click();
    const options = element.all(by.cssContainingText('mat-option', subject));
    options.get(0).click();
  }

  fillAndSubmitPaymentForm(amount: string, subject: string, paidAt: string) {
    typeInInput('payment-amount', amount);
    this.typeInPaidDate(paidAt);
    this.selectSubject(subject);

    submitForm();
  }

  typeInPaidDate(paidAt: string) {
    const input = element(by.css(`input[name="payment-date"]`));
    input.click();
    input.sendKeys(Key.chord(Key.CONTROL, 'a'));
    for (const character of paidAt) {
      input.sendKeys(character);
    }
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
    paidAt: string
  ) {
    this.familyPaymentsPage.goToPage(familyName);
    browser.wait(
      ExpectedConditions.presenceOf(
        this.familyPaymentsPage.getCreatePaymentButton()
      ),
      constants.waitTimeout
    );
    this.familyPaymentsPage.createFamilyPayment(amount, subject, paidAt);
  }
}
