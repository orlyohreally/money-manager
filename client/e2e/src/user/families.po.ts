import { browser, by, element, ExpectedConditions, Key } from 'protractor';

import { LoginPage } from '@src-e2e/auth/login.po';
import {
  clearLocalStorage,
  getPageUrl,
  goToPage,
  submitForm,
  typeInInput
} from '@src-e2e/shared';

export class FamiliesPage {
  pageUrl = getPageUrl('families');

  private loginPage = new LoginPage();

  login() {
    goToPage('main');
    clearLocalStorage();
    this.loginPage.loginAsTestedUser();
  }

  async goToPage(): Promise<void> {
    const EC = ExpectedConditions;
    const waitTimeout = 30000;
    browser.wait(
      EC.presenceOf(element(by.partialLinkText('My families'))),
      waitTimeout
    );
    element(by.partialLinkText('My families')).click();
  }

  getCreateFamilyButton() {
    return element(by.partialButtonText('Add family'));
  }

  async createFamily(name: string, currency: string, roles: string[] = []) {
    this.getCreateFamilyButton().click();
    typeInInput('family-name', name);

    this.selectCurrency(currency);
    roles.forEach(role => {
      element(by.cssContainingText('.mat-checkbox-label', role)).click();
    });
    submitForm();
  }

  async fillAndSubmitFamilyForm(name: string, currency: string) {
    typeInInput('family-name', name);
    this.selectCurrency(currency);
    submitForm();
  }

  selectCurrency(currency: string) {
    const selectName = 'currency';
    const select = element(by.css(`mat-select[name="${selectName}"]`));
    select.click();
    const searchInput = browser.switchTo().activeElement();
    searchInput.sendKeys(currency);
    searchInput.sendKeys(Key.ENTER);
  }
}
