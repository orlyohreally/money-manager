import { browser, ExpectedConditions } from 'protractor';

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
    clearLocalStorage();
    page.goToPage();
  });

  it('should have correct page title', () => {
    expect(getTitleText()).toEqual('Sign in | Family Expenses');
  });

  it('should have correct text title', () => {
    expect(getTextTitle()).toEqual('Sign up');
  });

  it('should have link to log in page', () => {
    expect(page.getLoginLink().isPresent).toBeTruthy();
    expect(page.getLoginLink().getAttribute('href')).toEqual(page.loginPageUrl);
  });

  it('should display submit button with text "Sign in"', () => {
    expect(getSubmitButton('.page-content').getText()).toBe('Sign in');
  });

  it(
    'should redirect to email verification page' +
      ' when form is valid and user was successfully registered',
    async () => {
      page.register();
      const emailParam = `email=${escapeRegExp(testedUser.email)}`;
      const tokenPattern = `verification-token=*`;
      const urlPattern = new RegExp(
        // tslint:disable-next-line: max-line-length
        `${page.emailVerificationPageUrl}\\?(${emailParam}\&${tokenPattern}|${tokenPattern}\&${emailParam})`
      );
      const waitTimeout = 30000;
      browser.wait(
        ExpectedConditions.urlContains(`${page.emailVerificationPageUrl}`),
        waitTimeout
      );
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toMatch(urlPattern);
    }
  );

  it('should not redirect when email is already taken', () => {
    page.register();
    page.goToPage();

    typeInInput('first-name', 'Ivan I', '.page-content');
    typeInInput('last-name', 'Samuel', '.page-content');
    typeInInput('email', testedUser.email, '.page-content');
    typeInInput('password', 'ABCabc123!@#', '.page-content');
    typeInInput('password-again', 'ABCabc123!@#', '.page-content');
    submitForm('.page-content');

    const waitTimeout = 30000;
    browser.wait(
      ExpectedConditions.presenceOf(page.getNotificationBlock()),
      waitTimeout
    );
    expect(browser.getCurrentUrl()).toEqual(page.pageUrl);
  });
});
