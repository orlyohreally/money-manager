import { by, element } from 'protractor';

export class LogoutPage {
  goToPage() {
    element(by.css('nav-user-menu-opener')).click();
    element(by.partialLinkText('Log out')).click();
  }
}
