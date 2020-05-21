import { browser, by, element, ExpectedConditions, Key } from 'protractor';

import { LoginPage } from '@src-e2e/auth/login.po';
import {
  clearLocalStorage,
  constants,
  getPageUrl,
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
    this.familiesPage.createFamily(familyName, 'israel', []);
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
    input.sendKeys(Key.chord(Key.CONTROL, 'a'));
    for (const character of paidAt) {
      input.sendKeys(character);
    }
  }
}
