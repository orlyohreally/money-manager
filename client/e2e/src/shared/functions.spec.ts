import { browser, by, element, ExpectedConditions } from 'protractor';
import { appUrls } from './app-urls';
import { constants } from './constants';

export function getPageUrl(pageAlias: string): string {
  return `${browser.baseUrl}${appUrls[pageAlias]}`;
}

export async function goToPage(pageAlias: string): Promise<void> {
  return browser.get(getPageUrl(pageAlias));
}

export async function getTitleText(): Promise<string> {
  return browser.getTitle();
}

export async function getTextTitle(): Promise<string> {
  return element(by.css('.mat-h1')).getText();
}

export function clearLocalStorage() {
  goToPage('main');
  browser.executeScript(
    'window.localStorage.clear(); window.location.reload();'
  );
}

export function escapeRegExp(expression: string): string {
  return expression.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function typeInInput(inputName: string, value: string): void {
  const input = element(by.css(`input[name="${inputName}"]`));
  input.clear();
  // input.sendKeys(value) not always works properly so use this workaround
  for (const character of value) {
    input.sendKeys(character);
  }
}

export function getSubmitButton() {
  return element(by.css('button[type="submit"]'));
}

export function submitForm() {
  getSubmitButton().click();
}

export function waitForForm() {
  browser.wait(
    ExpectedConditions.presenceOf(element(by.css('form'))),
    constants.waitTimeout
  );
}

export function waitForFormToClose() {
  browser.wait(
    ExpectedConditions.not(
      ExpectedConditions.presenceOf(element(by.css('form')))
    ),
    constants.waitTimeout
  );
}
