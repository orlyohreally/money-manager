import { clearLocalStorage } from '@src-e2e/shared/';
import { EmailVerificationPage } from './email-verification.po';

describe('Email Verification Page', () => {
  let page: EmailVerificationPage;

  beforeAll(() => {
    page = new EmailVerificationPage();
  });

  beforeEach(() => {
    page.goToPage();
    clearLocalStorage();
  });
});
