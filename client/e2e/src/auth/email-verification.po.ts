import { goToPage } from '@src-e2e/shared';

export class EmailVerificationPage {
  async goToPage(): Promise<void> {
    return goToPage('emailVerification');
  }
}
