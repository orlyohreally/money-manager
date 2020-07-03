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

    typeInInput('first-name', testedUser.firstName, '.page-content');
    typeInInput('last-name', testedUser.lastName, '.page-content');
    typeInInput('email', testedUser.email, '.page-content');
    typeInInput('password', testedUser.password, '.page-content');
    typeInInput('password-again', testedUser.password, '.page-content');
    submitForm('.page-content');
  }

  get emailVerificationPageUrl() {
    return getPageUrl('emailVerification');
  }
}
