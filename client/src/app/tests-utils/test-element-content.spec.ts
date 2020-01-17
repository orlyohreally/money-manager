export function expectTextContentToBe(
  element: HTMLElement,
  expectedText: string
): void {
  expect(element.textContent.trim()).toBe(expectedText);
}
