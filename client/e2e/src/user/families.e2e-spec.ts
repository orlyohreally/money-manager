import { browser, by, element, ElementFinder } from 'protractor';

import {
  escapeRegExp,
  getPageUrl,
  getTextTitle,
  getTitleText
} from '@src-e2e/shared/';
import { FamiliesPage } from './families.po';

describe('Families Page', () => {
  let page: FamiliesPage;

  beforeAll(() => {
    page = new FamiliesPage();
  });

  beforeEach(() => {
    page.login();
    page.goToPage();
  });

  it('should have correct page title', () => {
    expect(getTitleText()).toEqual('My families | Money Manager');
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
      page.createFamily(familyNames[0], 'USD', ['Admin']);
      const urlPattern = `${escapeRegExp(
        getPageUrl('family')
      )}\/[0-9a-z]*\/dashboard`;
      expect(browser.getCurrentUrl()).toMatch(urlPattern);
      page.goToPage();
      let familiesCards = getFamiliesCards();
      expect(familiesCards.count()).toEqual(1);
      expectFamilyToBeDisplayedCorrectly(
        familiesCards.get(0),
        familyNames[0],
        'Spent: $0'
      );

      page.createFamily(familyNames[1], 'Israel');
      page.goToPage();
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
    page.createFamily('Petrov', 'USD');
    const updatedName = 'Ivanov';
    page.goToPage();
    getFamiliesCards()
      .get(0)
      .element(by.cssContainingText('mat-icon', 'create'))
      .click();
    page.fillAndSubmitFamilyForm(updatedName, 'israel');
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
