import { browser, by, element } from 'protractor';
import { appUrls } from './app-urls';

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

export async function clearLocalStorage() {
  browser.executeScript('window.localStorage.clear();');
}

export function escapeRegExp(expression: string): string {
  return expression.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function typeInInput(inputName: string, value: string): void {
  const input = element(by.css(`input[name="${inputName}"]`));
  input.clear();
  input.sendKeys(value);
}

export function getSubmitButton() {
  return element(by.css('button[type="submit"]'));
}

export function submitForm() {
  getSubmitButton().click();
}
