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
    this.registrationPage.registerAsTestedUser();
  }

  loginAsTestedUser() {
    this.goToPage();
    typeInInput('email', testedUser.email);
    typeInInput('password', testedUser.password);
    submitForm();
  }

  get registrationPageUrl(): string {
    return getPageUrl('registration');
  }
}
