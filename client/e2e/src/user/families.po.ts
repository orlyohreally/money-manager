import { browser, by, element, ExpectedConditions, Key } from 'protractor';

import { LoginPage } from '@src-e2e/auth/login.po';
import {
  clearLocalStorage,
  constants,
  getPageUrl,
  submitForm,
  typeInInput
} from '@src-e2e/shared';

export class FamiliesPage {
  pageUrl = getPageUrl('families');

  private loginPage = new LoginPage();

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

    const getLink = () => element(by.partialLinkText('My families'));
    browser.wait(
      ExpectedConditions.presenceOf(getLink()),
      constants.waitTimeout
    );
    getLink().click();
  }

  getCreateFamilyButton() {
    return element(by.partialButtonText('Add family'));
  }

  async createFamily(name: string, currency: string, roles: string[] = []) {
    browser.wait(
      ExpectedConditions.presenceOf(this.getCreateFamilyButton()),
      constants.waitTimeout
    );
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
    for (const character of currency) {
      searchInput.sendKeys(character);
    }
    searchInput.sendKeys(Key.ENTER);
  }
}
