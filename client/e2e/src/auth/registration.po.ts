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

  register(
    user: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    } = testedUser
  ) {
    if (testedUser.email === user.email) {
      deleteTestedUser();
    }
    this.goToPage();

    typeInInput('first-name', user.firstName, '.page-content');
    typeInInput('last-name', user.lastName, '.page-content');
    typeInInput('email', user.email, '.page-content');
    typeInInput('password', user.password, '.page-content');
    typeInInput('password-again', user.password, '.page-content');
    submitForm('.page-content');
  }

  get emailVerificationPageUrl() {
    return getPageUrl('emailVerification');
  }
}
