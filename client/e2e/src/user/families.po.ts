import { browser, by, element, ExpectedConditions } from 'protractor';

import { LoginPage } from '@src-e2e/auth/login.po';
import { LogoutPage } from '@src-e2e/auth/logout.po';
import { RegistrationPage } from '@src-e2e/auth/registration.po';
import {
  constants,
  escapeRegExp,
  getPageUrl,
  submitForm,
  testedUser,
  typeInInput,
  waitForForm
} from '@src-e2e/shared';

export class FamiliesPage {
  pageUrl = getPageUrl('families');

  private loginPage = new LoginPage();
  private registrationPage = new RegistrationPage();
  private logoutPage = new LogoutPage();

  login(user = testedUser) {
    this.loginPage.login(user);
  }

  register(user: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    this.registrationPage.register(user);
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

  createFamily(name: string, currency: string, roles: string[] = []) {
    browser.wait(
      ExpectedConditions.presenceOf(this.getCreateFamilyButton()),
      constants.waitTimeout
    );
    this.getCreateFamilyButton().click();
    typeInInput('family-name', name, '.cdk-overlay-container');

    this.selectCurrency(currency);
    roles.forEach(role => {
      element(by.cssContainingText('.mat-checkbox-label', role)).click();
    });
    submitForm('.cdk-overlay-container');
  }

  async fillAndSubmitFamilyForm(name: string, currency: string) {
    typeInInput('family-name', name, '.cdk-overlay-container');
    this.selectCurrency(currency);
    submitForm('.cdk-overlay-container');
  }

  selectCurrency(currency: string) {
    const selectName = 'currency';
    const select = element(by.css(`mat-select[name="${selectName}"]`));
    select.click();
    const options = element
      .all(
        by.cssContainingText('.mat-select-search-panel mat-option', currency)
      )
      .get(0);
    options.click();
  }

  addFamilyMember(
    familyName: string,
    memberEmail: string,
    roles: string[] = []
  ) {
    this.goToFamilyPage(familyName);
    browser.wait(
      ExpectedConditions.urlContains(`${escapeRegExp(getPageUrl('family'))}`),
      constants.waitTimeout
    );
    const dialogWrapperClass = '.cdk-overlay-container';
    element(by.partialButtonText('Add member')).click();
    waitForForm(dialogWrapperClass);
    typeInInput('member-email', memberEmail, dialogWrapperClass);
    roles.forEach(roleName => {
      element(by.cssContainingText('.member-roles-list', roleName)).click();
    });
    submitForm(dialogWrapperClass);
  }

  async goToFamilyPage(familyName: string) {
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
        .element(by.partialLinkText('Dashboard'));
    browser.wait(
      ExpectedConditions.presenceOf(getLink()),
      constants.waitTimeout
    );
    getLink().click();
  }

  logout() {
    this.logoutPage.goToPage();
  }
}
