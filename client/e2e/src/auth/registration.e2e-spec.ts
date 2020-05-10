import { browser } from 'protractor';

import {
  clearLocalStorage,
  deleteTestedUser,
  escapeRegExp,
  getSubmitButton,
  getTextTitle,
  getTitleText,
  submitForm,
  testedUser,
  typeInInput
} from '@src-e2e/shared/';
import { RegistrationPage } from './registration.po';

describe('Registration Page', () => {
  let page: RegistrationPage;

  beforeAll(() => {
    deleteTestedUser();
    page = new RegistrationPage();
  });

  beforeEach(() => {
    page.goToPage();
    clearLocalStorage();
    page.goToPage();
  });

  it('should have correct page title', () => {
    expect(getTitleText()).toEqual('Sign in | Money Manager');
  });

  it('should have correct text title', () => {
    expect(getTextTitle()).toEqual('Sign up');
  });

  it('should have link to log in page', () => {
    expect(page.getLoginLink().isPresent).toBeTruthy();
    expect(page.getLoginLink().getAttribute('href')).toEqual(page.loginPageUrl);
  });

  it('should display submit button with text "Sign in"', () => {
    expect(getSubmitButton().getText()).toBe('Sign in');
  });

  it(
    'should redirect to email verification page' +
      ' when form is valid and user was successfully registered',
    async () => {
      page.registerAsTestedUser();
      const emailParam = `email=${escapeRegExp(testedUser.email)}`;
      const tokenPattern = `verification-token=*`;
      const urlPattern = new RegExp(
        // tslint:disable-next-line: max-line-length
        `${page.emailVerificationPageUrl}\\?(${emailParam}\&${tokenPattern}|${tokenPattern}\&${emailParam})`
      );
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toMatch(urlPattern);
    }
  );

  it('should not redirect when email is already taken', () => {
    page.registerAsTestedUser();
    page.goToPage();

    typeInInput('first-name', 'Ivan I');
    typeInInput('last-name', 'Samuel');
    typeInInput('email', testedUser.email);
    typeInInput('password', 'ABCabc123!@#');
    typeInInput('password-again', 'ABCabc123!@#');
    submitForm();

    expect(browser.getCurrentUrl()).toEqual(page.pageUrl);
    expect(getSubmitButton().isDisplayed).toBeTruthy();
    expect(page.getNotificationBlock().getText()).toBeTruthy();
  });
});
