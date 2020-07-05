import { browser, by, element, ExpectedConditions } from 'protractor';

import { constants, registerUser } from '@src-e2e/shared';
import { resetTestedUser } from '@src-e2e/shared/';
import { DashboardPage } from './dashboard.po';

describe('Family payments Page', () => {
  let page: DashboardPage;

  beforeAll(() => {
    registerUser();
    page = new DashboardPage();
  });

  beforeEach(() => {
    resetTestedUser();
    page.login();
    page.goToFamiliesPage();
  });

  // tslint:disable-next-line: max-line-length
  it('should not have button to update family info if user is only a member', () => {
    const familyName = 'Petrov';
    page.createFamily(familyName, '$');
    page.logout();
    const member = {
      firstName: 'Ivan',
      lastName: 'Sidorov',
      email: 'orli.knop@ya.ru',
      password: 'ABCabc123!@#'
    };
    page.register(member);
    page.login();
    page.addFamilyMember(familyName, member.email);
    page.logout();
    page.login(member);
    page.goToFamilyPage(familyName);
    browser.wait(
      ExpectedConditions.presenceOf(element(by.css('.family-card'))),
      constants.waitTimeout
    );
    expect(page.getEditFamilyButton().isPresent()).toBeFalsy();
  });

  // tslint:disable-next-line: max-line-length
  it('should not have button to add family member if user is only a member', () => {
    const familyName = 'Petrov';
    page.createFamily(familyName, '$');
    page.logout();
    const member = {
      firstName: 'Ivan',
      lastName: 'Sidorov',
      email: 'orli.knop@ya.ru',
      password: 'ABCabc123!@#'
    };
    page.register(member);
    page.login();
    page.addFamilyMember(familyName, member.email);
    page.logout();
    page.login(member);
    page.goToFamilyPage(familyName);
    browser.wait(
      ExpectedConditions.presenceOf(element(by.css('.family-card'))),
      constants.waitTimeout
    );
    expect(page.getAddMemberButton().isPresent()).toBeFalsy();
  });
});
