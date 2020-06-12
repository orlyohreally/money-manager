import { browser, by, element, ExpectedConditions, Key } from 'protractor';
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
  return element(by.css('h1')).getText();
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
  input.click();
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

export function setDatetimeInput(inputParentSelector: string, value: string) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const date = new Date(value);
  const year = date.getFullYear();
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  const calendarIcon = element(by.css(inputParentSelector)).element(
    by.css('mat-datepicker-toggle button')
  );
  calendarIcon.click();
  const calendarEl = element(by.css('ngx-mat-datetime-content'));
  calendarEl.element(by.className('mat-calendar-period-button')).click();
  calendarEl
    .element(by.css(`.mat-calendar-body-cell[aria-label="${year}"]`))
    .click();
  calendarEl
    .element(by.css(`.mat-calendar-body-cell[aria-label="${month} ${year}"]`))
    .click();
  calendarEl
    .element(
      by.css(`.mat-calendar-body-cell[aria-label="${month} ${day}, ${year}"]`)
    )
    .click();
  const hoursInput = calendarEl.element(
    by.css('input[formcontrolname="hour"]')
  );
  hoursInput.click();
  hoursInput.sendKeys(Key.chord(Key.CONTROL, 'a'));
  hoursInput.sendKeys(hours);
  const minutesInput = calendarEl.element(
    by.css('input[formcontrolname="minute"]')
  );
  minutesInput.click();
  minutesInput.sendKeys(Key.chord(Key.CONTROL, 'a'));
  minutesInput.sendKeys(minutes);
  element(by.css('ngx-mat-datetime-content'))
    .element(by.buttonText('done'))
    .click();
}
