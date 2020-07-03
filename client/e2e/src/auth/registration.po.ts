import { by, element } from 'protractor';

import {
  deleteTestedUser,
  getPageUrl,
  goToPage,
  submitForm,
  testedUser,
  typeInInput
} from '@src-e2e/shared';

export class RegistrationPage {
  pageUrl = getPageUrl('registration');
  loginPageUrl = getPageUrl('login');

  async goToPage(): Promise<void> {
    return goToPage('registration');
  }

  getLoginLink() {
    return element(by.partialLinkText('Log in'));
  }

  getNotificationBlock() {
    return element(by.className('notification-message'));
  }

  registerAsTestedUser() {
    deleteTestedUser();
    this.goToPage();

    typeInInput('first-name', testedUser.firstName);
    typeInInput('last-name', testedUser.lastName);
    typeInInput('email', testedUser.email);
    typeInInput('password', testedUser.password);
    typeInInput('password-again', testedUser.password);
    submitForm('.page-content');
  }

  get emailVerificationPageUrl() {
    return getPageUrl('emailVerification');
  }
}
