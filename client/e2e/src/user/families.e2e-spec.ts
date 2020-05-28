import {
  browser,
  by,
  element,
  ElementFinder,
  ExpectedConditions
} from 'protractor';

import { constants, registerUser } from '@src-e2e/shared';
import {
  escapeRegExp,
  getPageUrl,
  getTextTitle,
  getTitleText,
  resetTestedUser
} from '@src-e2e/shared/';
import { FamiliesPage } from './families.po';

describe('Families Page', () => {
  let page: FamiliesPage;

  beforeAll(() => {
    registerUser();
    page = new FamiliesPage();
  });

  beforeEach(() => {
    resetTestedUser();
    page.login();
    page.goToPage();
  });

  it('should have correct page title', () => {
    expect(getTitleText()).toEqual('My families | Family Expenses');
  });

  it('should have correct text title', () => {
    expect(getTextTitle()).toEqual('My families');
  });

  it('should have button to create new family', () => {
    expect(page.getCreateFamilyButton()).toBeTruthy();
  });

  it(
    'should create family without family avatar,' +
      'then redirect to family page and update families list',
    () => {
      expect(getFamiliesCards().count()).toEqual(0);
      expect(element(by.className('card-list')).getText()).toEqual(
        'No families added yet...'
      );
      const familyNames = ['Petrov', 'Petrov II'];
      page.createFamily(familyNames[0], '$', ['Admin']);
      const urlPattern = `${escapeRegExp(
        getPageUrl('family')
      )}\/[0-9a-z]*\/dashboard`;
      expect(browser.getCurrentUrl()).toMatch(urlPattern);

      page.goToPage();
      browser.wait(
        ExpectedConditions.presenceOf(element(by.css('family-families'))),
        constants.waitTimeout
      );

      let familiesCards = getFamiliesCards();
      expect(familiesCards.count()).toEqual(1);
      expectFamilyToBeDisplayedCorrectly(
        familiesCards.get(0),
        familyNames[0],
        'Spent: $0'
      );

      page.createFamily(familyNames[1], 'Israel');
      page.goToPage();
      browser.wait(
        ExpectedConditions.presenceOf(element(by.css('family-families'))),
        constants.waitTimeout
      );

      familiesCards = getFamiliesCards();
      expect(familiesCards.count()).toEqual(2);
      expectFamilyToBeDisplayedCorrectly(
        familiesCards.get(0),
        familyNames[0],
        'Spent: $0'
      );
      expectFamilyToBeDisplayedCorrectly(
        familiesCards.get(1),
        familyNames[1],
        'Spent: ₪0'
      );
    }
  );

  it('should have button to update family info', () => {
    page.createFamily('Petrov', '$');
    const waitTimeout = 30000;
    browser.wait(
      ExpectedConditions.urlContains(`${escapeRegExp(getPageUrl('family'))}`),
      waitTimeout
    );
    page.goToPage();
    browser.wait(
      ExpectedConditions.presenceOf(element(by.css('family-families'))),
      constants.waitTimeout
    );

    getFamiliesCards()
      .get(0)
      .element(by.cssContainingText('mat-icon', 'create'))
      .click();
    const updatedName = 'Ivanov';
    page.fillAndSubmitFamilyForm(updatedName, 'Israel');
    const familiesCards = getFamiliesCards();
    expect(familiesCards.count()).toEqual(1);
    expectFamilyToBeDisplayedCorrectly(
      familiesCards.get(0),
      updatedName,
      'Spent: ₪0'
    );
  });

  function getFamiliesCards() {
    return element.all(by.css('family-card'));
  }

  async function expectFamilyToBeDisplayedCorrectly(
    familyCard: ElementFinder,
    familyName: string,
    spent: string
  ) {
    const cardTitle = familyCard.element(by.className('card__title'));
    const familySpent = familyCard
      .all(by.className('payment-statistics__item'))
      .first();

    expect(cardTitle.getText()).toEqual(familyName);
    expect((await familySpent.getText()).replace(/\r?\n|\r/g, ' ')).toEqual(
      spent
    );
  }
});
