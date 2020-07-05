import { browser, by, element, ExpectedConditions } from 'protractor';

import { LoginPage } from '@src-e2e/auth/login.po';
import { LogoutPage } from '@src-e2e/auth/logout.po';
import { RegistrationPage } from '@src-e2e/auth/registration.po';
import {
  constants,
  getPageUrl,
  submitForm,
  testedUser,
  typeInInput,
  waitForForm
} from '@src-e2e/shared';
import { FamiliesPage } from '@src-e2e/user/families.po';

export class DashboardPage {
  pageUrl = getPageUrl('payments');

  private loginPage = new LoginPage();
  private familiesPage = new FamiliesPage();
  private logoutPage = new LogoutPage();
  private registrationPage = new RegistrationPage();

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

  logout() {
    this.logoutPage.goToPage();
  }

  goToFamiliesPage() {
    this.familiesPage.goToPage();
  }

  createFamily(name: string, currency: string, roles: string[] = []) {
    this.familiesPage.createFamily(name, currency, roles);
  }

  async goToFamilyPage(familyName: string) {
    this.familiesPage.goToFamilyPage(familyName);
  }

  addFamilyMember(
    familyName: string,
    memberEmail: string,
    roles: string[] = []
  ) {
    this.goToFamilyPage(familyName);
    browser.wait(
      ExpectedConditions.presenceOf(element(by.css('.family-card'))),
      constants.waitTimeout
    );
    const dialogWrapperClass = '.cdk-overlay-container';
    this.getAddMemberButton().click();
    waitForForm(dialogWrapperClass);
    typeInInput('member-email', memberEmail, dialogWrapperClass);
    roles.forEach(roleName => {
      element(by.cssContainingText('.member-roles-list', roleName)).click();
    });
    submitForm(dialogWrapperClass);
  }

  getEditFamilyButton() {
    return element(by.partialButtonText('Edit family'));
  }

  getAddMemberButton() {
    return element(by.partialButtonText('Add member'));
  }
}
