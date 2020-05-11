import { browser } from 'protractor';

import {
  clearLocalStorage,
  deleteTestedUser,
  getSubmitButton,
  getTextTitle,
  getTitleText
} from '@src-e2e/shared';
import { LoginPage } from './login.po';

describe('Login Page', () => {
  let page: LoginPage;

  beforeAll(() => {
    deleteTestedUser();
    page = new LoginPage();
  });

  beforeEach(() => {
    clearLocalStorage();
    page.goToPage();
  });

  it('should have correct page title', () => {
    expect(getTitleText()).toEqual('Login | Money Manager');
  });

  it('should have correct text title', () => {
    expect(getTextTitle()).toEqual('Log In');
  });

  it('should have link to registration page', () => {
    expect(page.getSignInLink().isPresent).toBeTruthy();
    expect(page.getSignInLink().getAttribute('href')).toEqual(
      page.registrationPageUrl
    );
  });

  it('should display submit button with text "Log In"', () => {
    expect(getSubmitButton().getText()).toBe('Log In');
  });

  // tslint:disable-next-line: max-line-length
  it('should not redirect to main page when user is not registered', () => {
    deleteTestedUser();
    page.loginAsTestedUser();

    expect(browser.getCurrentUrl()).toEqual(page.pageUrl);
    expect(getSubmitButton().isDisplayed).toBeTruthy();
    expect(page.getNotificationBlock().getText()).toBeTruthy();
  });

  it(
    'should redirect to main page' +
      ' when form is valid and user is already registered',
    async () => {
      page.registerAsTestedUser();
      page.loginAsTestedUser();

      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).toEqual(page.mainPageUrl);
    }
  );
});
