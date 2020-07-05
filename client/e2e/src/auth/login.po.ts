import { by, element } from 'protractor';

import {
  getPageUrl,
  goToPage,
  submitForm,
  testedUser,
  typeInInput
} from '@src-e2e/shared';
import { RegistrationPage } from './registration.po';

export class LoginPage {
  pageUrl = getPageUrl('login');
  mainPageUrl = getPageUrl('main');

  private registrationPage = new RegistrationPage();

  async goToPage(): Promise<void> {
    return goToPage('login');
  }

  getSignInLink() {
    return element(by.partialLinkText('Create an account'));
  }

  getNotificationBlock() {
    return element(by.className('notification-message'));
  }

  registerAsTestedUser() {
    this.registrationPage.register();
  }

  login(
    user: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    } = testedUser
  ) {
    this.goToPage();
    typeInInput('email', user.email, '.page-content');
    typeInInput('password', user.password, '.page-content');
    submitForm('.page-content');
  }

  get registrationPageUrl(): string {
    return getPageUrl('registration');
  }
}
