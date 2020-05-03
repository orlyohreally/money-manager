import { browser, by, element } from 'protractor';
import { HttpClient } from 'protractor-http-client';

import {
  getPageUrl,
  goToPage,
  submitForm,
  testedUser,
  typeInInput
} from '@src-e2e/shared';

export class RegistrationPage {
  pageUrl = getPageUrl('registration');
  loginPageUrl = getPageUrl('login');

  private http = new HttpClient(browser.params.backendURL);

  async goToPage(): Promise<void> {
    return goToPage('registration');
  }

  getLoginLink() {
    return element(by.partialLinkText('Log in'));
  }

  getNotificationBlock() {
    return element(by.className('notification-message'));
  }

  deleteTestedUser() {
    // tslint:disable-next-line: max-line-length
    const testingUsersApi = `/testing/user/${testedUser.email}`;
    const deleteResponse = this.http.delete(testingUsersApi, {
      Authorization: browser.params.testingCredentials
    });
    expect(deleteResponse.statusCode).toEqual(200);
  }

  registerAsTestedUser() {
    this.deleteTestedUser();

    typeInInput('first-name', testedUser.firstName);
    typeInInput('last-name', testedUser.lastName);
    typeInInput('email', testedUser.email);
    typeInInput('password', testedUser.password);
    typeInInput('password-again', testedUser.password);
    submitForm();
  }

  get emailVerificationPageUrl() {
    return getPageUrl('emailVerification');
  }
}
